import React, { createContext, useContext, useState, useEffect } from 'react';

type ToolId = string;

interface ToolContextType {
    activeTool: ToolId;
    setActiveTool: (id: ToolId) => void;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    sectionOrder: string[];
    setSectionOrder: (order: string[]) => void;
    collapsedSections: string[];
    toggleSection: (id: string) => void;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

const DEFAULT_ORDER = [
    'json', 'format', 'encode', 'hash', 'symmetric', 'guomi',
    'asymmetric', 'cipher', 'number', 'text', 'date',
    'random', 'color', 'image'
];

export const ToolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeTool, setActiveTool] = useState<ToolId>(() => {
        return localStorage.getItem('activeTool') || 'json-format';
    });

    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    });

    const [sectionOrder, setSectionOrderState] = useState<string[]>(() => {
        const saved = localStorage.getItem('sidebarOrder');
        return saved ? JSON.parse(saved) : DEFAULT_ORDER;
    });

    const [collapsedSections, setCollapsedSections] = useState<string[]>(() => {
        const saved = localStorage.getItem('collapsedSectionsV2');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('activeTool', activeTool);
    }, [activeTool]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    const setSectionOrder = (order: string[]) => {
        setSectionOrderState(order);
        localStorage.setItem('sidebarOrder', JSON.stringify(order));
    };

    const toggleSection = (id: string) => {
        setCollapsedSections(prev => {
            const next = prev.includes(id)
                ? prev.filter(s => s !== id)
                : [...prev, id];
            localStorage.setItem('collapsedSectionsV2', JSON.stringify(next));
            return next;
        });
    };

    return (
        <ToolContext.Provider value={{
            activeTool, setActiveTool,
            theme, toggleTheme,
            sectionOrder, setSectionOrder,
            collapsedSections, toggleSection
        }}>
            {children}
        </ToolContext.Provider>
    );
};

export const useTools = () => {
    const context = useContext(ToolContext);
    if (!context) throw new Error('useTools must be used within ToolProvider');
    return context;
};
