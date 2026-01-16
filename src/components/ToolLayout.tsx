import React from 'react';
import ToolCard from './ToolCard';
import SplitPane from './SplitPane';

interface ToolPaneProps {
    title: string;
    extra?: React.ReactNode;
    children: React.ReactNode;
    style?: React.CSSProperties;
    noBorder?: boolean;
}

/**
 * ToolPane - A consistent container for tool input/output areas
 */
export const ToolPane: React.FC<ToolPaneProps> = ({ title, extra, children, style, noBorder }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', ...style }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '21px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {title}
            </span>
            {extra}
        </div>
        <div style={{
            flex: 1,
            border: noBorder ? 'none' : '1px solid var(--border-color)',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-primary)'
        }}>
            {children}
        </div>
    </div>
);

interface ToolLayoutProps {
    title: string;
    description: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    splitId: string;
    direction?: 'horizontal' | 'vertical';
    children: [React.ReactElement, React.ReactElement];
}

/**
 * ToolLayout - A top-level layout component for tools with resizable panes
 */
export const ToolLayout: React.FC<ToolLayoutProps> = ({
    title,
    description,
    header,
    footer,
    splitId,
    direction = 'horizontal',
    children
}) => {
    return (
        <ToolCard title={title} description={description}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 0 }}>
                {header && (
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                        {header}
                    </div>
                )}
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <SplitPane id={splitId} direction={direction}>
                            {children}
                        </SplitPane>
                    </div>
                    {footer && (
                        <div style={{ flex: 1, minHeight: 0 }}>
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </ToolCard>
    );
};
