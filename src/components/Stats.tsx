import React from 'react';

interface StatsProps {
    score: number;
    energy: number;
    maxEnergy: number;
}

export const Stats: React.FC<StatsProps> = ({ score, energy, maxEnergy }) => {
    const energyPercent = (energy / maxEnergy) * 100;

    return (
        <div className="stats-container">
            <div className="score-display">
                {score.toLocaleString()}
            </div>

            <div className="stats-bar">
                <div className="energy-container">
                    <div className="energy-text">
                        <span>⚡ Energy</span>
                        <span>{Math.floor(energy)} / {maxEnergy}</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className={`progress-fill ${energy >= maxEnergy ? 'full' : ''}`}
                            style={{ width: `${energyPercent}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
