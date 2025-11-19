import React from 'react';

interface Player {
    id: string;
    name: string;
    score: number;
    isUser?: boolean;
}

interface LeaderboardProps {
    onClose: () => void;
    currentScore: number;
    username: string;
}

const MOCK_DATA: Player[] = [];

export const Leaderboard: React.FC<LeaderboardProps> = ({ onClose, currentScore, username }) => {
    // Merge current user into list
    const allPlayers = [
        ...MOCK_DATA,
        { id: 'user', name: username, score: currentScore, isUser: true }
    ].sort((a, b) => b.score - a.score); // Sort descending

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Leaderboard</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="leaderboard-list">
                    {allPlayers.map((player, index) => (
                        <div
                            key={player.id}
                            className="leaderboard-item"
                            style={player.isUser ? { background: 'rgba(0, 82, 255, 0.2)', border: '1px solid #0052FF' } : {}}
                        >
                            <div className="rank">#{index + 1}</div>
                            <div className="name">
                                {player.name}
                                {player.isUser && <span style={{ fontSize: '0.8em', opacity: 0.7, marginLeft: '0.5rem' }}>(That's you!)</span>}
                            </div>
                            <div className="score">{player.score.toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
