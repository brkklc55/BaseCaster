import { useState, useEffect, useCallback } from 'react';


const BASE_ENERGY = 1000;
const REGEN_RATE = 1;
const STORAGE_KEY = 'basecaster_save_v2';

interface GameState {
    score: number;
    totalScore: number;
    energy: number;
    multitapLevel: number;
    energyLimitLevel: number;
    lastUpdated: number;
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

    const maxEnergy = BASE_ENERGY + (energyLimitLevel * 500);
    const clickPower = 1 + multitapLevel;

    // Load game state
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed: GameState = JSON.parse(saved);
                setScore(parsed.score);
                setTotalScore(parsed.totalScore || parsed.score); // Backwards compatibility
                setMultitapLevel(parsed.multitapLevel || 0);
                setEnergyLimitLevel(parsed.energyLimitLevel || 0);

                // Recalculate max energy based on loaded level
                const currentMaxEnergy = BASE_ENERGY + ((parsed.energyLimitLevel || 0) * 500);

                const now = Date.now();
                const elapsedSeconds = Math.floor((now - parsed.lastUpdated) / 1000);
                const regenerated = elapsedSeconds * REGEN_RATE;
                setEnergy(Math.min(currentMaxEnergy, parsed.energy + regenerated));
            } catch (e) {
                console.error('Failed to load save', e);
            }
        }

        // Check for referral
        const urlParams = new URLSearchParams(window.location.search);
        const refId = urlParams.get('ref');
        const hasClaimedRef = localStorage.getItem('basecaster_ref_claimed');

        if (refId && !hasClaimedRef) {
            // Award 10k bonus
            setScore(s => s + 10000);
            setTotalScore(s => s + 10000);
            localStorage.setItem('basecaster_ref_claimed', 'true');
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
            alert("🎉 Welcome! You received 10,000 $BC referral bonus!");
        }

        setIsLoaded(true);
    }, []);

    // Regen loop
    useEffect(() => {
        if (!isLoaded) return;

        const interval = setInterval(() => {
            setEnergy((prev) => Math.min(maxEnergy, prev + REGEN_RATE));
        }, 1000);

        return () => clearInterval(interval);
    }, [isLoaded, maxEnergy]);

    // Persistence
    useEffect(() => {
        if (!isLoaded) return;

        const state: GameState = {
            score,
            totalScore,
            energy,
            multitapLevel,
            energyLimitLevel,
            lastUpdated: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [score, totalScore, energy, multitapLevel, energyLimitLevel, isLoaded]);

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
        if (type === 'multitap') {
            const cost = UPGRADE_COSTS.multitap(multitapLevel);
            if (score >= cost) {
                setScore(s => s - cost);
                setMultitapLevel(l => l + 1);
                return true;
            }
        } else if (type === 'energyLimit') {
            const cost = UPGRADE_COSTS.energyLimit(energyLimitLevel);
            if (score >= cost) {
                setScore(s => s - cost);
                setEnergyLimitLevel(l => l + 1);
                return true;
            }
        }
        return false;
    };

    const addReward = (amount: number) => {
        setScore(s => s + amount);
        setTotalScore(s => s + amount);
    };

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
        addReward
    };
};
