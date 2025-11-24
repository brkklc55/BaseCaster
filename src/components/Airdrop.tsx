import React from 'react';

interface AirdropProps {
    onClose: () => void;
}

export const Airdrop: React.FC<AirdropProps> = ({ onClose }) => {
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
                    <h3 style={{
                        fontSize: '1.5rem',
                        marginBottom: '5px',
                        background: 'linear-gradient(to right, #fff, #4da6ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontFamily: '"Press Start 2P", cursive'
                    }}>$BC Token</h3>
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
                    <div className="shop-item" style={{ opacity: 0.7 }}>
                        <div className="item-icon">🔒</div>
                        <div className="item-details">
                            <h3>Connect Wallet</h3>
                            <p style={{ fontSize: '0.6rem', color: '#888' }}>Connect your Base wallet</p>
                        </div>
                        <div style={{ color: '#888' }}>
                            Wait
                        </div>
                    </div>

                    <div className="shop-item" style={{ opacity: 0.5 }}>
                        <div className="item-icon">⏳</div>
                        <div className="item-details">
                            <h3>Listing Date</h3>
                            <p style={{ fontSize: '0.6rem', color: '#888' }}>Coming Soon</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
