import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Player {
    id: string;
    name: string;
    score: number;
    isUser?: boolean;
}

interface LeaderboardProps {
    onClose: () => void;
    username: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onClose, username }) => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('id, username, score')
                .order('score', { ascending: false })
                .limit(50);

            if (error) {
                console.error('Error fetching leaderboard:', error);
            } else if (data) {
                const formatted = data.map((u: any) => ({
                    id: u.id,
                    name: u.username || 'Unknown',
                    score: u.score,
                    isUser: u.username === username
                }));
                setPlayers(formatted);
            }
            setLoading(false);
        };

        fetchLeaderboard();
    }, [username]);

    const truncateName = (name: string) => {
        if (name.length > 12) {
            return name.substring(0, 10) + '..';
        }
        return name;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Leaderboard</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
                ) : (
                    <div className="leaderboard-list">
                        {/* Header Row */}
                        <div style={{
                            display: 'flex',
                            padding: '0 10px 10px 10px',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            marginBottom: '10px',
                            fontSize: '0.7rem',
                            color: '#888'
                        }}>
                            <div style={{ width: '40px' }}>#</div>
                            <div style={{ flex: 1 }}>Player</div>
                            <div style={{ width: '100px', textAlign: 'right' }}>Score</div>
                        </div>

                        {players.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>
                                No players yet. Be the first!
                            </div>
                        ) : (
                            players.map((player, index) => (
                                <div
                                    key={player.id}
                                    className="leaderboard-item"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '10px',
                                        background: player.isUser ? 'rgba(0, 82, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        border: player.isUser ? '1px solid #0052FF' : '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        marginBottom: '8px'
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        fontWeight: 'bold',
                                        color: index < 3 ? '#FFD700' : '#fff'
                                    }}>
                                        #{index + 1}
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        fontSize: '0.9rem'
                                    }}>
                                        {truncateName(player.name)}
                                        {player.isUser && <span style={{ fontSize: '0.7em', color: '#4da6ff', marginLeft: '4px' }}>(You)</span>}
                                    </div>
                                    <div style={{
                                        width: '100px',
                                        textAlign: 'right',
                                        fontFamily: 'monospace',
                                        fontSize: '0.9rem',
                                        color: '#4CAF50'
                                    }}>
                                        {player.score.toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
