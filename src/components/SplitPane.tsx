import React, { useState, useCallback, useEffect, useRef } from 'react';

interface SplitPaneProps {
    children: [React.ReactElement, React.ReactElement];
    direction?: 'horizontal' | 'vertical';
    minSize?: number;
    defaultSize?: string;
    className?: string;
    id?: string;
}

const SplitPane: React.FC<SplitPaneProps> = ({
    children,
    direction = 'horizontal',
    minSize = 100,
    defaultSize = '50%',
    className = '',
    id
}) => {
    const [size, setSize] = useState<string>(() => {
        if (id) {
            const saved = localStorage.getItem(`split-size-${id}`);
            return saved || defaultSize;
        }
        return defaultSize;
    });

    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const onMouseDown = useCallback(() => {
        setIsDragging(true);
    }, []);

    const onMouseUp = useCallback(() => {
        setIsDragging(false);
        if (id) {
            localStorage.setItem(`split-size-${id}`, size);
        }
    }, [id, size]);

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        let newSize = 0;

        if (direction === 'horizontal') {
            const offset = e.clientX - containerRect.left;
            newSize = (offset / containerRect.width) * 100;
        } else {
            const offset = e.clientY - containerRect.top;
            newSize = (offset / containerRect.height) * 100;
        }

        // Constraints
        const minPercent = (minSize / (direction === 'horizontal' ? containerRect.width : containerRect.height)) * 100;
        const boundedSize = Math.max(minPercent, Math.min(100 - minPercent, newSize));

        setSize(`${boundedSize}%`);
    }, [isDragging, direction, minSize]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
            document.body.style.userSelect = 'none';
        } else {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [isDragging, onMouseMove, onMouseUp, direction]);

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        width: '100%',
        height: '100%',
        minHeight: 0,
        position: 'relative'
    };

    const pane1Style: React.CSSProperties = {
        [direction === 'horizontal' ? 'width' : 'height']: size,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    };

    const resizerStyle: React.CSSProperties = {
        [direction === 'horizontal' ? 'width' : 'height']: '8px',
        [direction === 'horizontal' ? 'cursor' : 'row-resize' as any]: direction === 'horizontal' ? 'col-resize' : 'row-resize',
        background: 'transparent',
        flexShrink: 0,
        zIndex: 5,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const pane2Style: React.CSSProperties = {
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    };

    return (
        <div ref={containerRef} style={containerStyle} className={className}>
            <div style={pane1Style}>
                {children[0]}
            </div>
            <div
                style={resizerStyle}
                onMouseDown={onMouseDown}
            >
                <div style={{
                    [direction === 'horizontal' ? 'width' : 'height']: '2px',
                    [direction === 'horizontal' ? 'height' : 'width']: '32px',
                    background: isDragging ? 'var(--accent-primary)' : 'var(--border-color)',
                    borderRadius: '2px',
                    transition: 'background 0.2s',
                    opacity: isDragging ? 1 : 0.5
                }} />
            </div>
            <div style={pane2Style}>
                {children[1]}
            </div>
        </div>
    );
};

export default SplitPane;
