import React, { useState } from 'react';
import ToolCard from '../components/ToolCard';
import { Palette, Copy, RefreshCw } from 'lucide-react';

const ColorTool: React.FC = () => {
    const [color, setColor] = useState('#6366f1');

    const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    };

    const hexToHsl = (hex: string) => {
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;
        if (max === min) h = s = 0;
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    };

    const generateRandom = () => {
        const random = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        setColor(random);
    };

    const ColorItem = ({ label, value }: { label: string, value: string }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{label}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
            </div>
            <button onClick={() => navigator.clipboard.writeText(value)} style={{ color: 'var(--accent-primary)', padding: '6px' }}><Copy size={16} /></button>
        </div>
    );

    return (
        <ToolCard title="颜色工具" description="RGB / HEX / HSL 颜色转换与预览。支持随机生成及实时调色。">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', width: '100%', maxWidth: '600px' }}>
                    <div style={{ width: '150px', height: '150px', borderRadius: '24px', background: color, boxShadow: `0 20px 40px ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white' }}>
                        <input
                            type="color"
                            value={color}
                            onChange={e => setColor(e.target.value)}
                            style={{ opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                        />
                        <Palette size={40} color="white" style={{ position: 'absolute', pointerEvents: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <input
                                type="text"
                                value={color}
                                onChange={e => setColor(e.target.value)}
                                style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '1.1rem', textAlign: 'center' }}
                            />
                            <button onClick={generateRandom} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px' }}>
                                <RefreshCw size={20} />
                            </button>
                        </div>
                        <ColorItem label="HEX" value={color.toUpperCase()} />
                        <ColorItem label="RGB" value={hexToRgb(color)} />
                        <ColorItem label="HSL" value={hexToHsl(color)} />
                    </div>
                </div>

            </div>
        </ToolCard>
    );
};

export default ColorTool;
