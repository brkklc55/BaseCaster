import React, { useState, useEffect } from 'react';

interface AirdropProps {
    onClose: () => void;
}

export const Airdrop: React.FC<AirdropProps> = ({ onClose }) => {
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    useEffect(() => {
        const storedWallet = localStorage.getItem('basecaster_wallet');
        if (storedWallet) {
            setWalletConnected(true);
            setWalletAddress(storedWallet);
        }
    }, []);

    const handleConnectWallet = () => {
        // Simulate wallet connection
        const mockAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        setWalletConnected(true);
        setWalletAddress(mockAddress);
        localStorage.setItem('basecaster_wallet', mockAddress);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Airdrop 🪂</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🪙</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>$BC Token</h3>
                    <p style={{ color: '#888', marginBottom: '20px' }}>Listing is on the way!</p>

                    {!walletConnected ? (
                        <button
                            className="buy-btn"
                            onClick={handleConnectWallet}
                            style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}
                        >
                            🔗 Connect Wallet
                        </button>
                    ) : (
                        <div style={{
                            background: 'rgba(0, 255, 0, 0.1)',
                            border: '1px solid #00ff00',
                            padding: '15px',
                            borderRadius: '12px',
                            color: '#00ff00'
                        }}>
                            ✅ Wallet Connected
                            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '5px' }}>
                                {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                            </div>
                        </div>
                    )}
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
