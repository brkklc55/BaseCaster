import React, { useState, useEffect } from 'react';

interface FriendsProps {
    onClose: () => void;
}

export const Friends: React.FC<FriendsProps> = ({ onClose }) => {
    const [userId, setUserId] = useState<string>('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let storedId = localStorage.getItem('basecaster_user_id');
        if (!storedId) {
            storedId = Math.random().toString(36).substring(2, 10);
            localStorage.setItem('basecaster_user_id', storedId);
        }
        setUserId(storedId);
    }, []);

    const baseUrl = 'https://base-caster-ebon.vercel.app';
    const inviteLink = `https://warpcast.com/~/frames/launch?url=${encodeURIComponent(`${baseUrl}/?ref=${userId}`)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Friends</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
                    <h3>Invite Friends!</h3>
                    <p style={{ color: '#888', marginBottom: '1.5rem' }}>
                        You and your friend will receive bonuses.
                    </p>

                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '1rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        <div style={{
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            color: '#4da6ff'
                        }}>
                            {inviteLink}
                        </div>
                        <button
                            className="buy-btn"
                            onClick={handleCopy}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>

                    <button
                        className="buy-btn"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#855DCD' }}
                        onClick={() => {
                            const text = `I'm earning $BC on Basecaster! Join me and get 10k bonus points! 🚀`;
                            const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(inviteLink)}`;
                            window.open(shareUrl, '_blank');
                        }}
                    >
                        🟣 Cast on Farcaster
                    </button>
                </div>

                <div className="shop-list">
                    <h3 style={{ margin: '0 0 1rem 0' }}>Your Friends (0)</h3>
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        color: '#666'
                    }}>
                        You haven't invited anyone yet.
                    </div>
                </div>
            </div>
        </div>
    );
};
