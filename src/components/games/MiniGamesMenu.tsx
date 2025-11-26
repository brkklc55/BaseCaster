import React from 'react';

interface MiniGamesMenuProps {
    onSelectGame: (game: 'prediction' | 'notpixel') => void;
    onClose: () => void;
}

export const MiniGamesMenu: React.FC<MiniGamesMenuProps> = ({ onSelectGame, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>🕹️ Mini Games</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="shop-items">
                    <div className="shop-item" onClick={() => onSelectGame('prediction')} style={{ cursor: 'pointer' }}>
                        <div className="item-icon" style={{ background: '#F7931A', color: 'white' }}>₿</div>
                        <div className="item-details">
                            <h3>BTC Prediction</h3>
                            <p>Predict price, win 2x!</p>
                        </div>
                        <button className="buy-btn">PLAY</button>
                    </div>

                    <div className="shop-item" onClick={() => onSelectGame('notpixel')} style={{ cursor: 'pointer' }}>
                        <div className="item-icon" style={{ background: '#FF00FF', color: 'white' }}>🎨</div>
                        <div className="item-details">
                            <h3>NotPixel</h3>
                            <p>Paint & Earn $BC</p>
                        </div>
                        <button className="buy-btn">PLAY</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
