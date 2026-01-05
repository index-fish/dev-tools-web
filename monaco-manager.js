// ========================================
// DevToolbox - Monaco Editor Manager
// ========================================

// Store for Monaco Editor instances
const monacoEditors = {};

// Language mappings for different tools
const languageMappings = {
    'json-input': 'json',
    'json-output': 'json',
    'json-escape-input': 'json',
    'json-escape-output': 'json',
    'json-class-input': 'json',
    'json-class-output': 'typescript',
    'html-input': 'html',
    'html-output': 'html',
    'js-input': 'javascript',
    'js-output': 'javascript',
    'css-input': 'css',
    'css-output': 'css',
    'xml-input': 'xml',
    'xml-output': 'xml',
    'sql-input': 'sql',
    'sql-output': 'sql',
    'jwt-input': 'plaintext',
    'jwt-header': 'json',
    'jwt-payload': 'json',
    'text-diff-input1': 'plaintext',
    'text-diff-input2': 'plaintext',
    'regex-input': 'plaintext',
    'regex-output': 'plaintext'
};

// Get current theme
function getMonacoTheme() {
    return document.documentElement.dataset.theme === 'light' ? 'vs' : 'vs-dark';
}

// Update all editors theme
function updateMonacoTheme() {
    const theme = getMonacoTheme();
    if (window.monaco) {
        // Define enhanced themes
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

        const activeTheme = theme === 'vs-dark' ? 'custom-dark' : 'custom-light';
        monaco.editor.setTheme(activeTheme);
        // Refresh font measurements on theme change
        monaco.editor.remeasureFonts();
    }
}

// Create a Monaco Editor instance
async function createMonacoEditor(containerId, options = {}) {
    await window.monacoReady;
    
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    // Destroy existing editor if present
    if (monacoEditors[containerId]) {
        monacoEditors[containerId].dispose();
        delete monacoEditors[containerId];
    }
    
    const language = languageMappings[containerId] || options.language || 'plaintext';
    const readOnly = options.readOnly || false;
    
    const editorOptions = {
        value: options.value || '',
        language: language,
        theme: getMonacoTheme() === 'vs-dark' ? 'custom-dark' : 'custom-light',
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: "Consolas, 'JetBrains Mono', 'Courier New', monospace",
        fontLigatures: false, // Disable ligatures to prevent cursor mismatch
        lineNumbers: 'on',
        wordWrap: 'on',
        tabSize: 2,
        readOnly: readOnly,
        scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            useShadows: false,
            vertical: 'auto',
            horizontal: 'auto'
        },
        padding: { top: 0, bottom: 8 },
        renderLineHighlight: 'all', // Show both border and background
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        contextmenu: true,
        folding: true,
        ...options.editorOptions
    };
    
    const editor = monaco.editor.create(container, editorOptions);
    monacoEditors[containerId] = editor;
    
    // Force layout and remeasure fonts after a short delay
    setTimeout(() => {
        editor.layout();
        if (window.monaco) {
            monaco.editor.remeasureFonts();
        }
    }, 200);
    
    return editor;
}

// Get value from Monaco Editor or fallback to textarea
function getEditorValue(elementId) {
    if (monacoEditors[elementId]) {
        return monacoEditors[elementId].getValue();
    }
    const textarea = document.getElementById(elementId);
    return textarea ? textarea.value : '';
}

// Set value to Monaco Editor or fallback to textarea
function setEditorValue(elementId, value) {
    if (monacoEditors[elementId]) {
        monacoEditors[elementId].setValue(value);
        return;
    }
    const textarea = document.getElementById(elementId);
    if (textarea) {
        textarea.value = value;
    }
}

// Get Monaco Editor language from output language selection
function getLanguageFromSelection(lang) {
    const map = {
        'typescript': 'typescript',
        'java': 'java',
        'csharp': 'csharp',
        'python': 'python',
        'go': 'go'
    };
    return map[lang] || 'plaintext';
}

// Update editor language
function updateEditorLanguage(elementId, language) {
    if (monacoEditors[elementId] && window.monaco) {
        monaco.editor.setModelLanguage(monacoEditors[elementId].getModel(), language);
    }
}

// Dispose all Monaco Editors
function disposeAllEditors() {
    Object.keys(monacoEditors).forEach(id => {
        if (monacoEditors[id]) {
            monacoEditors[id].dispose();
            delete monacoEditors[id];
        }
    });
    // Also dispose diff editor
    if (window.monacoDiffEditor) {
        window.monacoDiffEditor.dispose();
        window.monacoDiffEditor = null;
    }
}

// ========================================
// Monaco Diff Editor
// ========================================
let diffEditorOriginalModel = null;
let diffEditorModifiedModel = null;

