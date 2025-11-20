import React, { useState } from 'react';
import { UPGRADE_COSTS, type MiningCard } from '../hooks/useGameLogic';

interface ShopProps {
    onClose: () => void;
    score: number;
    multitapLevel: number;
    energyLimitLevel: number;
    buyUpgrade: (type: 'multitap' | 'energyLimit') => boolean;
    miningCards: MiningCard[];
    profitPerHour: number;
    buyCard: (cardId: string) => boolean;
}

export const Shop: React.FC<ShopProps> = ({
    onClose,
    score,
    multitapLevel,
    energyLimitLevel,
    buyUpgrade,
    miningCards,
    profitPerHour,
    buyCard
}) => {
    const [activeTab, setActiveTab] = useState<'boosts' | 'mining'>('mining');

    const multitapCost = UPGRADE_COSTS.multitap(multitapLevel);
    const energyLimitCost = UPGRADE_COSTS.energyLimit(energyLimitLevel);

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                <div className="modal-header">
                    <h2>Shop</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                {/* PPH Display */}
                <div style={{
                    background: 'rgba(0, 82, 255, 0.1)',
                    padding: '10px',
                    borderRadius: '12px',
                    marginBottom: '15px',
                    textAlign: 'center',
                    border: '1px solid rgba(0, 82, 255, 0.3)'
                }}>
                    <div style={{ fontSize: '0.9rem', color: '#888' }}>Profit Per Hour</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0052FF' }}>
                        💰 {profitPerHour.toLocaleString()}
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button
                        onClick={() => setActiveTab('mining')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '12px',
                            border: 'none',
                            background: activeTab === 'mining' ? '#0052FF' : 'rgba(255,255,255,0.1)',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        ⛏️ Mining
                    </button>
                    <button
                        onClick={() => setActiveTab('boosts')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '12px',
                            border: 'none',
                            background: activeTab === 'boosts' ? '#0052FF' : 'rgba(255,255,255,0.1)',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        🚀 Boosts
                    </button>
                </div>

                <div className="shop-items" style={{ overflowY: 'auto', paddingRight: '5px' }}>
                    {activeTab === 'boosts' ? (
                        <>
                            <div
                                className={`shop-item ${score >= multitapCost ? '' : 'disabled'}`}
                                onClick={() => buyUpgrade('multitap')}
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
                                onClick={() => buyUpgrade('energyLimit')}
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
                        </>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {miningCards.map(card => {
                                const cost = Math.floor(card.baseCost * Math.pow(1.15, card.level));
                                const canBuy = score >= cost;

                                return (
                                    <div
                                        key={card.id}
                                        onClick={() => canBuy && buyCard(card.id)}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            cursor: canBuy ? 'pointer' : 'not-allowed',
                                            opacity: canBuy ? 1 : 0.6,
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            gap: '5px'
                                        }}
                                    >
                                        <div style={{ fontSize: '2rem' }}>{card.image}</div>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{card.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#888' }}>Lvl {card.level}</div>

                                        <div style={{ fontSize: '0.7rem', color: '#4CAF50' }}>
                                            +{card.baseProfit} PPH
                                        </div>

                                        <div style={{
                                            marginTop: '5px',
                                            background: canBuy ? '#0052FF' : '#333',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            width: '100%'
                                        }}>
                                            💰 {cost.toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
