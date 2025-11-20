import React, { useState, useEffect } from 'react';

interface TasksProps {
    onClose: () => void;
    addReward: (amount: number) => void;
}

const SOCIAL_REWARD = 5000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const Tasks: React.FC<TasksProps> = ({ onClose, addReward }) => {
    const [twitterStatus, setTwitterStatus] = useState<'initial' | 'verifying' | 'claimed'>('initial');
    const [farcasterStatus, setFarcasterStatus] = useState<'initial' | 'verifying' | 'claimed'>('initial');
    const [referralStatus, setReferralStatus] = useState<'initial' | 'verifying' | 'claimed'>('initial');
    const [verifying, setVerifying] = useState<string | null>(null);

    const [streak, setStreak] = useState<number>(0);
    const [lastClaimTime, setLastClaimTime] = useState<number>(0);

    const STREAK_REWARDS = [500, 1000, 2500, 5000, 15000, 25000, 100000];

    useEffect(() => {
        // Load Social Tasks
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

        // Load Referral Task
        const lastReferralShare = localStorage.getItem('basecaster_last_referral_share');
        if (lastReferralShare) {
            const lastShareTime = parseInt(lastReferralShare);
            if (Date.now() - lastShareTime < ONE_DAY_MS) {
                setReferralStatus('claimed');
            }
        } else if (localStorage.getItem('basecaster_task_referral_verifying')) {
            setReferralStatus('verifying');
        }

        // Load Streak
        const storedStreak = localStorage.getItem('basecaster_streak');
        const storedLastClaim = localStorage.getItem('basecaster_last_streak_claim');

        if (storedStreak) setStreak(parseInt(storedStreak));
        if (storedLastClaim) setLastClaimTime(parseInt(storedLastClaim));
    }, []);

    const isStreakClaimable = () => {
        if (lastClaimTime === 0) return true;
        const now = Date.now();
        const lastClaimDate = new Date(lastClaimTime).setHours(0, 0, 0, 0);
        const today = new Date(now).setHours(0, 0, 0, 0);
        return today > lastClaimDate;
    };

    const handleStreakClaim = () => {
        if (!isStreakClaimable()) return;

        const now = Date.now();
        const lastClaimDate = new Date(lastClaimTime).setHours(0, 0, 0, 0);
        const today = new Date(now).setHours(0, 0, 0, 0);
        const yesterday = today - ONE_DAY_MS;

        let newStreak = streak;

        // If last claim was yesterday, increment. If older, reset.
        if (lastClaimTime === 0 || lastClaimDate === yesterday) {
            newStreak = Math.min(streak + 1, 7);
        } else {
            newStreak = 1;
        }

        const reward = STREAK_REWARDS[newStreak - 1];
        addReward(reward);

        setStreak(newStreak);
        setLastClaimTime(now);

        localStorage.setItem('basecaster_streak', newStreak.toString());
        localStorage.setItem('basecaster_last_streak_claim', now.toString());
    };

    const handleSocialClick = (platform: 'twitter' | 'farcaster' | 'referral') => {
        if (platform === 'twitter') {
            window.open('https://x.com/MPoopybuttho1e', '_blank');
            setTwitterStatus('verifying');
            localStorage.setItem('basecaster_task_twitter_verifying', 'true');
        } else if (platform === 'farcaster') {
            window.open('https://warpcast.com/poopybuttho1e', '_blank');
            setFarcasterStatus('verifying');
            localStorage.setItem('basecaster_task_farcaster_verifying', 'true');
        } else {
            const text = encodeURIComponent("Join me on Basecaster Tap2Earn! 🚀");
            const embed = encodeURIComponent("https://base-caster-ebon.vercel.app");
            window.open(`https://warpcast.com/~/compose?text=${text}&embeds[]=${embed}`, '_blank');
            setReferralStatus('verifying');
            localStorage.setItem('basecaster_task_referral_verifying', 'true');
        }
    };

    const handleVerify = (platform: 'twitter' | 'farcaster' | 'referral') => {
        setVerifying(platform);
        setTimeout(() => {
            setVerifying(null);

            if (platform === 'referral') {
                addReward(2000);
                setReferralStatus('claimed');
                localStorage.setItem('basecaster_last_referral_share', Date.now().toString());
                localStorage.removeItem('basecaster_task_referral_verifying');
            } else {
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
            }
        }, 2000);
    };

    const getButtonContent = (status: 'initial' | 'verifying' | 'claimed', platform: 'twitter' | 'farcaster' | 'referral') => {
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

                {/* Daily Streak Section */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>📅 Daily Rewards</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '0.5rem'
                    }}>
                        {STREAK_REWARDS.map((reward, index) => {
                            const day = index + 1;

                            let statusStyle = {
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                opacity: 0.5
                            };

                            if (day <= streak) {
                                statusStyle = {
                                    background: 'rgba(0, 82, 255, 0.2)',
                                    border: '1px solid #0052FF',
                                    opacity: 1
                                };
                            }

                            if (isStreakClaimable() && (day === streak + 1 || (streak === 7 && day === 7))) {
                                statusStyle = {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid white',
                                    opacity: 1
                                };
                            }

                            return (
                                <div key={day} style={{
                                    ...statusStyle,
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <span style={{ fontSize: '0.7rem', color: '#888' }}>Day {day}</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{(reward / 1000)}K</span>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        className="buy-btn"
                        style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
                        disabled={!isStreakClaimable()}
                        onClick={handleStreakClaim}
                    >
                        {isStreakClaimable() ? 'Claim Daily Reward' : `Come back tomorrow`}
                    </button>
                </div>

                <div className="shop-list">
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>📋 Social Tasks</h3>

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

                    <div className="shop-item" style={{ cursor: 'default' }}>
                        <div className="item-icon">📢</div>
                        <div className="item-details">
                            <h3>Share Daily</h3>
                            <p>Share referral link (+2000)</p>
                        </div>
                        <button
                            className="buy-btn"
                            disabled={referralStatus === 'claimed' || verifying === 'referral'}
                            onClick={() => referralStatus === 'initial' ? handleSocialClick('referral') : handleVerify('referral')}
                            style={referralStatus === 'verifying' ? { background: '#e6b800' } : {}}
                        >
                            {referralStatus === 'claimed' ? 'Done' : (referralStatus === 'verifying' ? (verifying === 'referral' ? 'Checking...' : 'Check') : '+2000')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
