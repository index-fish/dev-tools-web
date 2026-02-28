import React, { useState, useCallback, useMemo, useEffect } from 'react';
import MonacoEditor from '../components/Editor';
import { useTools } from '../store/ToolContext';
import ToolCard from '../components/ToolCard';
import SplitPane from '../components/SplitPane';
import { ToolPane } from '../components/ToolLayout';
import { Trash2, Copy, Check, Settings, Minimize2, Maximize2, FileCode, Zap, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import styles from './CodeFormatTool.module.css';

type FormatOptionType =
    | 'tabWidth'
    | 'useTabs'
    | 'printWidth'
    | 'semi'
    | 'singleQuote'
    | 'trailingComma'
    | 'bracketSpacing'
    | 'endOfLine';

interface LanguageConfig {
    id: string;
    name: string;
    monacoLang: string;
    parser: string;
    plugins: string[];
    supportsMinify: boolean;
    fileExtensions: string[];
    supportedOptions: FormatOptionType[];
}

const COMMON_OPTIONS: FormatOptionType[] = ['tabWidth', 'useTabs', 'endOfLine'];
const JS_TS_OPTIONS: FormatOptionType[] = [...COMMON_OPTIONS, 'printWidth', 'semi', 'singleQuote', 'trailingComma', 'bracketSpacing'];
const HTML_OPTIONS: FormatOptionType[] = [...COMMON_OPTIONS, 'printWidth', 'singleQuote'];
const CSS_OPTIONS: FormatOptionType[] = [...COMMON_OPTIONS, 'printWidth', 'singleQuote'];
const JSON_OPTIONS: FormatOptionType[] = [...COMMON_OPTIONS];
const XML_OPTIONS: FormatOptionType[] = [...COMMON_OPTIONS];
const MARKDOWN_OPTIONS: FormatOptionType[] = [...COMMON_OPTIONS, 'printWidth'];
const YAML_OPTIONS: FormatOptionType[] = [...COMMON_OPTIONS, 'printWidth', 'singleQuote'];
const GRAPHQL_OPTIONS: FormatOptionType[] = [...COMMON_OPTIONS, 'printWidth'];
const JAVA_OPTIONS: FormatOptionType[] = [...COMMON_OPTIONS, 'printWidth'];
const PHP_OPTIONS: FormatOptionType[] = [...COMMON_OPTIONS, 'printWidth', 'singleQuote', 'trailingComma'];

const LANGUAGE_CONFIGS: LanguageConfig[] = [
    { id: 'javascript', name: 'JavaScript', monacoLang: 'javascript', parser: 'babel', plugins: ['babel', 'estree'], supportsMinify: true, fileExtensions: ['.js', '.jsx', '.mjs'], supportedOptions: JS_TS_OPTIONS },
    { id: 'typescript', name: 'TypeScript', monacoLang: 'typescript', parser: 'typescript', plugins: ['typescript', 'estree'], supportsMinify: true, fileExtensions: ['.ts', '.tsx'], supportedOptions: JS_TS_OPTIONS },
    { id: 'html', name: 'HTML', monacoLang: 'html', parser: 'html', plugins: ['html'], supportsMinify: true, fileExtensions: ['.html', '.htm'], supportedOptions: HTML_OPTIONS },
    { id: 'css', name: 'CSS', monacoLang: 'css', parser: 'css', plugins: ['postcss'], supportsMinify: true, fileExtensions: ['.css'], supportedOptions: CSS_OPTIONS },
    { id: 'scss', name: 'SCSS', monacoLang: 'scss', parser: 'scss', plugins: ['postcss'], supportsMinify: false, fileExtensions: ['.scss'], supportedOptions: CSS_OPTIONS },
    { id: 'less', name: 'Less', monacoLang: 'less', parser: 'less', plugins: ['postcss'], supportsMinify: false, fileExtensions: ['.less'], supportedOptions: CSS_OPTIONS },
    { id: 'json', name: 'JSON', monacoLang: 'json', parser: 'json', plugins: [], supportsMinify: true, fileExtensions: ['.json'], supportedOptions: JSON_OPTIONS },
    { id: 'xml', name: 'XML', monacoLang: 'xml', parser: 'xml', plugins: [], supportsMinify: true, fileExtensions: ['.xml', '.xsl', '.xslt'], supportedOptions: XML_OPTIONS },
    { id: 'markdown', name: 'Markdown', monacoLang: 'markdown', parser: 'markdown', plugins: ['markdown'], supportsMinify: false, fileExtensions: ['.md', '.markdown'], supportedOptions: MARKDOWN_OPTIONS },
    { id: 'yaml', name: 'YAML', monacoLang: 'yaml', parser: 'yaml', plugins: ['yaml'], supportsMinify: false, fileExtensions: ['.yaml', '.yml'], supportedOptions: YAML_OPTIONS },
    { id: 'graphql', name: 'GraphQL', monacoLang: 'graphql', parser: 'graphql', plugins: ['graphql'], supportsMinify: false, fileExtensions: ['.graphql', '.gql'], supportedOptions: GRAPHQL_OPTIONS },
    { id: 'sql', name: 'SQL', monacoLang: 'sql', parser: 'sql', plugins: ['sql'], supportsMinify: false, fileExtensions: ['.sql'], supportedOptions: COMMON_OPTIONS },
    { id: 'java', name: 'Java', monacoLang: 'java', parser: 'java', plugins: ['java'], supportsMinify: false, fileExtensions: ['.java'], supportedOptions: JAVA_OPTIONS },
    { id: 'php', name: 'PHP', monacoLang: 'php', parser: 'php', plugins: ['php'], supportsMinify: false, fileExtensions: ['.php'], supportedOptions: PHP_OPTIONS }
];

const SQL_DIALECTS = [
    { id: 'sql', name: '标准 SQL' }, { id: 'mysql', name: 'MySQL' }, { id: 'postgresql', name: 'PostgreSQL' },
    { id: 'mariadb', name: 'MariaDB' }, { id: 'sqlite', name: 'SQLite' }, { id: 'plsql', name: 'PL/SQL (Oracle)' },
    { id: 'transactsql', name: 'T-SQL (SQL Server)' }, { id: 'bigquery', name: 'BigQuery' },
    { id: 'hive', name: 'Hive' }, { id: 'spark', name: 'Spark SQL' },
];

interface FormatOptions {
    tabWidth: number;
    useTabs: boolean;
    printWidth: number;
    semi: boolean;
    singleQuote: boolean;
    trailingComma: 'none' | 'es5' | 'all';
    bracketSpacing: boolean;
    arrowParens: 'avoid' | 'always';
    endOfLine: 'lf' | 'crlf' | 'cr' | 'auto';
    sqlDialect: string;
    sqlUppercase: boolean;
    sqlKeywordCase: 'upper' | 'lower' | 'preserve';
    xmlWhitespaceSensitivity: 'strict' | 'ignore';
}

const DEFAULT_OPTIONS: FormatOptions = {
    tabWidth: 4, useTabs: false, printWidth: 100, semi: true, singleQuote: true,
    trailingComma: 'es5', bracketSpacing: true, arrowParens: 'always', endOfLine: 'lf',
    sqlDialect: 'sql', sqlUppercase: true, sqlKeywordCase: 'upper', xmlWhitespaceSensitivity: 'ignore'
};

const TOOL_TO_LANGUAGE: Record<string, string> = {
    'js-format': 'javascript', 'html-format': 'html', 'css-format': 'css', 'xml-format': 'xml', 'sql-format': 'sql'
};

type Mode = 'format' | 'minify';

const CodeFormatTool: React.FC = () => {
    const { activeTool } = useTools();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<Mode>('format');
    const [showSettings, setShowSettings] = useState(false);
    const [options, setOptions] = useState<FormatOptions>(DEFAULT_OPTIONS);
    const [processing, setProcessing] = useState(false);
    const [stats, setStats] = useState<{ original: number; result: number; time: number } | null>(null);

    const [selectedLang, setSelectedLang] = useState<string>(() => {
        return TOOL_TO_LANGUAGE[activeTool] || 'javascript';
    });

    useEffect(() => {
        if (TOOL_TO_LANGUAGE[activeTool]) {
            setSelectedLang(TOOL_TO_LANGUAGE[activeTool]);
        }
    }, [activeTool]);

    const currentLangConfig = useMemo(() => {
        return LANGUAGE_CONFIGS.find(l => l.id === selectedLang) || LANGUAGE_CONFIGS[0];
    }, [selectedLang]);

    const loadPrettierPlugins = useCallback(async (pluginNames: string[]) => {
        const plugins: any[] = [];
        for (const name of pluginNames) {
            try {
                switch (name) {
                    case 'babel': plugins.push((await import('prettier/plugins/babel')).default); break;
                    case 'estree': plugins.push((await import('prettier/plugins/estree')).default); break;
                    case 'html': plugins.push((await import('prettier/plugins/html')).default); break;
                    case 'postcss': plugins.push((await import('prettier/plugins/postcss')).default); break;
                    case 'markdown': plugins.push((await import('prettier/plugins/markdown')).default); break;
                    case 'yaml': plugins.push((await import('prettier/plugins/yaml')).default); break;
                    case 'graphql': plugins.push((await import('prettier/plugins/graphql')).default); break;
                    case 'typescript': plugins.push((await import('prettier/plugins/typescript')).default); break;
                    case 'sql': plugins.push((await import('prettier-plugin-sql')).default); break;
                    case 'java': plugins.push((await import('prettier-plugin-java')).default); break;
                    case 'php': plugins.push((await import('@prettier/plugin-php')).default); break;
                }
            } catch (e) { console.warn(`加载插件 ${name} 失败:`, e); }
        }
        return plugins;
    }, []);

    const handleFormat = useCallback(async () => {
        if (!input.trim()) { setError('请输入要格式化的代码'); return; }
        setProcessing(true); setError(null);
        const startTime = performance.now();
        try {
            let formatted: string;
            if (currentLangConfig.id === 'xml') {
                const xmlFormat = (await import('xml-formatter')).default;
                formatted = xmlFormat(input, {
                    indentation: options.useTabs ? '\t' : ' '.repeat(options.tabWidth),
                    collapseContent: true,
                    lineSeparator: options.endOfLine === 'crlf' ? '\r\n' : options.endOfLine === 'cr' ? '\r' : '\n'
                });
            } else if (currentLangConfig.id === 'json') {
                const indent = options.useTabs ? '\t' : ' '.repeat(options.tabWidth);
                formatted = JSON.stringify(JSON.parse(input), null, indent);
            } else {
                const prettier = (await import('prettier/standalone')).default;
                const plugins = await loadPrettierPlugins(currentLangConfig.plugins);
                const prettierOptions: any = {
                    parser: currentLangConfig.parser, plugins,
                    tabWidth: options.tabWidth, useTabs: options.useTabs, printWidth: options.printWidth,
                    semi: options.semi, singleQuote: options.singleQuote, trailingComma: options.trailingComma,
                    bracketSpacing: options.bracketSpacing, arrowParens: options.arrowParens, endOfLine: options.endOfLine,
                };
                if (currentLangConfig.id === 'sql') {
                    prettierOptions.language = options.sqlDialect;
                    prettierOptions.keywordCase = options.sqlKeywordCase;
                }
                formatted = await prettier.format(input, prettierOptions);
            }
            setOutput(formatted);
            setStats({ original: input.length, result: formatted.length, time: Math.round(performance.now() - startTime) });
        } catch (e: any) { setError(e.message || '格式化失败'); setOutput(''); }
        finally { setProcessing(false); }
    }, [input, currentLangConfig, options, loadPrettierPlugins]);

    const handleMinify = useCallback(async () => {
        if (!input.trim()) { setError('请输入要压缩的代码'); return; }
        if (!currentLangConfig.supportsMinify) { setError(`${currentLangConfig.name} 暂不支持压缩功能`); return; }
        setProcessing(true); setError(null);
        const startTime = performance.now();
        try {
            let minified = '';
            switch (currentLangConfig.id) {
                case 'javascript': case 'typescript': {
                    const { minify } = await import('terser');
                    const result = await minify(input, { compress: true, mangle: true, format: { comments: false } });
                    minified = result.code || ''; break;
                }
                case 'css': case 'scss': case 'less': {
                    const CleanCSS = (await import('clean-css')).default;
                    const result = new CleanCSS({ level: 2, format: false }).minify(input);
                    if (result.errors?.length) throw new Error(result.errors.join('\n'));
                    minified = result.styles; break;
                }
                case 'html': {
                    const { minify: minifyHtml } = await import('html-minifier-terser');
                    minified = await minifyHtml(input, {
                        collapseWhitespace: true, removeComments: true, removeRedundantAttributes: true,
                        removeEmptyAttributes: true, minifyCSS: true, minifyJS: true
                    }); break;
                }
                case 'json': { minified = JSON.stringify(JSON.parse(input)); break; }
                case 'xml': {
                    const xmlFormat = (await import('xml-formatter')).default;
                    minified = xmlFormat(input, { indentation: '', collapseContent: true, lineSeparator: '' }); break;
                }
                default: throw new Error(`${currentLangConfig.name} 暂不支持压缩`);
            }
            setOutput(minified);
            setStats({ original: input.length, result: minified.length, time: Math.round(performance.now() - startTime) });
        } catch (e: any) { setError(e.message || '压缩失败'); setOutput(''); }
        finally { setProcessing(false); }
    }, [input, currentLangConfig]);

    const handleProcess = useCallback(() => {
        mode === 'format' ? handleFormat() : handleMinify();
    }, [mode, handleFormat, handleMinify]);

    const handleClear = useCallback(() => {
        setInput(''); setOutput(''); setError(null); setStats(null);
    }, []);

    const handleCopy = useCallback(async () => {
        if (output) await navigator.clipboard.writeText(output);
    }, [output]);

    const updateOption = useCallback(<K extends keyof FormatOptions>(key: K, value: FormatOptions[K]) => {
        setOptions(prev => ({ ...prev, [key]: value }));
    }, []);

    const compressionRatio = useMemo(() => {
        if (!stats || stats.original === 0) return null;
        return ((stats.original - stats.result) / stats.original * 100).toFixed(1);
    }, [stats]);

    const supportsOption = (option: FormatOptionType) =>
        currentLangConfig.supportedOptions.includes(option);

    const SettingsPanel = () => (
        <div className={styles.settingsPanel}>
            <div className={styles.settingsHeader}>
                <span className={styles.settingsTitle}><FileCode size={16} /> 格式化选项</span>
            </div>
            <div className={styles.languageSelector}>
                {LANGUAGE_CONFIGS.map(lang => (
                    <button key={lang.id} className={`${styles.langButton} ${selectedLang === lang.id ? styles.active : ''}`}
                        onClick={() => setSelectedLang(lang.id)}>{lang.name}</button>
                ))}
            </div>
            <div className={styles.settingsGrid}>
                {supportsOption('tabWidth') && (
                    <div className={styles.settingItem}><label>缩进宽度</label>
                        <input type="number" className={styles.optionInput} value={options.tabWidth} min={1} max={8}
                            onChange={e => updateOption('tabWidth', parseInt(e.target.value) || 2)} style={{ width: '100%' }} /></div>
                )}
                {supportsOption('printWidth') && (
                    <div className={styles.settingItem}><label>每行最大宽度</label>
                        <input type="number" className={styles.optionInput} value={options.printWidth} min={40} max={200}
                            onChange={e => updateOption('printWidth', parseInt(e.target.value) || 80)} style={{ width: '100%' }} /></div>
                )}
                {supportsOption('endOfLine') && (
                    <div className={styles.settingItem}><label>行尾格式</label>
                        <select className={styles.optionSelect} value={options.endOfLine}
                            onChange={e => updateOption('endOfLine', e.target.value as any)} style={{ width: '100%' }}>
                            <option value="lf">LF (Unix)</option><option value="crlf">CRLF (Windows)</option>
                            <option value="cr">CR (Mac)</option><option value="auto">自动</option>
                        </select></div>
                )}
                {supportsOption('trailingComma') && (
                    <div className={styles.settingItem}><label>尾随逗号</label>
                        <select className={styles.optionSelect} value={options.trailingComma}
                            onChange={e => updateOption('trailingComma', e.target.value as any)} style={{ width: '100%' }}>
                            <option value="none">无</option><option value="es5">ES5</option><option value="all">全部</option>
                        </select></div>
                )}
                {supportsOption('useTabs') && (
                    <label className={styles.checkbox}><input type="checkbox" checked={options.useTabs}
                        onChange={e => updateOption('useTabs', e.target.checked)} />使用 Tab 缩进</label>
                )}
                {supportsOption('semi') && (
                    <label className={styles.checkbox}><input type="checkbox" checked={options.semi}
                        onChange={e => updateOption('semi', e.target.checked)} />添加分号</label>
                )}
                {supportsOption('singleQuote') && (
                    <label className={styles.checkbox}><input type="checkbox" checked={options.singleQuote}
                        onChange={e => updateOption('singleQuote', e.target.checked)} />使用单引号</label>
                )}
                {supportsOption('bracketSpacing') && (
                    <label className={styles.checkbox}><input type="checkbox" checked={options.bracketSpacing}
                        onChange={e => updateOption('bracketSpacing', e.target.checked)} />对象花括号内空格</label>
                )}
            </div>
            {currentLangConfig.id === 'sql' && (
                <div className={styles.settingsGrid} style={{ marginTop: 12 }}>
                    <div className={styles.settingItem}><label>SQL 方言</label>
                        <select className={styles.optionSelect} value={options.sqlDialect}
                            onChange={e => updateOption('sqlDialect', e.target.value)} style={{ width: '100%' }}>
                            {SQL_DIALECTS.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}
                        </select></div>
                    <div className={styles.settingItem}><label>关键字大小写</label>
                        <select className={styles.optionSelect} value={options.sqlKeywordCase}
                            onChange={e => updateOption('sqlKeywordCase', e.target.value as any)} style={{ width: '100%' }}>
                            <option value="upper">大写</option><option value="lower">小写</option><option value="preserve">保持原样</option>
                        </select></div>
                </div>
            )}
        </div>
    );

    return (
        <ToolCard title="代码格式化工具" description="支持多种语言的代码格式化与压缩，让您的代码更加整洁美观。">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>
                {/* Header */}
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className={styles.modeToggle}>
                        <button className={`${styles.modeButton} ${mode === 'format' ? styles.active : ''}`}
                            onClick={() => setMode('format')}><Maximize2 size={14} style={{ marginRight: 4 }} />格式化</button>
                        <button className={`${styles.modeButton} ${mode === 'minify' ? styles.active : ''}`}
                            onClick={() => setMode('minify')} disabled={!currentLangConfig.supportsMinify}
                            title={!currentLangConfig.supportsMinify ? '该语言暂不支持压缩' : ''}>
                            <Minimize2 size={14} style={{ marginRight: 4 }} />压缩</button>
                    </div>
                    <button onClick={handleProcess} disabled={processing} style={{
                        background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px',
                        borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center',
                        gap: '8px', opacity: processing ? 0.7 : 1
                    }}>
                        {processing ? <>处理中...</> : mode === 'format'
                            ? <><Check size={18} /> 格式化</> : <><Zap size={18} /> 压缩</>}
                    </button>
                    <button className={styles.toggleButton} onClick={() => setShowSettings(!showSettings)}>
                        <Settings size={14} />选项{showSettings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <div style={{ flex: 1 }} />
                    <button onClick={handleClear} style={{ color: 'var(--error-color)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Trash2 size={16} /> 清空</button>
                </div>

                {showSettings && <SettingsPanel />}

                {/* 编辑器区域 */}
                <div style={{ flex: 1, minHeight: 0 }}>
                    <SplitPane id="code-format-tool" direction="horizontal">
                        <ToolPane title={`源代码 (${currentLangConfig.name})`} style={{ paddingRight: '4px' }}>
                            <MonacoEditor value={input} onChange={v => setInput(v || '')} language={currentLangConfig.monacoLang} />
                        </ToolPane>
                        <ToolPane title={mode === 'format' ? '格式化结果' : '压缩结果'} style={{ paddingLeft: '4px' }}
                            extra={<button onClick={handleCopy} style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Copy size={14} /> 复制</button>}>
                            <MonacoEditor value={output} readOnly language={currentLangConfig.monacoLang} />
                        </ToolPane>
                    </SplitPane>
                </div>

                {/* 错误信息 */}
                {error && <div className={styles.errorMessage}>{error}</div>}

                {/* 统计信息 */}
                {stats && !error && (
                    <div className={styles.statsBar}>
                        <div className={styles.statItem}>
                            <BarChart3 size={14} />
                            <span>原始: <span className={styles.statValue}>{stats.original.toLocaleString()}</span> 字符</span>
                        </div>
                        <div className={styles.statItem}>
                            <span>结果: <span className={styles.statValue}>{stats.result.toLocaleString()}</span> 字符</span>
                        </div>
                        {compressionRatio && (
                            <div className={styles.statItem}>
                                <span>变化:
                                    <span className={parseFloat(compressionRatio) > 0 ? styles.statPositive : styles.statNegative}>
                                        {parseFloat(compressionRatio) > 0 ? ' -' : ' +'}{Math.abs(parseFloat(compressionRatio))}%
                                    </span>
                                </span>
                            </div>
                        )}
                        <div className={styles.statItem}>
                            <span>耗时: <span className={styles.statValue}>{stats.time}</span> ms</span>
                        </div>
                    </div>
                )}
            </div>
        </ToolCard>
    );
};

export default CodeFormatTool;