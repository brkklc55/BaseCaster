import React, { useState, useEffect } from 'react';

interface TasksProps {
    onClose: () => void;
    onReward: (amount: number) => void;
}

const DAILY_REWARD = 1000;
const SOCIAL_REWARD = 5000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const Tasks: React.FC<TasksProps> = ({ onClose, onReward }) => {
    const [lastLogin, setLastLogin] = useState<number>(0);
    const [twitterClaimed, setTwitterClaimed] = useState(false);
    const [farcasterClaimed, setFarcasterClaimed] = useState(false);

    useEffect(() => {
        const storedLogin = localStorage.getItem('basecaster_last_login');
        if (storedLogin) setLastLogin(parseInt(storedLogin));

        const storedTwitter = localStorage.getItem('basecaster_task_twitter');
        if (storedTwitter) setTwitterClaimed(true);

        const storedFarcaster = localStorage.getItem('basecaster_task_farcaster');
        if (storedFarcaster) setFarcasterClaimed(true);
    }, []);

    const canClaimDaily = Date.now() - lastLogin > ONE_DAY_MS;

    const handleDailyClaim = () => {
        if (canClaimDaily) {
            onReward(DAILY_REWARD);
            const now = Date.now();
            setLastLogin(now);
            localStorage.setItem('basecaster_last_login', now.toString());
        }
    };

    const handleSocialClaim = (platform: 'twitter' | 'farcaster') => {
        if (platform === 'twitter' && !twitterClaimed) {
            window.open('https://x.com/MPoopybuttho1e', '_blank');
            // Simulate verification delay or just trust the user for MVP
            setTimeout(() => {
                if (window.confirm('Did you follow @MPoopybuttho1e on Twitter?')) {
                    onReward(SOCIAL_REWARD);
                    setTwitterClaimed(true);
                    localStorage.setItem('basecaster_task_twitter', 'true');
                }
            }, 1000);
        } else if (platform === 'farcaster' && !farcasterClaimed) {
            window.open('https://farcaster.xyz/poopybuttho1e', '_blank'); // Using a generic viewer link as placeholder
            setTimeout(() => {
                if (window.confirm('Did you follow @poopybuttho1e on Farcaster?')) {
                    onReward(SOCIAL_REWARD);
                    setFarcasterClaimed(true);
                    localStorage.setItem('basecaster_task_farcaster', 'true');
                }
            }, 1000);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Tasks</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="shop-list">
                    {/* Daily Login */}
                    <div className="shop-item" style={{ cursor: 'default' }}>
                        <div className="item-icon">📅</div>
                        <div className="item-details">
                            <h3>Daily Login</h3>
                            <p>Come back every day!</p>
                        </div>
                        <button
                            className="buy-btn"
                            disabled={!canClaimDaily}
                            onClick={handleDailyClaim}
                        >
                            {canClaimDaily ? `+${DAILY_REWARD}` : 'Wait'}
                        </button>
                    </div>

                    {/* Twitter Task */}
                    <div className="shop-item" style={{ cursor: 'default' }}>
                        <div className="item-icon">🐦</div>
                        <div className="item-details">
                            <h3>Follow on X</h3>
                            <p>@MPoopybuttho1e</p>
                        </div>
                        <button
                            className="buy-btn"
                            disabled={twitterClaimed}
                            onClick={() => handleSocialClaim('twitter')}
                        >
                            {twitterClaimed ? 'Done' : `+${SOCIAL_REWARD}`}
                        </button>
                    </div>

                    {/* Farcaster Task */}
                    <div className="shop-item" style={{ cursor: 'default' }}>
                        <div className="item-icon">🟣</div>
                        <div className="item-details">
                            <h3>Follow on Farcaster</h3>
                            <p>@poopybuttho1e</p>
                        </div>
                        <button
                            className="buy-btn"
                            disabled={farcasterClaimed}
                            onClick={() => handleSocialClaim('farcaster')}
                        >
                            {farcasterClaimed ? 'Done' : `+${SOCIAL_REWARD}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
