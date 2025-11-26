import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

interface NotPixelGameProps {
    onClose: () => void;
    energy: number;
    onConsumeEnergy: (amount: number) => boolean;
    onReward: (amount: number) => void;
}

const GRID_SIZE = 12;
const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF', '#000000'];

export const NotPixelGame: React.FC<NotPixelGameProps> = ({ onClose, energy, onConsumeEnergy, onReward }) => {
    const [grid, setGrid] = useState<string[]>(Array(GRID_SIZE * GRID_SIZE).fill('#222'));
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);

    // Load grid from Supabase & Subscribe to changes
    useEffect(() => {
        fetchGrid();

        const channel = supabase
            .channel('public:pixels')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'pixels' }, (payload) => {
                const { id, color } = payload.new as any;
                setGrid(prev => {
                    const newGrid = [...prev];
                    if (id >= 0 && id < newGrid.length) {
                        newGrid[id] = color;
                    }
                    return newGrid;
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchGrid = async () => {
        const { data } = await supabase.from('pixels').select('*');
        if (data) {
            setGrid(prev => {
                const newGrid = [...prev];
                data.forEach((p: any) => {
                    if (p.id >= 0 && p.id < newGrid.length) {
                        newGrid[p.id] = p.color;
                    }
                });
                return newGrid;
            });
        }
    };

    const handlePixelClick = async (index: number) => {
        if (grid[index] === selectedColor) return;

        if (onConsumeEnergy(1000)) {
            // Optimistic update
            const newGrid = [...grid];
            newGrid[index] = selectedColor;
            setGrid(newGrid);
            onReward(1000);

            // Send to DB
            const { error } = await supabase
                .from('pixels')
                .upsert({ id: index, color: selectedColor });

            if (error) {
                console.error("Pixel update failed:", error);
            }
        } else {
            alert("Not enough energy! Need 1000⚡");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '450px' }}>
                <div className="modal-header">
                    <h2>🎨 NotPixel (Shared)</h2>
                    <div style={{ fontSize: '0.7rem' }}>⚡ {Math.floor(energy)}</div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    gap: '1px',
                    background: '#444',
                    border: '4px solid #fff',
                    marginBottom: '20px'
                }}>
                    {grid.map((color, i) => (
                        <div
                            key={i}
                            onClick={() => handlePixelClick(i)}
                            style={{
                                aspectRatio: '1/1',
                                background: color,
                                cursor: 'pointer'
                            }}
                        />
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {COLORS.map(color => (
                        <div
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            style={{
                                width: '30px',
                                height: '30px',
                                background: color,
                                border: selectedColor === color ? '4px solid white' : '2px solid #555',
                                cursor: 'pointer',
                                borderRadius: '4px'
                            }}
                        />
                    ))}
                </div>

                <p style={{ textAlign: 'center', fontSize: '0.6rem', color: '#888', marginTop: '15px' }}>
                    Cost: 1000⚡ | Reward: 1000 $BC
                </p>
            </div>
        </div>
    );
};
