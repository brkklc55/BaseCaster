import React, { useState, useEffect } from 'react';

interface TasksProps {
    onClose: () => void;
    addReward: (amount: number) => void;
}

const DAILY_REWARD = 1000;
const SOCIAL_REWARD = 5000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const Tasks: React.FC<TasksProps> = ({ onClose, addReward }) => {
    const [lastLogin, setLastLogin] = useState<number>(0);
    const [twitterStatus, setTwitterStatus] = useState<'initial' | 'verifying' | 'claimed'>('initial');
    const [farcasterStatus, setFarcasterStatus] = useState<'initial' | 'verifying' | 'claimed'>('initial');
    const [verifying, setVerifying] = useState<string | null>(null);

    useEffect(() => {
        const storedLogin = localStorage.getItem('basecaster_last_login');
        if (storedLogin) setLastLogin(parseInt(storedLogin));

        const storedTwitter = localStorage.getItem('basecaster_task_twitter');
        if (storedTwitter) {
            setTwitterStatus('claimed');
        } else if (localStorage.getItem('basecaster_task_twitter_verifying')) {
            setTwitterStatus('verifying');
        }

        const storedFarcaster = localStorage.getItem('basecaster_task_farcaster');
        if (storedFarcaster) {
            setFarcasterStatus('claimed');
        } else if (localStorage.getItem('basecaster_task_farcaster_verifying')) {
            setFarcasterStatus('verifying');
        }
    }, []);

    const canClaimDaily = Date.now() - lastLogin > ONE_DAY_MS;

    const handleDailyClaim = () => {
        if (canClaimDaily) {
            addReward(DAILY_REWARD);
            const now = Date.now();
            setLastLogin(now);
            localStorage.setItem('basecaster_last_login', now.toString());
        }
    };

    const handleSocialClick = (platform: 'twitter' | 'farcaster') => {
        if (platform === 'twitter') {
            window.open('https://x.com/MPoopybuttho1e', '_blank');
            setTwitterStatus('verifying');
            localStorage.setItem('basecaster_task_twitter_verifying', 'true');
        } else {
            window.open('https://warpcast.com/poopybuttho1e', '_blank');
            setFarcasterStatus('verifying');
            localStorage.setItem('basecaster_task_farcaster_verifying', 'true');
        }
    };

    const handleVerify = (platform: 'twitter' | 'farcaster') => {
        setVerifying(platform);
        setTimeout(() => {
            setVerifying(null);
            addReward(SOCIAL_REWARD);
            if (platform === 'twitter') {
                setTwitterStatus('claimed');
                localStorage.setItem('basecaster_task_twitter', 'true');
                localStorage.removeItem('basecaster_task_twitter_verifying');
            } else {
                setFarcasterStatus('claimed');
                localStorage.setItem('basecaster_task_farcaster', 'true');
                localStorage.removeItem('basecaster_task_farcaster_verifying');
            }
        }, 2000);
    };

    const getButtonContent = (status: 'initial' | 'verifying' | 'claimed', platform: 'twitter' | 'farcaster') => {
        if (status === 'claimed') return 'Done';
        if (verifying === platform) return 'Checking...';
        if (status === 'verifying') return 'Check';
        return `+${SOCIAL_REWARD}`;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Tasks</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="shop-list">
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

                    <div className="shop-item" style={{ cursor: 'default' }}>
                        <div className="item-icon">🐦</div>
                        <div className="item-details">
                            <h3>Follow on X</h3>
                            <p>@MPoopybuttho1e</p>
                        </div>
                        <button
                            className="buy-btn"
                            disabled={twitterStatus === 'claimed' || verifying === 'twitter'}
                            onClick={() => twitterStatus === 'initial' ? handleSocialClick('twitter') : handleVerify('twitter')}
                            style={twitterStatus === 'verifying' ? { background: '#e6b800' } : {}}
                        >
                            {getButtonContent(twitterStatus, 'twitter')}
                        </button>
                    </div>

                    <div className="shop-item" style={{ cursor: 'default' }}>
                        <div className="item-icon">🟣</div>
                        <div className="item-details">
                            <h3>Follow on Farcaster</h3>
                            <p>@poopybuttho1e</p>
                        </div>
                        <button
                            className="buy-btn"
                            disabled={farcasterStatus === 'claimed' || verifying === 'farcaster'}
                            onClick={() => farcasterStatus === 'initial' ? handleSocialClick('farcaster') : handleVerify('farcaster')}
                            style={farcasterStatus === 'verifying' ? { background: '#e6b800' } : {}}
                        >
                            {getButtonContent(farcasterStatus, 'farcaster')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
