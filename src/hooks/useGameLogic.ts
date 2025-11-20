import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';

const BASE_ENERGY = 1000;
const REGEN_RATE = 1;
const STORAGE_KEY = 'basecaster_save_v2';

export interface MiningCard {
    id: string;
    name: string;
    baseCost: number;
    baseProfit: number;
    level: number;
    image: string;
}

const INITIAL_CARDS: MiningCard[] = [
    { id: 'newbie', name: 'Newbie', baseCost: 500, baseProfit: 50, level: 0, image: '👶' },
    { id: 'caster', name: 'Caster', baseCost: 1500, baseProfit: 120, level: 0, image: '🎙️' },
    { id: 'reply_guy', name: 'Reply Guy', baseCost: 5000, baseProfit: 350, level: 0, image: '💬' },
    { id: 'meme_creator', name: 'Meme Creator', baseCost: 15000, baseProfit: 900, level: 0, image: '🎨' },
    { id: 'channel_host', name: 'Channel Host', baseCost: 50000, baseProfit: 2500, level: 0, image: '📺' },
    { id: 'developer', name: 'Developer', baseCost: 200000, baseProfit: 8000, level: 0, image: '👨‍💻' },
    { id: 'protocol_dev', name: 'Protocol Dev', baseCost: 1000000, baseProfit: 35000, level: 0, image: '🌐' },
];

interface GameState {
    score: number;
    totalScore: number;
    energy: number;
    multitapLevel: number;
    energyLimitLevel: number;
    lastSaveTime: number;
    username?: string | null;
    walletAddress?: string | null;
    miningCards?: MiningCard[];
    // Legacy
    lastUpdated?: number;
}

export const UPGRADE_COSTS = {
    multitap: (level: number) => Math.floor(100 * Math.pow(2, level)),
    energyLimit: (level: number) => Math.floor(100 * Math.pow(2, level)),
};

