import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 500); // Wait for fade out
        }, 2000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: visible ? 'none' : 'fadeOut 0.5s forwards'
        }}>
            <style>{`
                @keyframes pulse-logo {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
                @keyframes fadeOut {
                    to { opacity: 0; visibility: hidden; }
                }
            `}</style>
            <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #4da6ff, #0052FF)',
                boxShadow: '0 0 60px rgba(0, 82, 255, 0.6)',
                marginBottom: '2rem',
                animation: 'pulse-logo 2s infinite ease-in-out'
            }} />
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: 'linear-gradient(to right, #fff, #4da6ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
                fontFamily: '"Press Start 2P", cursive'
            }}>Basecaster</h1>
            <p style={{ color: '#666', marginTop: '1rem' }}>Tap. Earn. Build.</p>
        </div>
    );
};
