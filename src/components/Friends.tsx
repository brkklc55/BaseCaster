import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface FriendsProps {
    onClose: () => void;
    addReward: (amount: number) => void;
}

interface Referral {
    id: string;
    username: string;
    score: number;
}

export const Friends: React.FC<FriendsProps> = ({ onClose, addReward }) => {
    const [userId, setUserId] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loading, setLoading] = useState(true);
    const [claimableReward, setClaimableReward] = useState(0);

    useEffect(() => {
        let storedId = localStorage.getItem('basecaster_user_id');
        if (!storedId) {
            storedId = Math.random().toString(36).substring(2, 10);
            localStorage.setItem('basecaster_user_id', storedId);
        }
        setUserId(storedId);

        fetchReferrals(storedId);
    }, []);

    const fetchReferrals = async (uid: string) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, username, score')
                .eq('referred_by', uid);

            if (error) throw error;

            if (data) {
                const refs = data.map((u: any) => ({
                    id: u.id,
                    username: u.username || 'Unknown User',
                    score: u.score || 0
                }));
                setReferrals(refs);

                // Calculate rewards
                const totalReferralScore = refs.reduce((acc, curr) => acc + curr.score, 0);
                const totalCommission = Math.floor(totalReferralScore * 0.10); // 10% commission

                const claimed = parseInt(localStorage.getItem('basecaster_claimed_ref_rewards') || '0');
                const available = Math.max(0, totalCommission - claimed);

                setClaimableReward(available);
            }
        } catch (err) {
            console.error('Error fetching referrals:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = () => {
        if (claimableReward <= 0) return;

        addReward(claimableReward);

        // Update claimed amount
        const currentClaimed = parseInt(localStorage.getItem('basecaster_claimed_ref_rewards') || '0');
        const newClaimed = currentClaimed + claimableReward;
        localStorage.setItem('basecaster_claimed_ref_rewards', newClaimed.toString());

        setClaimableReward(0);
        alert(`🎉 Claimed ${claimableReward.toLocaleString()} coins from referrals!`);
    };

    const baseUrl = 'https://base-caster-ebon.vercel.app';
    const encodedUrl = encodeURIComponent(`${baseUrl}/?ref=${userId}`);
    const inviteLink = `https://warpcast.com/~/frames/launch?url=${encodedUrl}&domain=base-caster-ebon.vercel.app`;

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
                        Earn <span style={{ color: '#00ff00' }}>10%</span> of your friends' earnings!
                    </p>

                    {/* Claim Section */}
                    <div style={{
                        background: 'rgba(77, 166, 255, 0.1)',
                        border: '2px solid #4da6ff',
                        borderRadius: '12px',
                        padding: '15px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Claimable Earnings</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '10px' }}>
                            {claimableReward.toLocaleString()} 🪙
                        </div>
                        <button
                            className="buy-btn"
                            disabled={claimableReward <= 0}
                            onClick={handleClaim}
                            style={{ width: '100%', opacity: claimableReward > 0 ? 1 : 0.5 }}
                        >
                            {claimableReward > 0 ? 'Claim Rewards' : 'No Rewards Yet'}
                        </button>
                    </div>

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
                    <h3 style={{ margin: '0 0 1rem 0' }}>Your Friends ({referrals.length})</h3>
                    {loading ? (
                        <div style={{ textAlign: 'center', color: '#888' }}>Loading...</div>
                    ) : referrals.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            color: '#666'
                        }}>
                            You haven't invited anyone yet.
                        </div>
                    ) : (
                        referrals.map(ref => (
                            <div key={ref.id} className="shop-item" style={{ justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem' }}>{ref.username}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#888' }}>Score: {ref.score.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div style={{ color: '#00ff00', fontSize: '0.8rem' }}>
                                    +{Math.floor(ref.score * 0.10).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
