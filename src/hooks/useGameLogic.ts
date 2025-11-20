import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const BASE_ENERGY = 1000;
const REGEN_RATE = 1;
const STORAGE_KEY = 'basecaster_save_v2';

interface GameState {
    score: number;
    totalScore: number;
    energy: number;
    multitapLevel: number;
    energyLimitLevel: number;
    lastSaveTime: number;
    username?: string | null;
    walletAddress?: string | null;
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

    const maxEnergy = BASE_ENERGY + (energyLimitLevel * 500);
    const clickPower = 1 + multitapLevel * 2;

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

                // Calculate offline energy regen
                const lastTime = parsed.lastSaveTime || parsed.lastUpdated || Date.now();
                const elapsedSeconds = (Date.now() - lastTime) / 1000;
                const currentMaxEnergy = BASE_ENERGY + ((parsed.energyLimitLevel || 0) * 500);
                const regenerated = elapsedSeconds * REGEN_RATE;

                setEnergy(Math.min(currentMaxEnergy, (parsed.energy || 0) + regenerated));
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
            lastSaveTime: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [score, totalScore, energy, multitapLevel, energyLimitLevel, isLoaded, username, walletAddress]);

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

    const addReward = (amount: number) => {
        setScore(s => s + amount);
        setTotalScore(s => s + amount);
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

    return {
        score,
        totalScore,
        energy,
        maxEnergy,
        clickPower,
        multitapLevel,
        energyLimitLevel,
        incrementScore: handleClick,
        buyUpgrade,
        addReward,
        username,
        walletAddress,
        setProfile
    };
};
