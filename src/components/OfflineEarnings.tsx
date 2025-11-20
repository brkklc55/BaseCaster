import React from 'react';

interface OfflineEarningsProps {
    earnings: number;
    onClaim: () => void;
}

export const OfflineEarnings: React.FC<OfflineEarningsProps> = ({ earnings, onClaim }) => {
    if (earnings <= 0) return null;

    return (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
            <div className="modal-content" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💤💰</div>
                <h2>Welcome Back!</h2>
                <p style={{ color: '#888', marginBottom: '2rem' }}>
                    While you were away, your mining rig generated coins for you.
                </p>

                <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#4CAF50',
                    marginBottom: '2rem',
                    textShadow: '0 0 20px rgba(76, 175, 80, 0.3)'
                }}>
                    +{earnings.toLocaleString()}
                </div>

                <button
                    className="buy-btn"
                    onClick={onClaim}
                    style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}
                >
                    Claim Earnings
                </button>
            </div>
        </div>
    );
};
