import React from 'react';
import { useTools } from '../store/ToolContext';
import { SECTIONS } from '../store/ToolMetadata';
import { Sun, Moon, Github, Right } from '@icon-park/react';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const { activeTool, theme, toggleTheme } = useTools();

    // Find tool name and section name from metadata
    const getToolMetadata = () => {
        for (const section of Object.values(SECTIONS)) {
            const tool = section.tools.find(t => t.id === activeTool);
            if (tool) return { sectionName: section.name, toolName: tool.name };
        }
        return { sectionName: '工具', toolName: activeTool };
    };

    const { sectionName, toolName } = getToolMetadata();

    return (
        <header className={styles.header}>
            <div className={styles.titleInfo}>
                <div className={styles.breadcrumb}>
                    <span>{sectionName}</span>
                    <Right size={14} className={styles.breadcrumbSeparator} />
                    <span className={styles.activeToolName}>{toolName}</span>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.iconBtn} title="View on GitHub">
                    <Github size={18} />
                </button>
                <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle Theme">
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
        </header>
    );
};

export default Header;
