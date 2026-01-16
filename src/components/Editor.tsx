import React, { useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useTools } from '../store/ToolContext';

// Use local or specific version of monaco if needed, 
// for now let it load from CDN but we can optimize later.

interface MonacoEditorProps {
    value: string;
    onChange?: (value: string | undefined) => void;
    language?: string;
    readOnly?: boolean;
    height?: string;
    theme?: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
    value,
    onChange,
    language = 'json',
    readOnly = false,
    height = '100%',
    theme
}) => {
    const monaco = useMonaco();
    const { theme: contextTheme } = useTools();

    useEffect(() => {
        if (monaco) {
            // Define custom themes similar to original project
            monaco.editor.defineTheme('custom-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                    'editor.lineHighlightBackground': '#2e344066',
                    'editor.lineHighlightBorder': '#4c566a88'
                }
            });

            monaco.editor.defineTheme('custom-light', {
                base: 'vs',
                inherit: true,
                rules: [],
                colors: {
                    'editor.lineHighlightBackground': '#f0f3f8',
                    'editor.lineHighlightBorder': '#d8dee9aa'
                }
            });
        }
    }, [monaco]);

    const activeTheme = theme || (contextTheme === 'light' ? 'custom-light' : 'custom-dark');

    return (
        <Editor
            height={height}
            language={language}
            value={value}
            theme={activeTheme}
            onChange={onChange}
            options={{
                readOnly,
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "Consolas, 'JetBrains Mono', 'Courier New', monospace",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                renderLineHighlight: 'all',
                scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                }
            }}
        />
    );
};

export default MonacoEditor;
