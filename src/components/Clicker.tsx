import React, { useState, useCallback } from 'react';

interface ClickerProps {
    onClick: () => boolean;
}

interface FloatingText {
    id: number;
    x: number;
    y: number;
}

export const Clicker: React.FC<ClickerProps> = ({ onClick }) => {
    const [clicks, setClicks] = useState<FloatingText[]>([]);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (e.type === 'touchstart') {
            e.preventDefault();
        }

        const success = onClick();
        if (success) {
            let clientX, clientY;
            if ('touches' in e) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = (e as React.MouseEvent).clientX;
                clientY = (e as React.MouseEvent).clientY;
            }

            // Calculate tilt
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const x = clientX - rect.left - rect.width / 2;
            const y = clientY - rect.top - rect.height / 2;

            // Tilt effect: rotate away from the click
            setTilt({ x: -y / 10, y: x / 10 });
            setTimeout(() => setTilt({ x: 0, y: 0 }), 150);

            const newClick = {
                id: Date.now() + Math.random(),
                x: clientX,
                y: clientY,
            };

            setClicks(prev => [...prev, newClick]);
            setTimeout(() => {
                setClicks(prev => prev.filter(c => c.id !== newClick.id));
            }, 1000);
        }
    }, [onClick]);

    return (
        <div className="clicker-wrapper" style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            perspective: '1000px'
        }}>
            <div
                className="clicker-container"
                onMouseDown={handleInteraction}
                onTouchStart={handleInteraction}
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: 'transform 0.1s ease-out'
                }}
            >
                <div className="coin">
                    $BC
                </div>
            </div>

            {clicks.map(click => (
                <div
                    key={click.id}
                    className="float-text"
                    style={{
                        left: click.x,
                        top: click.y,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    +1
                </div>
            ))}
        </div>
    );
};