export const useGameLogic = () => {
    const [score, setScore] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [energy, setEnergy] = useState(BASE_ENERGY);
    const [multitapLevel, setMultitapLevel] = useState(0);
    const [energyLimitLevel, setEnergyLimitLevel] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    const [miningCards, setMiningCards] = useState<MiningCard[]>(INITIAL_CARDS);
    const [offlineEarnings, setOfflineEarnings] = useState<number>(0);

    const maxEnergy = BASE_ENERGY + (energyLimitLevel * 500);
    const clickPower = 1 + multitapLevel * 2;

    const profitPerHour = miningCards.reduce((total, card) => {
        return total + (card.level * card.baseProfit);
    }, 0);

    // Load game state
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed: GameState = JSON.parse(saved);
                setScore(parsed.score || 0);
                setTotalScore(parsed.totalScore || parsed.score || 0);
                setMultitapLevel(parsed.multitapLevel || 0);
                setEnergyLimitLevel(parsed.energyLimitLevel || 0);
                setUsername(parsed.username || null);
                setWalletAddress(parsed.walletAddress || null);

                if (parsed.miningCards) {
                    // Merge saved cards with initial cards to handle new additions
                    const mergedCards = INITIAL_CARDS.map(initialCard => {
                        const savedCard = parsed.miningCards?.find(c => c.id === initialCard.id);
                        return savedCard || initialCard;
                    });
                    setMiningCards(mergedCards);
                }

                // Calculate offline energy regen & mining earnings
                const lastTime = parsed.lastSaveTime || parsed.lastUpdated || Date.now();
                const now = Date.now();
                const elapsedSeconds = (now - lastTime) / 1000;

                // Energy
                const currentMaxEnergy = BASE_ENERGY + ((parsed.energyLimitLevel || 0) * 500);
                const regenerated = elapsedSeconds * REGEN_RATE;
                setEnergy(Math.min(currentMaxEnergy, (parsed.energy || 0) + regenerated));

                // Mining Earnings (Max 3 hours)
                const pph = (parsed.miningCards || []).reduce((total, card) => total + (card.level * card.baseProfit), 0);
                if (pph > 0) {
                    const earnedSeconds = Math.min(elapsedSeconds, 3 * 60 * 60); // Cap at 3 hours
                    const earned = Math.floor((pph / 3600) * earnedSeconds);
                    if (earned > 0) {
                        setOfflineEarnings(earned);
                    }
                }

            } catch (e) {
                console.error('Failed to load save', e);
            }
        }

        // Check for referral
        const urlParams = new URLSearchParams(window.location.search);
        const refId = urlParams.get('ref');
        const hasClaimedRef = localStorage.getItem('basecaster_ref_claimed');

        if (refId && !hasClaimedRef) {
            setScore(s => s + 10000);
            setTotalScore(s => s + 10000);
            localStorage.setItem('basecaster_ref_claimed', 'true');
            window.history.replaceState({}, '', window.location.pathname);
            alert("🎉 Welcome! You received 10,000 $BC referral bonus!");
        }

        setIsLoaded(true);
    }, []);

    // Regen loop
    useEffect(() => {
        if (!isLoaded) return;

        const interval = setInterval(() => {
            setEnergy(prev => {
                const currentMax = BASE_ENERGY + energyLimitLevel * 500;
                if (prev < currentMax) {
                    return Math.min(currentMax, prev + REGEN_RATE);
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [energyLimitLevel, isLoaded]);

    // Persistence
    useEffect(() => {
        if (!isLoaded) return;

        const state: GameState = {
            score,
            totalScore,
            energy,
            multitapLevel,
            energyLimitLevel,
            username,
            walletAddress,
            miningCards,
            lastSaveTime: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [score, totalScore, energy, multitapLevel, energyLimitLevel, isLoaded, username, walletAddress, miningCards]);

    const handleClick = useCallback(() => {
        if (energy >= clickPower) {
            setScore(s => s + clickPower);
            setTotalScore(s => s + clickPower);
            setEnergy(e => e - clickPower);
            return true;
        }
        return false;
    }, [energy, clickPower]);

    const buyUpgrade = (type: 'multitap' | 'energyLimit') => {
        const cost = type === 'multitap'
            ? UPGRADE_COSTS.multitap(multitapLevel)
            : UPGRADE_COSTS.energyLimit(energyLimitLevel);

        if (score >= cost) {
            setScore(s => s - cost);
            if (type === 'multitap') {
                setMultitapLevel(l => l + 1);
            } else {
                setEnergyLimitLevel(l => l + 1);
            }
            return true;
        }
        return false;
    };

    const buyCard = (cardId: string) => {
        const cardIndex = miningCards.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return false;

        const card = miningCards[cardIndex];
        // Cost formula: BaseCost * (1.15 ^ Level)
        const cost = Math.floor(card.baseCost * Math.pow(1.15, card.level));

        if (score >= cost) {
            setScore(s => s - cost);

            const newCards = [...miningCards];
            newCards[cardIndex] = {
                ...card,
                level: card.level + 1
            };
            setMiningCards(newCards);
            return true;
        }
        return false;
    };

    const addReward = (amount: number) => {
        setScore(s => s + amount);
        setTotalScore(s => s + amount);
    };

    const claimOfflineEarnings = () => {
        if (offlineEarnings > 0) {
            addReward(offlineEarnings);
            setOfflineEarnings(0);
        }
    };

    const setProfile = (name: string, wallet: string) => {
        setUsername(name);
        setWalletAddress(wallet);
    };

    // Supabase Sync
    useEffect(() => {
        if (!username) return;

        const syncToSupabase = async () => {
            let userId = localStorage.getItem('basecaster_user_id');
            if (!userId) {
                userId = Math.random().toString(36).substring(2, 15);
                localStorage.setItem('basecaster_user_id', userId);
            }

            const { error } = await supabase
                .from('users')
                .upsert({
                    id: userId,
                    username: username,
                    score: totalScore,
                    updated_at: new Date().toISOString()
                });

            if (error) console.error('Supabase sync error:', error);
        };

        // Sync immediately on profile set, then every 10s
        syncToSupabase();
        const interval = setInterval(syncToSupabase, 10000);
        return () => clearInterval(interval);
    }, [username, totalScore]);

    // Notification Logic
    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notification');
            return;
        }
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            new Notification('Notifications enabled! 🚀', {
                body: 'We will notify you when your energy is full.',
                icon: '/icon.png'
            });
        }
    };

    const notificationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const targetTimeRef = useRef<number>(0);

    useEffect(() => {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;

        if (energy >= maxEnergy) {
            if (notificationTimerRef.current) {
                clearTimeout(notificationTimerRef.current);
                notificationTimerRef.current = null;
            }
            return;
        }

        const timeToFull = (maxEnergy - energy) / REGEN_RATE;
        const newTargetTime = Date.now() + (timeToFull * 1000);

        if (Math.abs(newTargetTime - targetTimeRef.current) < 2000) {
            return;
        }

        targetTimeRef.current = newTargetTime;
        if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);

        notificationTimerRef.current = setTimeout(() => {
            new Notification('🔋 Energy Full!', {
                body: 'Your energy is fully recharged. Come back and tap! ⚡',
                icon: '/icon.png'
            });
            notificationTimerRef.current = null;
        }, timeToFull * 1000);

        return () => {
            if (notificationTimerRef.current) {
                clearTimeout(notificationTimerRef.current);
            }
        };
    }, [energy, maxEnergy]);

    return {
        score,
        totalScore,
        energy,
        maxEnergy,
        clickPower,
        multitapLevel,
        energyLimitLevel,
        miningCards,
        profitPerHour,
        offlineEarnings,
        incrementScore: handleClick,
        buyUpgrade,
        buyCard,
        addReward,
        claimOfflineEarnings,
        username,
        walletAddress,
        setProfile,
        requestNotificationPermission
    };
};
