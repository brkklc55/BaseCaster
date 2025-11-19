import React, { useState } from 'react';

interface WelcomeProps {
    onComplete: (username: string, wallet: string) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onComplete }) => {
    const [username, setUsername] = useState('');
    const [wallet, setWallet] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && wallet) {
            onComplete(username, wallet);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content welcome-modal">
                <h2>🚀 Welcome to Basecaster</h2>
                <p>Enter your details to start earning $BC.</p>

                <form onSubmit={handleSubmit} className="welcome-form">
                    <div className="form-group">
                        <label>Farcaster Username</label>
                        <input
                            type="text"
                            placeholder="@username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Base Wallet Address</label>
                        <input
                            type="text"
                            placeholder="0x..."
                            value={wallet}
                            onChange={(e) => setWallet(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="buy-btn" disabled={!username || !wallet}>
                        Start Playing
                    </button>
                </form>
            </div>
        </div>
    );
};
