import React, { useState, useEffect } from 'react';

interface PredictionGameProps {
    onClose: () => void;
    score: number;
    onUpdateScore: (amount: number) => void;
}

export const PredictionGame: React.FC<PredictionGameProps> = ({ onClose, score, onUpdateScore }) => {
    const [btcPrice, setBtcPrice] = useState<number | null>(null);
    const [betAmount, setBetAmount] = useState<string>('1000');
    const [gameState, setGameState] = useState<'idle' | 'running' | 'result'>('idle');
    const [prediction, setPrediction] = useState<'up' | 'down' | null>(null);
    const [startPrice, setStartPrice] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [resultMessage, setResultMessage] = useState('');

    // Fetch BTC Price
    const fetchPrice = async () => {
        try {
            const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
            const data = await res.json();
            setBtcPrice(data.bitcoin.usd);
            return data.bitcoin.usd;
        } catch (e) {
            console.error("Price fetch failed", e);
            // Fallback for demo if API fails
            return btcPrice || 95000;
        }
    };

    useEffect(() => {
        fetchPrice();
        const interval = setInterval(fetchPrice, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (gameState === 'running' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (gameState === 'running' && timeLeft === 0) {
            endGame();
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    const startGame = async (pred: 'up' | 'down') => {
        const bet = parseInt(betAmount);
        if (isNaN(bet) || bet <= 0) {
            alert("Invalid bet amount");
            return;
        }
        if (bet > 10000) {
            alert("Max bet is 10,000 $BC");
            return;
        }
        if (score < bet) {
            alert("Insufficient funds");
            return;
        }

        onUpdateScore(-bet);
        const currentPrice = await fetchPrice();
        setStartPrice(currentPrice);
        setPrediction(pred);
        setGameState('running');
        setTimeLeft(60); // 1 minute
    };

    const endGame = async () => {
        const endPrice = await fetchPrice();
        const bet = parseInt(betAmount);
        let won = false;

        if (prediction === 'up' && endPrice > (startPrice || 0)) won = true;
        if (prediction === 'down' && endPrice < (startPrice || 0)) won = true;

        if (won) {
            const winAmount = bet * 2;
            onUpdateScore(winAmount);
            setResultMessage(`YOU WON! +${winAmount} $BC`);
        } else {
            setResultMessage(`YOU LOST! -${bet} $BC`);
        }

        setGameState('result');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>📈 BTC Prediction</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Current Price</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F7931A' }}>
                        ${btcPrice?.toLocaleString() || 'Loading...'}
                    </div>
                </div>

                {gameState === 'idle' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ fontSize: '0.7rem', display: 'block', marginBottom: '5px' }}>Bet Amount (Max 10k)</label>
                            <input
                                type="number"
                                value={betAmount}
                                onChange={(e) => setBetAmount(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: '#000',
                                    border: '2px solid #fff',
                                    color: '#fff',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => startGame('up')}
                                className="buy-btn"
                                style={{ flex: 1, background: '#00ff00', color: 'black' }}
                            >
                                ▲ UP
                            </button>
                            <button
                                onClick={() => startGame('down')}
                                className="buy-btn"
                                style={{ flex: 1, background: '#ff0000', color: 'white' }}
                            >
                                ▼ DOWN
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'running' && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                            Time Left: {timeLeft}s
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>
                            Start Price: ${startPrice?.toLocaleString()}
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '1rem' }}>
                            Prediction: <span style={{ color: prediction === 'up' ? '#00ff00' : '#ff0000' }}>{prediction?.toUpperCase()}</span>
                        </div>
                        <div className="loader" style={{ margin: '20px auto' }}>⏳</div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{
                            color: resultMessage.includes('WON') ? '#00ff00' : '#ff0000',
                            fontSize: '1.2rem',
                            marginBottom: '20px'
                        }}>
                            {resultMessage}
                        </h3>
                        <button className="buy-btn" onClick={() => setGameState('idle')}>
                            PLAY AGAIN
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
