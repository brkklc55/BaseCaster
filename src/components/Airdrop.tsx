import React, { useState, useEffect } from 'react';

interface AirdropProps {
    onClose: () => void;
}

export const Airdrop: React.FC<AirdropProps> = ({ onClose }) => {
    const [walletConnected, setWalletConnected] = useState(false);

    useEffect(() => {
        const storedWallet = localStorage.getItem('basecaster_wallet');
        if (storedWallet) {
            setWalletConnected(true);
        }
    }, []);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Airdrop 🪂</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <img
                        src="/icon.png"
                        alt="Token Logo"
                        style={{
                            width: '80px',
                            height: '80px',
                            marginBottom: '10px',
                            borderRadius: '50%',
                            boxShadow: '0 0 20px rgba(0, 82, 255, 0.5)'
                        }}
                    />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>$BC Token</h3>
                    <p style={{ color: '#888', marginBottom: '20px' }}>Listing is on the way!</p>

                    <button
                        className="buy-btn"
                        disabled={true}
                        style={{
                            width: '100%',
                            padding: '15px',
                            fontSize: '1.1rem',
                            opacity: 0.7,
                            cursor: 'not-allowed',
                            background: '#333',
                            color: '#888',
                            border: '2px solid #555'
                        }}
                    >
                        🔗 Wallet Connect (Soon)
                    </button>
                </div>

                <div className="shop-list" style={{ marginTop: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Tasks</h3>

                    <div className="shop-item" style={{ opacity: 0.7 }}>
                        <div className="item-icon">🔒</div>
                        <div className="item-details">
                            <h3>Connect Wallet</h3>
                            <p>{walletConnected ? 'Completed' : 'Connect your TON/Base wallet'}</p>
                        </div>
                        <div style={{ color: walletConnected ? '#00ff00' : '#888' }}>
                            {walletConnected ? '✓' : 'Wait'}
                        </div>
                    </div>

                    <div className="shop-item" style={{ opacity: 0.5 }}>
                        <div className="item-icon">⏳</div>
                        <div className="item-details">
                            <h3>Listing Date</h3>
                            <p>Coming Soon</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
