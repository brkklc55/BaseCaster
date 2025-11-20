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
                    name: u.username,
                    score: u.score,
                    isUser: u.username === username // Simple check by name, ideally by ID
                }));
                setPlayers(formatted);
            }
            setLoading(false);
        };

        fetchLeaderboard();
    }, [username]);

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
                        {players.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>
                                No players yet. Be the first!
                            </div>
                        ) : (
                            players.map((player, index) => (
                                <div
                                    key={player.id}
                                    className="leaderboard-item"
                                    style={player.isUser ? { background: 'rgba(0, 82, 255, 0.2)', border: '1px solid #0052FF' } : {}}
                                >
                                    <div className="rank">#{index + 1}</div>
                                    <div className="name">
                                        {player.name}
                                        {player.isUser && <span style={{ fontSize: '0.8em', opacity: 0.7, marginLeft: '0.5rem' }}>(You)</span>}
                                    </div>
                                    <div className="score">{player.score.toLocaleString()}</div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