async function createDiffEditor(containerId, options = {}) {
    await window.monacoReady;
    
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    // Dispose existing diff editor
    if (window.monacoDiffEditor) {
        window.monacoDiffEditor.dispose();
    }
    
    const language = options.language || 'plaintext';
    const renderSideBySide = !options.inline;
    
    // Create models
    diffEditorOriginalModel = monaco.editor.createModel(options.original || '', language);
    diffEditorModifiedModel = monaco.editor.createModel(options.modified || '', language);
    
    // Create diff editor
    const diffEditor = monaco.editor.createDiffEditor(container, {
        theme: getMonacoTheme(),
        automaticLayout: true,
        renderSideBySide: renderSideBySide,
        enableSplitViewResizing: true,
        ignoreTrimWhitespace: options.ignoreWhitespace || false,
        originalEditable: true,
        modifiedEditable: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: "'JetBrains Mono', Consolas, 'Courier New', monospace",
        lineNumbers: 'on',
        wordWrap: 'on',
        scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            useShadows: false
        },
        padding: { top: 8, bottom: 8 },
        renderLineHighlight: 'line',
        renderIndicators: true,
        renderMarginRevertIcon: true,
        ...options.editorOptions
    });
    
    diffEditor.setModel({
        original: diffEditorOriginalModel,
        modified: diffEditorModifiedModel
    });
    
    window.monacoDiffEditor = diffEditor;
    
    return diffEditor;
}

function getDiffEditorValues() {
    if (!window.monacoDiffEditor) return { original: '', modified: '' };
    return {
        original: diffEditorOriginalModel ? diffEditorOriginalModel.getValue() : '',
        modified: diffEditorModifiedModel ? diffEditorModifiedModel.getValue() : ''
    };
}

function setDiffEditorValues(original, modified) {
    if (diffEditorOriginalModel) diffEditorOriginalModel.setValue(original || '');
    if (diffEditorModifiedModel) diffEditorModifiedModel.setValue(modified || '');
}

function updateDiffEditorOptions(options) {
    if (!window.monacoDiffEditor) return;
    window.monacoDiffEditor.updateOptions(options);
}

function setDiffEditorLanguage(language) {
    if (diffEditorOriginalModel) monaco.editor.setModelLanguage(diffEditorOriginalModel, language);
    if (diffEditorModifiedModel) monaco.editor.setModelLanguage(diffEditorModifiedModel, language);
}

function getDiffStats() {
    if (!window.monacoDiffEditor) return null;
    const lineChanges = window.monacoDiffEditor.getLineChanges();
    if (!lineChanges) return { additions: 0, deletions: 0, changes: 0 };
    
    let additions = 0, deletions = 0, changes = 0;
    
    lineChanges.forEach(change => {
        if (change.originalStartLineNumber <= change.originalEndLineNumber) {
            deletions += change.originalEndLineNumber - change.originalStartLineNumber + 1;
        }
        if (change.modifiedStartLineNumber <= change.modifiedEndLineNumber) {
            additions += change.modifiedEndLineNumber - change.modifiedStartLineNumber + 1;
        }
        changes++;
    });
    
    return { additions, deletions, changes };
}


// Initialize editors for a specific tool
async function initializeToolEditors(toolId) {
    await window.monacoReady;
    
    // Clean up previous editors
    disposeAllEditors();
    
    // Handle diff editor specially
    if (toolId === 'text-diff') {
        setTimeout(async () => {
            await createDiffEditor('monaco-diff-container', {
                language: 'plaintext',
                inline: false,
                original: '',
                modified: ''
            });
        }, 50);
        return;
    }
    
    // Tool-specific editor configurations
    const editorConfigs = {
        'json-format': [
            { id: 'json-input', readOnly: false },
            { id: 'json-output', readOnly: true }
        ],
        'json-escape': [
            { id: 'json-escape-input', readOnly: false },
            { id: 'json-escape-output', readOnly: true }
        ],
        'json-to-class': [
            { id: 'json-class-input', readOnly: false },
            { id: 'json-class-output', readOnly: true }
        ],
        'html-format': [
            { id: 'html-input', readOnly: false },
            { id: 'html-output', readOnly: true }
        ],
        'js-format': [
            { id: 'js-input', readOnly: false },
            { id: 'js-output', readOnly: true }
        ],
        'css-format': [
            { id: 'css-input', readOnly: false },
            { id: 'css-output', readOnly: true }
        ],
        'xml-format': [
            { id: 'xml-input', readOnly: false },
            { id: 'xml-output', readOnly: true }
        ],
        'sql-format': [
            { id: 'sql-input', readOnly: false },
            { id: 'sql-output', readOnly: true }
        ],
        'jwt': [
            { id: 'jwt-input', readOnly: false },
            { id: 'jwt-header', readOnly: true },
            { id: 'jwt-payload', readOnly: true }
        ]
    };
    
    const configs = editorConfigs[toolId];
    if (!configs) return;
    
    // Small delay to ensure DOM is ready
    setTimeout(async () => {
        for (const config of configs) {
            await createMonacoEditor(config.id, { readOnly: config.readOnly });
        }
    }, 50);
}

// Export functions for global access
window.monacoManager = {
    createEditor: createMonacoEditor,
    getValue: getEditorValue,
    setValue: setEditorValue,
    updateLanguage: updateEditorLanguage,
    updateTheme: updateMonacoTheme,
    initToolEditors: initializeToolEditors,
    disposeAll: disposeAllEditors,
    getLanguageFromSelection: getLanguageFromSelection,
    editors: monacoEditors,
    // Diff Editor functions
    createDiffEditor: createDiffEditor,
    getDiffValues: getDiffEditorValues,
    setDiffValues: setDiffEditorValues,
    updateDiffOptions: updateDiffEditorOptions,
    setDiffLanguage: setDiffEditorLanguage,
    getDiffStats: getDiffStats
};
