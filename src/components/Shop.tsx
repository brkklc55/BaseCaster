import React from 'react';
import { UPGRADE_COSTS } from '../hooks/useGameLogic';

interface ShopProps {
    score: number;
    multitapLevel: number;
    energyLimitLevel: number;
    onBuy: (type: 'multitap' | 'energyLimit') => boolean;
    onClose: () => void;
}

export const Shop: React.FC<ShopProps> = ({ score, multitapLevel, energyLimitLevel, onBuy, onClose }) => {
    const multitapCost = UPGRADE_COSTS.multitap(multitapLevel);
    const energyLimitCost = UPGRADE_COSTS.energyLimit(energyLimitLevel);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Boosters</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="shop-items">
                    <div
                        className={`shop-item ${score >= multitapCost ? '' : 'disabled'}`}
                        onClick={() => onBuy('multitap')}
                    >
                        <div className="item-icon">👆</div>
                        <div className="item-details">
                            <h3>Multitap</h3>
                            <p>Level {multitapLevel + 1}</p>
                        </div>
                        <div className="item-cost">
                            <span className="coin-icon">💰</span>
                            {multitapCost.toLocaleString()}
                        </div>
                    </div>

                    <div
                        className={`shop-item ${score >= energyLimitCost ? '' : 'disabled'}`}
                        onClick={() => onBuy('energyLimit')}
                    >
                        <div className="item-icon">🔋</div>
                        <div className="item-details">
                            <h3>Energy Limit</h3>
                            <p>Level {energyLimitLevel + 1}</p>
                        </div>
                        <div className="item-cost">
                            <span className="coin-icon">💰</span>
                            {energyLimitCost.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
