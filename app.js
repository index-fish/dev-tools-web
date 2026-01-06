// ========================================
// DevToolbox - Main Application Script
// ========================================

// DOM Elements
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const pageTitle = document.getElementById('pageTitle');
const contentBody = document.getElementById('contentBody');
const navItems = document.querySelectorAll('.nav-item');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

let currentTool = 'json-format';

let isInitialized = false;

function init() {
    if (isInitialized) return;

    loadTheme();
    loadCollapsedState();
    loadTool('json-format');
    setupNavigation();
    setupMobileMenu();
    setupThemeObserver();

    isInitialized = true;
}

// Global observer for theme changes (more reliable than single click events)
function setupThemeObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                const newTheme = document.documentElement.dataset.theme;
                console.log('DevToolbox: Theme changed to', newTheme);
                if (window.monacoManager) {
                    window.monacoManager.updateTheme();
                }
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
}



// ========================================
// Section Collapse/Expand
// ========================================
function toggleSection(titleElement) {
    const section = titleElement.closest('.nav-section');
    section.classList.toggle('collapsed');
    saveCollapsedState();
}

function loadCollapsedState() {
    try {
        const saved = localStorage.getItem('collapsedSections');
        if (saved) {
            const collapsed = JSON.parse(saved);
            document.querySelectorAll('.nav-section').forEach((section, index) => {
                if (collapsed.includes(index)) {
                    section.classList.add('collapsed');
                }
            });
        }
    } catch (e) { }
}

function saveCollapsedState() {
    const collapsed = [];
    document.querySelectorAll('.nav-section').forEach((section, index) => {
        if (section.classList.contains('collapsed')) {
            collapsed.push(index);
        }
    });
    localStorage.setItem('collapsedSections', JSON.stringify(collapsed));
}


function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.dataset.theme = savedTheme;
    themeToggle.querySelector('.theme-icon').textContent = savedTheme === 'light' ? '☀️' : '🌙';
}

function loadTool(toolId) {
    if (!toolTemplates[toolId]) {
        showToast('工具加载失败', true);
        return;
    }

    // Dispose previous Monaco editors before loading new tool
    if (window.monacoManager) {
        window.monacoManager.disposeAll();
    }

    currentTool = toolId;
    contentBody.innerHTML = toolTemplates[toolId];
    pageTitle.textContent = toolTitles[toolId] || toolId;

    // Initialize Monaco editors for this tool
    if (window.monacoManager) {
        window.monacoManager.initToolEditors(toolId);
    }

    // Initialize tool-specific features
    if (toolId === 'timestamp') {
        refreshTimestamp();
        setInterval(refreshTimestamp, 1000);
    }
    if (toolId === 'color') {
        updateColorFromHex();
    }

    // Setup resizers for split view
    setupResizers();
}

// ========================================
// Resizable Split View Logic
// ========================================
function setupResizers() {
    // Horizontal Resizers
    const hResizers = document.querySelectorAll('.resizer');
    hResizers.forEach(resizer => {
        const leftPane = resizer.previousElementSibling;
        const container = resizer.parentElement;

        let isDragging = false;

        resizer.addEventListener('mousedown', (e) => {
            isDragging = true;
            resizer.classList.add('dragging');
            document.body.style.cursor = 'col-resize';
            e.preventDefault();
        });

        const moveHandler = (e) => {
            if (!isDragging) return;

            const containerRect = container.getBoundingClientRect();
            const isMobile = window.innerWidth <= 1024;

            if (!isMobile) {
                let offset = e.clientX - containerRect.left;
                if (offset < 150) offset = 150;
                if (offset > containerRect.width - 150) offset = containerRect.width - 150;

                const percentage = (offset / containerRect.width) * 100;
                leftPane.style.flex = `0 0 ${percentage}%`;

                if (window.monacoManager) {
                    window.monacoManager.layoutAll();
                }
            }
        };

        const upHandler = () => {
            if (isDragging) {
                isDragging = false;
                resizer.classList.remove('dragging');
                document.body.style.cursor = '';
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);
            }
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    });

    // Vertical Resizers
    const vResizers = document.querySelectorAll('.resizer-v');
    vResizers.forEach(resizer => {
        const splitView = resizer.previousElementSibling;

        let isDragging = false;

        resizer.addEventListener('mousedown', (e) => {
            isDragging = true;
            resizer.classList.add('dragging');
            document.body.style.cursor = 'row-resize';
            e.preventDefault();
        });

        const moveHandler = (e) => {
            if (!isDragging) return;

            const splitViewRect = splitView.getBoundingClientRect();
            let height = e.clientY - splitViewRect.top;

            if (height < 200) height = 200;
            if (height > 1200) height = 1200;

            splitView.style.height = `${height}px`;

            if (window.monacoManager) {
                window.monacoManager.layoutAll();
            }
        };

        const upHandler = () => {
            if (isDragging) {
                isDragging = false;
                resizer.classList.remove('dragging');
                document.body.style.cursor = '';
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);
            }
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    });
}

function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tool = item.dataset.tool;
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            loadTool(tool);
            sidebar.classList.remove('open');
        });
    });

    themeToggle.addEventListener('click', () => {
        const icon = themeToggle.querySelector('.theme-icon');
        if (document.documentElement.dataset.theme === 'light') {
            document.documentElement.dataset.theme = 'dark';
            icon.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.dataset.theme = 'light';
            icon.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        }
        // Update Monaco editor theme
        if (window.monacoManager) {
            window.monacoManager.updateTheme();
        }
    });
}

function setupMobileMenu() {
    menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

// ========================================
// Toast Notifications
// ========================================
function showToast(message, isError = false) {
    toastMessage.textContent = message;
    toast.classList.remove('error');
    if (isError) toast.classList.add('error');
    toast.querySelector('.toast-icon').textContent = isError ? '✗' : '✓';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ========================================
// Clipboard
// ========================================
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.value || element.textContent;
    if (!text) { showToast('没有内容可复制', true); return; }
    navigator.clipboard.writeText(text).then(() => showToast('已复制到剪贴板')).catch(() => showToast('复制失败', true));
}

// Copy from Monaco Editor
function copyFromMonaco(editorId) {
    const text = window.monacoManager ? window.monacoManager.getValue(editorId) : '';
    if (!text) { showToast('没有内容可复制', true); return; }
    navigator.clipboard.writeText(text).then(() => showToast('已复制到剪贴板')).catch(() => showToast('复制失败', true));
}

function clearTool(prefix) {
    document.querySelectorAll(`[id^="${prefix}-"]`).forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = '';
    });
}

// Clear Monaco editors for a tool
function clearMonacoTool(prefix) {
    if (window.monacoManager) {
        Object.keys(window.monacoManager.editors).forEach(id => {
            if (id.startsWith(prefix)) {
                window.monacoManager.setValue(id, '');
            }
        });
    }
}

// Update output language badge for JSON to class tool
function updateOutputLanguage() {
    const lang = document.getElementById('json-class-lang').value;
    const badge = document.getElementById('json-class-lang-badge');
    const langNames = {
        'typescript': 'TypeScript',
        'java': 'Java',
        'csharp': 'C#',
        'python': 'Python',
        'go': 'Go'
    };
    if (badge) badge.textContent = langNames[lang] || lang;

    // Update Monaco editor language
    if (window.monacoManager) {
        window.monacoManager.updateLanguage('json-class-output', window.monacoManager.getLanguageFromSelection(lang));
    }
}

// ========================================
// JSON Tools
// ========================================
function formatJson() {
    try {
        const input = window.monacoManager ? window.monacoManager.getValue('json-input') : document.getElementById('json-input').value;
        if (!input) { showToast('请输入JSON', true); return; }
        const indent = document.getElementById('json-indent').value;
        const space = indent === 'tab' ? '\t' : parseInt(indent);
        const result = JSON.stringify(JSON.parse(input), null, space);
        if (window.monacoManager) {
            window.monacoManager.setValue('json-output', result);
            setTimeout(() => {
                const editor = window.monacoManager.editors['json-output'];
                if (editor) editor.layout();
            }, 50);
        } else {
            document.getElementById('json-output').value = result;
        }
        showToast('JSON格式化成功');
    } catch (e) { showToast('JSON解析失败: ' + e.message, true); }
}

function compressJson() {
    try {
        const input = window.monacoManager ? window.monacoManager.getValue('json-input') : document.getElementById('json-input').value;
        if (!input) { showToast('请输入JSON', true); return; }
        const result = JSON.stringify(JSON.parse(input));
        if (window.monacoManager) {
            window.monacoManager.setValue('json-output', result);
        } else {
            document.getElementById('json-output').value = result;
        }
        showToast('JSON压缩成功');
    } catch (e) { showToast('JSON解析失败: ' + e.message, true); }
}

function validateJson() {
    try {
        const input = window.monacoManager ? window.monacoManager.getValue('json-input') : document.getElementById('json-input').value;
        if (!input) { showToast('请输入JSON', true); return; }
        JSON.parse(input);
        showToast('✓ JSON格式有效');
        if (window.monacoManager) {
            window.monacoManager.setValue('json-output', '✓ JSON格式有效');
        } else {
            document.getElementById('json-output').value = '✓ JSON格式有效';
        }
    } catch (e) {
        showToast('✗ JSON格式无效', true);
        const errorMsg = '✗ ' + e.message;
        if (window.monacoManager) {
            window.monacoManager.setValue('json-output', errorMsg);
        } else {
            document.getElementById('json-output').value = errorMsg;
        }
    }
}

function jsonEscape() {
    const input = window.monacoManager ? window.monacoManager.getValue('json-escape-input') : document.getElementById('json-escape-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    const result = JSON.stringify(input);
    if (window.monacoManager) {
        window.monacoManager.setValue('json-escape-output', result);
    } else {
        document.getElementById('json-escape-output').value = result;
    }
    showToast('转义成功');
}

function jsonUnescape() {
    try {
        const input = window.monacoManager ? window.monacoManager.getValue('json-escape-input') : document.getElementById('json-escape-input').value;
        if (!input) { showToast('请输入文本', true); return; }
        const result = JSON.parse(input);
        if (window.monacoManager) {
            window.monacoManager.setValue('json-escape-output', result);
        } else {
            document.getElementById('json-escape-output').value = result;
        }
        showToast('反转义成功');
    } catch (e) { showToast('反转义失败: ' + e.message, true); }
}

function jsonToClass() {
    try {
        const input = window.monacoManager ? window.monacoManager.getValue('json-class-input') : document.getElementById('json-class-input').value;
        const lang = document.getElementById('json-class-lang').value;
        const className = document.getElementById('json-class-name').value || 'MyClass';
        if (!input) { showToast('请输入JSON', true); return; }
        const obj = JSON.parse(input);
        let result = '';

        const getType = (val, lang) => {
            if (val === null) return lang === 'typescript' ? 'any' : lang === 'java' ? 'Object' : lang === 'csharp' ? 'object' : lang === 'python' ? 'Any' : 'interface{}';
            if (Array.isArray(val)) return lang === 'typescript' ? 'any[]' : lang === 'java' ? 'List<Object>' : lang === 'csharp' ? 'List<object>' : lang === 'python' ? 'list' : '[]interface{}';
            switch (typeof val) {
                case 'string': return lang === 'typescript' ? 'string' : lang === 'java' ? 'String' : lang === 'csharp' ? 'string' : lang === 'python' ? 'str' : 'string';
                case 'number': return Number.isInteger(val) ? (lang === 'typescript' ? 'number' : lang === 'java' ? 'int' : lang === 'csharp' ? 'int' : lang === 'python' ? 'int' : 'int') : (lang === 'typescript' ? 'number' : lang === 'java' ? 'double' : lang === 'csharp' ? 'double' : lang === 'python' ? 'float' : 'float64');
                case 'boolean': return lang === 'typescript' ? 'boolean' : lang === 'java' ? 'boolean' : lang === 'csharp' ? 'bool' : lang === 'python' ? 'bool' : 'bool';
                default: return 'any';
            }
        };

        if (lang === 'typescript') {
            result = `interface ${className} {\n`;
            for (const [k, v] of Object.entries(obj)) result += `  ${k}: ${getType(v, lang)};\n`;
            result += '}';
        } else if (lang === 'java') {
            result = `public class ${className} {\n`;
            for (const [k, v] of Object.entries(obj)) result += `    private ${getType(v, lang)} ${k};\n`;
            result += '\n    // Getters and Setters\n';
            for (const [k, v] of Object.entries(obj)) {
                const cap = k.charAt(0).toUpperCase() + k.slice(1);
                result += `    public ${getType(v, lang)} get${cap}() { return ${k}; }\n`;
                result += `    public void set${cap}(${getType(v, lang)} ${k}) { this.${k} = ${k}; }\n`;
            }
            result += '}';
        } else if (lang === 'csharp') {
            result = `public class ${className}\n{\n`;
            for (const [k, v] of Object.entries(obj)) {
                const cap = k.charAt(0).toUpperCase() + k.slice(1);
                result += `    public ${getType(v, lang)} ${cap} { get; set; }\n`;
            }
            result += '}';
        } else if (lang === 'python') {
            result = `from dataclasses import dataclass\nfrom typing import Any, List\n\n@dataclass\nclass ${className}:\n`;
            for (const [k, v] of Object.entries(obj)) result += `    ${k}: ${getType(v, lang)}\n`;
        } else if (lang === 'go') {
            result = `type ${className} struct {\n`;
            for (const [k, v] of Object.entries(obj)) {
                const cap = k.charAt(0).toUpperCase() + k.slice(1);
                result += `    ${cap} ${getType(v, lang)} \`json:"${k}"\`\n`;
            }
            result += '}';
        }

        if (window.monacoManager) {
            window.monacoManager.setValue('json-class-output', result);
            // Update language for syntax highlighting
            window.monacoManager.updateLanguage('json-class-output', window.monacoManager.getLanguageFromSelection(lang));
        } else {
            document.getElementById('json-class-output').value = result;
        }
        // Update language badge
        updateOutputLanguage();
        showToast('生成成功');
    } catch (e) { showToast('生成失败: ' + e.message, true); }
}

// ========================================
// Code Formatters
// ========================================
function formatHtml() {
    try {
        const input = window.monacoManager ? window.monacoManager.getValue('html-input') : document.getElementById('html-input').value;
        if (!input) { showToast('请输入HTML', true); return; }
        if (typeof html_beautify === 'undefined') { throw new Error('HTML格式化库未加载'); }
        const result = html_beautify(input, { indent_size: 2, wrap_line_length: 0 });
        if (window.monacoManager) {
            window.monacoManager.setValue('html-output', result);
            setTimeout(() => {
                const editor = window.monacoManager.editors['html-output'];
                if (editor) editor.layout();
            }, 50);
        } else {
            document.getElementById('html-output').value = result;
        }
        showToast('格式化成功');
    } catch (e) { showToast('失败: ' + e.message, true); }
}

function compressHtml() {
    const input = window.monacoManager ? window.monacoManager.getValue('html-input') : document.getElementById('html-input').value;
    if (!input) { showToast('请输入HTML', true); return; }
    const result = input.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
    if (window.monacoManager) {
        window.monacoManager.setValue('html-output', result);
    } else {
        document.getElementById('html-output').value = result;
    }
    showToast('压缩成功');
}

function formatJs() {
    try {
        const input = window.monacoManager ? window.monacoManager.getValue('js-input') : document.getElementById('js-input').value;
        if (!input) { showToast('请输入JavaScript', true); return; }

        // Try multiple possible locations for the beautifier function
        let beautifier = window.js_beautify || window.beautify || window.js;

        // Sometimes it's nested in an object
        if (typeof beautifier === 'object') {
            beautifier = beautifier.js_beautify || beautifier.js || beautifier.beautify || beautifier;
        }

        // Last resort: search window for anything containing 'beautify' that is a function
        if (typeof beautifier !== 'function') {
            for (const key in window) {
                if (key.toLowerCase().includes('beautify') && typeof window[key] === 'function') {
                    beautifier = window[key];
                    break;
                }
            }
        }

        if (typeof beautifier !== 'function') {
            console.error('JS Beautifier not found. window keys:', Object.keys(window).filter(k => k.toLowerCase().includes('beautify')));
            throw new Error('JS格式化库未加载');
        }

        const result = beautifier(input, { indent_size: 2, space_in_empty_paren: true });
        if (window.monacoManager) {
            window.monacoManager.setValue('js-output', result);
            setTimeout(() => {
                const editor = window.monacoManager.editors['js-output'];
                if (editor) editor.layout();
            }, 50);
        } else {
            document.getElementById('js-output').value = result;
        }
        showToast('格式化成功');
    } catch (e) { showToast('失败: ' + e.message, true); }
}

function compressJs() {
    const input = window.monacoManager ? window.monacoManager.getValue('js-input') : document.getElementById('js-input').value;
    if (!input) { showToast('请输入JavaScript', true); return; }
    const result = input.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').replace(/\s+/g, ' ').trim();
    if (window.monacoManager) {
        window.monacoManager.setValue('js-output', result);
    } else {
        document.getElementById('js-output').value = result;
    }
    showToast('压缩成功');
}

function formatCss() {
    const input = window.monacoManager ? window.monacoManager.getValue('css-input') : document.getElementById('css-input').value;
    if (!input) { showToast('请输入CSS', true); return; }
    const result = css_beautify(input, { indent_size: 2 });
    if (window.monacoManager) {
        window.monacoManager.setValue('css-output', result);
    } else {
        document.getElementById('css-output').value = result;
    }
    showToast('格式化成功');
}

function compressCss() {
    const input = window.monacoManager ? window.monacoManager.getValue('css-input') : document.getElementById('css-input').value;
    if (!input) { showToast('请输入CSS', true); return; }
    const result = input.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').trim();
    if (window.monacoManager) {
        window.monacoManager.setValue('css-output', result);
    } else {
        document.getElementById('css-output').value = result;
    }
    showToast('压缩成功');
}

function formatXml() {
    const input = window.monacoManager ? window.monacoManager.getValue('xml-input') : document.getElementById('xml-input').value;
    if (!input) { showToast('请输入XML', true); return; }
    let formatted = '', indent = '';
    input.split(/>\s*</).forEach(node => {
        if (node.match(/^\/\w/)) indent = indent.substring(2);
        formatted += indent + '<' + node + '>\n';
        if (node.match(/^<?\w[^>]*[^\/]$/)) indent += '  ';
    });
    const result = formatted.substring(1, formatted.length - 2);
    if (window.monacoManager) {
        window.monacoManager.setValue('xml-output', result);
    } else {
        document.getElementById('xml-output').value = result;
    }
    showToast('格式化成功');
}

function compressXml() {
    const input = window.monacoManager ? window.monacoManager.getValue('xml-input') : document.getElementById('xml-input').value;
    if (!input) { showToast('请输入XML', true); return; }
    const result = input.replace(/>\s+</g, '><').trim();
    if (window.monacoManager) {
        window.monacoManager.setValue('xml-output', result);
    } else {
        document.getElementById('xml-output').value = result;
    }
    showToast('压缩成功');
}

function formatSql() {
    const input = window.monacoManager ? window.monacoManager.getValue('sql-input') : document.getElementById('sql-input').value;
    if (!input) { showToast('请输入SQL', true); return; }
    try {
        const result = sqlFormatter.format(input, { language: 'sql' });
        if (window.monacoManager) {
            window.monacoManager.setValue('sql-output', result);
        } else {
            document.getElementById('sql-output').value = result;
        }
        showToast('格式化成功');
    } catch (e) { showToast('格式化失败', true); }
}

function compressSql() {
    const input = window.monacoManager ? window.monacoManager.getValue('sql-input') : document.getElementById('sql-input').value;
    if (!input) { showToast('请输入SQL', true); return; }
    const result = input.replace(/\s+/g, ' ').trim();
    if (window.monacoManager) {
        window.monacoManager.setValue('sql-output', result);
    } else {
        document.getElementById('sql-output').value = result;
    }
    showToast('压缩成功');
}

// ========================================
// Encoding/Decoding
// ========================================
function base64Encode() {
    try {
        const input = document.getElementById('base64-input').value;
        if (!input) { showToast('请输入文本', true); return; }
        document.getElementById('base64-output').value = btoa(unescape(encodeURIComponent(input)));
        showToast('编码成功');
    } catch (e) { showToast('编码失败: ' + e.message, true); }
}

function base64Decode() {
    try {
        const input = document.getElementById('base64-input').value;
        if (!input) { showToast('请输入Base64', true); return; }
        document.getElementById('base64-output').value = decodeURIComponent(escape(atob(input)));
        showToast('解码成功');
    } catch (e) { showToast('解码失败: ' + e.message, true); }
}

function baseMultiEncode() {
    const input = document.getElementById('base-multi-input').value;
    const type = document.getElementById('base-type').value;
    if (!input) { showToast('请输入文本', true); return; }
    let result = '';
    if (type === '16') {
        for (let i = 0; i < input.length; i++) result += input.charCodeAt(i).toString(16).padStart(2, '0');
        result = result.toUpperCase();
    } else if (type === '32') {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let bits = '', i = 0;
        for (let c of input) bits += c.charCodeAt(0).toString(2).padStart(8, '0');
        while (bits.length % 5) bits += '0';
        while (i < bits.length) { result += alphabet[parseInt(bits.substr(i, 5), 2)]; i += 5; }
        while (result.length % 8) result += '=';
    } else if (type === '58') {
        const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        let bytes = new TextEncoder().encode(input);
        let num = BigInt('0x' + [...bytes].map(b => b.toString(16).padStart(2, '0')).join(''));
        while (num > 0) { result = alphabet[Number(num % 58n)] + result; num = num / 58n; }
    } else if (type === '62') {
        const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let bytes = new TextEncoder().encode(input);
        let num = BigInt('0x' + [...bytes].map(b => b.toString(16).padStart(2, '0')).join(''));
        while (num > 0) { result = alphabet[Number(num % 62n)] + result; num = num / 62n; }
    }
    document.getElementById('base-multi-output').value = result;
    showToast('编码成功');
}

function baseMultiDecode() {
    const input = document.getElementById('base-multi-input').value;
    const type = document.getElementById('base-type').value;
    if (!input) { showToast('请输入编码', true); return; }
    try {
        let result = '';
        if (type === '16') {
            for (let i = 0; i < input.length; i += 2) result += String.fromCharCode(parseInt(input.substr(i, 2), 16));
        }
        document.getElementById('base-multi-output').value = result || '解码功能开发中...';
        showToast('解码成功');
    } catch (e) { showToast('解码失败', true); }
}

function urlEncode() {
    const input = document.getElementById('url-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    document.getElementById('url-output').value = encodeURI(input);
    showToast('编码成功');
}

function urlDecode() {
    try {
        const input = document.getElementById('url-input').value;
        if (!input) { showToast('请输入URL', true); return; }
        document.getElementById('url-output').value = decodeURI(input);
        showToast('解码成功');
    } catch (e) { showToast('解码失败', true); }
}

function urlEncodeComponent() {
    const input = document.getElementById('url-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    document.getElementById('url-output').value = encodeURIComponent(input);
    showToast('组件编码成功');
}

function urlDecodeComponent() {
    try {
        const input = document.getElementById('url-input').value;
        if (!input) { showToast('请输入URL', true); return; }
        document.getElementById('url-output').value = decodeURIComponent(input);
        showToast('组件解码成功');
    } catch (e) { showToast('解码失败', true); }
}

function toUnicode() {
    const input = document.getElementById('unicode-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    let result = '';
    for (let i = 0; i < input.length; i++) {
        const code = input.charCodeAt(i);
        result += code > 127 ? '\\u' + code.toString(16).padStart(4, '0') : input[i];
    }
    document.getElementById('unicode-output').value = result;
    showToast('转换成功');
}

function fromUnicode() {
    const input = document.getElementById('unicode-input').value;
    if (!input) { showToast('请输入Unicode', true); return; }
    document.getElementById('unicode-output').value = input.replace(/\\u([0-9a-fA-F]{4})/g, (m, c) => String.fromCharCode(parseInt(c, 16)));
    showToast('转换成功');
}

function hexEncode() {
    const input = document.getElementById('hex-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    let result = '';
    for (let i = 0; i < input.length; i++) result += input.charCodeAt(i).toString(16).padStart(2, '0');
    document.getElementById('hex-output').value = result.toUpperCase();
    showToast('编码成功');
}

function hexDecode() {
    const input = document.getElementById('hex-input').value.replace(/\s/g, '');
    if (!input) { showToast('请输入Hex', true); return; }
    try {
        let result = '';
        for (let i = 0; i < input.length; i += 2) result += String.fromCharCode(parseInt(input.substr(i, 2), 16));
        document.getElementById('hex-output').value = result;
        showToast('解码成功');
    } catch (e) { showToast('解码失败', true); }
}

function gzipCompress() {
    try {
        const input = document.getElementById('gzip-input').value;
        const algo = document.getElementById('gzip-algo').value;
        if (!input) { showToast('请输入文本', true); return; }
        const data = new TextEncoder().encode(input);
        const compressed = algo === 'gzip' ? pako.gzip(data) : pako.deflate(data);
        document.getElementById('gzip-output').value = btoa(String.fromCharCode.apply(null, compressed));
        showToast('压缩成功');
    } catch (e) { showToast('压缩失败: ' + e.message, true); }
}

function gzipDecompress() {
    try {
        const input = document.getElementById('gzip-input').value;
        const algo = document.getElementById('gzip-algo').value;
        if (!input) { showToast('请输入压缩数据', true); return; }
        const binary = atob(input);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const decompressed = algo === 'gzip' ? pako.ungzip(bytes) : pako.inflate(bytes);
        document.getElementById('gzip-output').value = new TextDecoder().decode(decompressed);
        showToast('解压成功');
    } catch (e) { showToast('解压失败: ' + e.message, true); }
}

function parseJwt() {
    const input = document.getElementById('jwt-input').value.trim();
    if (!input) { showToast('请输入JWT', true); return; }
    try {
        const parts = input.split('.');
        if (parts.length !== 3) throw new Error('Invalid JWT format');
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        document.getElementById('jwt-header').value = JSON.stringify(header, null, 2);
        document.getElementById('jwt-payload').value = JSON.stringify(payload, null, 2);
        document.getElementById('jwt-signature').value = parts[2];
        showToast('解析成功');
    } catch (e) { showToast('解析失败: ' + e.message, true); }
}

// ========================================
// Hash Functions
// ========================================
function calculateHash() {
    const input = document.getElementById('hash-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    const md5 = CryptoJS.MD5(input).toString();
    document.getElementById('hash-md5').value = md5;
    document.getElementById('hash-md5-16').value = md5.substring(8, 24);
    document.getElementById('hash-sha1').value = CryptoJS.SHA1(input).toString();
    document.getElementById('hash-sha256').value = CryptoJS.SHA256(input).toString();
    document.getElementById('hash-sha512').value = CryptoJS.SHA512(input).toString();
    showToast('计算完成');
}

function calculateHmac() {
    const input = document.getElementById('hmac-input').value;
    const key = document.getElementById('hmac-key').value;
    const algo = document.getElementById('hmac-algo').value;
    if (!input || !key) { showToast('请输入文本和密钥', true); return; }
    const result = CryptoJS['Hmac' + algo](input, key).toString();
    document.getElementById('hmac-output').value = result;
    showToast('计算完成');
}

function calculateCrc() {
    const input = document.getElementById('crc-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    // Simple CRC32 implementation
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < input.length; i++) {
        crc ^= input.charCodeAt(i);
        for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
    document.getElementById('crc32-output').value = ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).toUpperCase().padStart(8, '0');
    showToast('计算完成');
}

function calculateFileHash() {
    const file = document.getElementById('file-hash-input').files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
        document.getElementById('file-md5').value = CryptoJS.MD5(wordArray).toString();
        document.getElementById('file-sha1').value = CryptoJS.SHA1(wordArray).toString();
        document.getElementById('file-sha256').value = CryptoJS.SHA256(wordArray).toString();
        showToast('计算完成');
    };
    reader.readAsArrayBuffer(file);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ========================================
// Symmetric Encryption
// ========================================
function getAesConfig() {
    return {
        mode: CryptoJS.mode[document.getElementById('aes-mode').value],
        padding: CryptoJS.pad[document.getElementById('aes-padding').value]
    };
}

function aesEncrypt() {
    try {
        const input = document.getElementById('aes-input').value;
        const key = document.getElementById('aes-key').value;
        const iv = document.getElementById('aes-iv').value;
        const format = document.getElementById('aes-output-format').value;
        if (!input || !key) { showToast('请输入文本和密钥', true); return; }
        const keyBytes = CryptoJS.enc.Utf8.parse(key);
        const ivBytes = iv ? CryptoJS.enc.Utf8.parse(iv) : keyBytes;
        const encrypted = CryptoJS.AES.encrypt(input, keyBytes, { iv: ivBytes, ...getAesConfig() });
        document.getElementById('aes-output').value = format === 'hex' ? encrypted.ciphertext.toString() : encrypted.toString();
        showToast('AES加密成功');
    } catch (e) { showToast('加密失败: ' + e.message, true); }
}

function aesDecrypt() {
    try {
        const input = document.getElementById('aes-input').value;
        const key = document.getElementById('aes-key').value;
        const iv = document.getElementById('aes-iv').value;
        const format = document.getElementById('aes-output-format').value;
        if (!input || !key) { showToast('请输入密文和密钥', true); return; }
        const keyBytes = CryptoJS.enc.Utf8.parse(key);
        const ivBytes = iv ? CryptoJS.enc.Utf8.parse(iv) : keyBytes;
        const cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: format === 'hex' ? CryptoJS.enc.Hex.parse(input) : CryptoJS.enc.Base64.parse(input)
        });
        const decrypted = CryptoJS.AES.decrypt(cipherParams, keyBytes, { iv: ivBytes, ...getAesConfig() });
        document.getElementById('aes-output').value = decrypted.toString(CryptoJS.enc.Utf8);
        showToast('AES解密成功');
    } catch (e) { showToast('解密失败: ' + e.message, true); }
}

function generateAesKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '', iv = '';
    for (let i = 0; i < 16; i++) { key += chars.charAt(Math.floor(Math.random() * chars.length)); iv += chars.charAt(Math.floor(Math.random() * chars.length)); }
    document.getElementById('aes-key').value = key;
    document.getElementById('aes-iv').value = iv;
    showToast('已生成16位随机密钥');
}

function desEncrypt() {
    try {
        const input = document.getElementById('des-input').value;
        const key = document.getElementById('des-key').value;
        const iv = document.getElementById('des-iv').value;
        const format = document.getElementById('des-output-format').value;
        const mode = document.getElementById('des-mode').value;
        if (!input || !key) { showToast('请输入文本和密钥', true); return; }
        const keyBytes = CryptoJS.enc.Utf8.parse(key);
        const ivBytes = iv ? CryptoJS.enc.Utf8.parse(iv) : keyBytes;
        const encrypted = CryptoJS.DES.encrypt(input, keyBytes, { iv: ivBytes, mode: CryptoJS.mode[mode], padding: CryptoJS.pad.Pkcs7 });
        document.getElementById('des-output').value = format === 'hex' ? encrypted.ciphertext.toString() : encrypted.toString();
        showToast('DES加密成功');
    } catch (e) { showToast('加密失败: ' + e.message, true); }
}

function desDecrypt() {
    try {
        const input = document.getElementById('des-input').value;
        const key = document.getElementById('des-key').value;
        const iv = document.getElementById('des-iv').value;
        const format = document.getElementById('des-output-format').value;
        const mode = document.getElementById('des-mode').value;
        if (!input || !key) { showToast('请输入密文和密钥', true); return; }
        const keyBytes = CryptoJS.enc.Utf8.parse(key);
        const ivBytes = iv ? CryptoJS.enc.Utf8.parse(iv) : keyBytes;
        const cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: format === 'hex' ? CryptoJS.enc.Hex.parse(input) : CryptoJS.enc.Base64.parse(input)
        });
        const decrypted = CryptoJS.DES.decrypt(cipherParams, keyBytes, { iv: ivBytes, mode: CryptoJS.mode[mode], padding: CryptoJS.pad.Pkcs7 });
        document.getElementById('des-output').value = decrypted.toString(CryptoJS.enc.Utf8);
        showToast('DES解密成功');
    } catch (e) { showToast('解密失败: ' + e.message, true); }
}

function generateDesKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '', iv = '';
    for (let i = 0; i < 8; i++) { key += chars.charAt(Math.floor(Math.random() * chars.length)); iv += chars.charAt(Math.floor(Math.random() * chars.length)); }
    document.getElementById('des-key').value = key;
    document.getElementById('des-iv').value = iv;
    showToast('已生成8位随机密钥');
}

function tripleDesEncrypt() {
    try {
        const input = document.getElementById('3des-input').value;
        const key = document.getElementById('3des-key').value;
        const iv = document.getElementById('3des-iv').value;
        if (!input || !key) { showToast('请输入文本和密钥', true); return; }
        const encrypted = CryptoJS.TripleDES.encrypt(input, CryptoJS.enc.Utf8.parse(key), { iv: CryptoJS.enc.Utf8.parse(iv || key.substring(0, 8)) });
        document.getElementById('3des-output').value = encrypted.toString();
        showToast('3DES加密成功');
    } catch (e) { showToast('加密失败', true); }
}

function tripleDesDecrypt() {
    try {
        const input = document.getElementById('3des-input').value;
        const key = document.getElementById('3des-key').value;
        const iv = document.getElementById('3des-iv').value;
        if (!input || !key) { showToast('请输入密文和密钥', true); return; }
        const decrypted = CryptoJS.TripleDES.decrypt(input, CryptoJS.enc.Utf8.parse(key), { iv: CryptoJS.enc.Utf8.parse(iv || key.substring(0, 8)) });
        document.getElementById('3des-output').value = decrypted.toString(CryptoJS.enc.Utf8);
        showToast('3DES解密成功');
    } catch (e) { showToast('解密失败', true); }
}

function generate3DesKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '', iv = '';
    for (let i = 0; i < 24; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
    for (let i = 0; i < 8; i++) iv += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('3des-key').value = key;
    document.getElementById('3des-iv').value = iv;
    showToast('已生成24位随机密钥');
}

function rc4Encrypt() {
    const input = document.getElementById('rc4-input').value;
    const key = document.getElementById('rc4-key').value;
    if (!input || !key) { showToast('请输入文本和密钥', true); return; }
    document.getElementById('rc4-output').value = CryptoJS.RC4.encrypt(input, key).toString();
    showToast('RC4加密成功');
}

function rc4Decrypt() {
    const input = document.getElementById('rc4-input').value;
    const key = document.getElementById('rc4-key').value;
    if (!input || !key) { showToast('请输入密文和密钥', true); return; }
    document.getElementById('rc4-output').value = CryptoJS.RC4.decrypt(input, key).toString(CryptoJS.enc.Utf8);
    showToast('RC4解密成功');
}

function rabbitEncrypt() {
    const input = document.getElementById('rabbit-input').value;
    const key = document.getElementById('rabbit-key').value;
    if (!input || !key) { showToast('请输入文本和密钥', true); return; }
    document.getElementById('rabbit-output').value = CryptoJS.Rabbit.encrypt(input, key).toString();
    showToast('Rabbit加密成功');
}

function rabbitDecrypt() {
    const input = document.getElementById('rabbit-input').value;
    const key = document.getElementById('rabbit-key').value;
    if (!input || !key) { showToast('请输入密文和密钥', true); return; }
    document.getElementById('rabbit-output').value = CryptoJS.Rabbit.decrypt(input, key).toString(CryptoJS.enc.Utf8);
    showToast('Rabbit解密成功');
}

function xorEncrypt() {
    const input = document.getElementById('xor-input').value;
    const key = document.getElementById('xor-key').value;
    if (!input || !key) { showToast('请输入文本和密钥', true); return; }
    let result = '';
    for (let i = 0; i < input.length; i++) result += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    document.getElementById('xor-output').value = btoa(result);
    showToast('XOR加密成功');
}

function rsaEncrypt() {
    try {
        const input = document.getElementById('rsa-input').value;
        const publicKey = document.getElementById('rsa-public-key').value;
        if (!input || !publicKey) { showToast('请输入文本和公钥', true); return; }
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey);
        const encrypted = encrypt.encrypt(input);
        if (!encrypted) { showToast('加密失败', true); return; }
        document.getElementById('rsa-output').value = encrypted;
        showToast('RSA加密成功');
    } catch (e) { showToast('加密失败', true); }
}

function rsaDecrypt() {
    try {
        const input = document.getElementById('rsa-input').value;
        const privateKey = document.getElementById('rsa-private-key').value;
        if (!input || !privateKey) { showToast('请输入密文和私钥', true); return; }
        const decrypt = new JSEncrypt();
        decrypt.setPrivateKey(privateKey);
        const decrypted = decrypt.decrypt(input);
        if (!decrypted) { showToast('解密失败', true); return; }
        document.getElementById('rsa-output').value = decrypted;
        showToast('RSA解密成功');
    } catch (e) { showToast('解密失败', true); }
}

function generateRsaKeyPair() {
    const crypt = new JSEncrypt({ default_key_size: 1024 });
    document.getElementById('rsa-public-key').value = crypt.getPublicKey();
    document.getElementById('rsa-private-key').value = crypt.getPrivateKey();
    showToast('已生成RSA密钥对');
}

// Morse Code
const MORSE_CODE = { 'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', ' ': '/' };

function textToMorse() {
    const input = document.getElementById('morse-input').value.toUpperCase();
    if (!input) { showToast('请输入文本', true); return; }
    document.getElementById('morse-output').value = [...input].map(c => MORSE_CODE[c] || c).join(' ');
    showToast('转换成功');
}

function morseToText() {
    const input = document.getElementById('morse-input').value;
    if (!input) { showToast('请输入摩斯密码', true); return; }
    const reverse = Object.fromEntries(Object.entries(MORSE_CODE).map(([k, v]) => [v, k]));
    document.getElementById('morse-output').value = input.split(' ').map(c => reverse[c] || c).join('');
    showToast('转换成功');
}

function caesarEncrypt() {
    const input = document.getElementById('caesar-input').value;
    const shift = parseInt(document.getElementById('caesar-shift').value) || 3;
    if (!input) { showToast('请输入文本', true); return; }
    document.getElementById('caesar-output').value = input.replace(/[a-zA-Z]/g, c => String.fromCharCode(((c.charCodeAt(0) - (c < 'a' ? 65 : 97) + shift) % 26) + (c < 'a' ? 65 : 97)));
    showToast('加密成功');
}

function caesarDecrypt() {
    const input = document.getElementById('caesar-input').value;
    const shift = parseInt(document.getElementById('caesar-shift').value) || 3;
    if (!input) { showToast('请输入密文', true); return; }
    document.getElementById('caesar-output').value = input.replace(/[a-zA-Z]/g, c => String.fromCharCode(((c.charCodeAt(0) - (c < 'a' ? 65 : 97) - shift + 26) % 26) + (c < 'a' ? 65 : 97)));
    showToast('解密成功');
}

function caesarBruteforce() {
    const input = document.getElementById('caesar-input').value;
    if (!input) { showToast('请输入密文', true); return; }
    let result = '';
    for (let s = 1; s < 26; s++) {
        result += `位移 ${s}: ${input.replace(/[a-zA-Z]/g, c => String.fromCharCode(((c.charCodeAt(0) - (c < 'a' ? 65 : 97) - s + 26) % 26) + (c < 'a' ? 65 : 97)))}\n`;
    }
    document.getElementById('caesar-output').value = result;
    showToast('暴力破解完成');
}

// ========================================
// Number Tools
// ========================================
function convertRadix() {
    const input = document.getElementById('radix-input').value;
    const from = parseInt(document.getElementById('radix-from').value);
    const to = parseInt(document.getElementById('radix-to').value);
    if (!input) { showToast('请输入数字', true); return; }
    try {
        document.getElementById('radix-output').value = parseInt(input, from).toString(to).toUpperCase();
        showToast('转换成功');
    } catch (e) { showToast('转换失败', true); }
}

function convertRadixAll() {
    const input = document.getElementById('radix-input').value;
    const from = parseInt(document.getElementById('radix-from').value);
    if (!input) { showToast('请输入数字', true); return; }
    try {
        const num = parseInt(input, from);
        document.getElementById('radix-output').value = `二进制: ${num.toString(2)}\n八进制: ${num.toString(8)}\n十进制: ${num.toString(10)}\n十六进制: ${num.toString(16).toUpperCase()}`;
        showToast('转换成功');
    } catch (e) { showToast('转换失败', true); }
}

function floatToIeee754() {
    const input = parseFloat(document.getElementById('ieee754-input').value);
    const precision = document.getElementById('ieee754-precision').value;
    if (isNaN(input)) { showToast('请输入数字', true); return; }
    const buffer = new ArrayBuffer(precision === '32' ? 4 : 8);
    const view = new DataView(buffer);
    precision === '32' ? view.setFloat32(0, input) : view.setFloat64(0, input);
    let binary = '', hex = '';
    for (let i = 0; i < buffer.byteLength; i++) {
        binary += view.getUint8(i).toString(2).padStart(8, '0') + ' ';
        hex += view.getUint8(i).toString(16).padStart(2, '0').toUpperCase();
    }
    document.getElementById('ieee754-binary').value = binary.trim();
    document.getElementById('ieee754-hex').value = '0x' + hex;
    showToast('转换成功');
}

function calculate() {
    try {
        const input = document.getElementById('calc-input').value;
        if (!input) { showToast('请输入表达式', true); return; }
        // Safe eval using Function
        const result = Function('"use strict"; return (' + input + ')')();
        document.getElementById('calc-output').value = result;
        showToast('计算成功');
    } catch (e) { showToast('计算失败: ' + e.message, true); }
}

function updateChmod() {
    let owner = 0, group = 0, other = 0, symbolic = '';
    if (document.getElementById('chmod-owner-r')?.checked) { owner += 4; symbolic += 'r'; } else symbolic += '-';
    if (document.getElementById('chmod-owner-w')?.checked) { owner += 2; symbolic += 'w'; } else symbolic += '-';
    if (document.getElementById('chmod-owner-x')?.checked) { owner += 1; symbolic += 'x'; } else symbolic += '-';
    if (document.getElementById('chmod-group-r')?.checked) { group += 4; symbolic += 'r'; } else symbolic += '-';
    if (document.getElementById('chmod-group-w')?.checked) { group += 2; symbolic += 'w'; } else symbolic += '-';
    if (document.getElementById('chmod-group-x')?.checked) { group += 1; symbolic += 'x'; } else symbolic += '-';
    if (document.getElementById('chmod-other-r')?.checked) { other += 4; symbolic += 'r'; } else symbolic += '-';
    if (document.getElementById('chmod-other-w')?.checked) { other += 2; symbolic += 'w'; } else symbolic += '-';
    if (document.getElementById('chmod-other-x')?.checked) { other += 1; symbolic += 'x'; } else symbolic += '-';
    document.getElementById('chmod-numeric').value = '' + owner + group + other;
    document.getElementById('chmod-symbolic').value = symbolic;
}

// ========================================
// Text Tools - Monaco Diff Editor
// ========================================
function toggleDiffViewMode() {
    const inline = document.getElementById('diff-inline').checked;
    if (window.monacoManager) {
        window.monacoManager.updateDiffOptions({ renderSideBySide: !inline });
    }
}

function updateDiffEditor() {
    const ignoreWhitespace = document.getElementById('diff-ignore-whitespace').checked;
    if (window.monacoManager) {
        window.monacoManager.updateDiffOptions({ ignoreTrimWhitespace: ignoreWhitespace });
    }
}

function updateDiffLanguage() {
    const language = document.getElementById('diff-language').value;
    if (window.monacoManager) {
        window.monacoManager.setDiffLanguage(language);
    }
}

function computeDiffStats() {
    if (!window.monacoManager) return;
    const stats = window.monacoManager.getDiffStats();
    if (stats) {
        const statsEl = document.getElementById('diff-stats');
        statsEl.innerHTML = `
            <span class="diff-stat diff-stat-add">+${stats.additions} 添加</span>
            <span class="diff-stat diff-stat-del">-${stats.deletions} 删除</span>
            <span class="diff-stat diff-stat-change">${stats.changes} 处变更</span>
        `;
        showToast(`共 ${stats.changes} 处差异`);
    }
}

function swapDiffEditors() {
    if (!window.monacoManager) return;
    const values = window.monacoManager.getDiffValues();
    window.monacoManager.setDiffValues(values.modified, values.original);
    showToast('已交换文本');
}

function clearDiffEditors() {
    if (window.monacoManager) {
        window.monacoManager.setDiffValues('', '');
    }
    const statsEl = document.getElementById('diff-stats');
    if (statsEl) statsEl.innerHTML = '';
    showToast('已清空');
}

function loadDiffSample() {
    const sampleOriginal = `function hello(name) {
    console.log("Hello, " + name);
    return true;
}

// 旧版本代码
const config = {
    debug: true,
    version: "1.0.0"
};`;

    const sampleModified = `function hello(name) {
    console.log(\`Hello, \${name}!\`);
    return name ? true : false;
}

// 新版本代码
const config = {
    debug: false,
    version: "2.0.0",
    features: ["dark-mode", "i18n"]
};`;

    if (window.monacoManager) {
        window.monacoManager.setDiffValues(sampleOriginal, sampleModified);
        document.getElementById('diff-language').value = 'javascript';
        updateDiffLanguage();
    }
    showToast('已加载示例');
}

// Legacy compareText for backward compatibility
function compareText() {
    computeDiffStats();
}


function textRemoveDuplicate() {
    const input = document.getElementById('textproc-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    document.getElementById('textproc-output').value = [...new Set(input.split('\n'))].join('\n');
    showToast('去重完成');
}

function textSort() {
    const input = document.getElementById('textproc-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    document.getElementById('textproc-output').value = input.split('\n').sort().join('\n');
    showToast('排序完成');
}

function textRemoveEmpty() {
    const input = document.getElementById('textproc-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    document.getElementById('textproc-output').value = input.split('\n').filter(l => l.trim()).join('\n');
    showToast('去空行完成');
}

function textReverse() {
    const input = document.getElementById('textproc-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    document.getElementById('textproc-output').value = input.split('\n').reverse().join('\n');
    showToast('逆序完成');
}

function textTrim() {
    const input = document.getElementById('textproc-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    document.getElementById('textproc-output').value = input.split('\n').map(l => l.trim()).join('\n');
    showToast('处理完成');
}

function escapeText() {
    const input = document.getElementById('text-escape-input').value;
    const type = document.getElementById('escape-type').value;
    if (!input) { showToast('请输入文本', true); return; }
    let result = input;
    if (type === 'html') result = input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    else if (type === 'js') result = JSON.stringify(input);
    else if (type === 'sql') result = input.replace(/'/g, "''");
    document.getElementById('text-escape-output').value = result;
    showToast('转义成功');
}

function unescapeText() {
    const input = document.getElementById('text-escape-input').value;
    const type = document.getElementById('escape-type').value;
    if (!input) { showToast('请输入文本', true); return; }
    let result = input;
    if (type === 'html') result = input.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    else if (type === 'js') try { result = JSON.parse(input); } catch (e) { }
    document.getElementById('text-escape-output').value = result;
    showToast('反转义成功');
}

function countWords() {
    const input = document.getElementById('wordcount-input').value;
    document.getElementById('stat-chars').textContent = input.length;
    document.getElementById('stat-chars-no-space').textContent = input.replace(/\s/g, '').length;
    document.getElementById('stat-words').textContent = input.trim() ? input.trim().split(/\s+/).length : 0;
    document.getElementById('stat-lines').textContent = input ? input.split('\n').length : 0;
    document.getElementById('stat-chinese').textContent = (input.match(/[\u4e00-\u9fa5]/g) || []).length;
    document.getElementById('stat-bytes').textContent = new TextEncoder().encode(input).length;
}

function testRegex() {
    try {
        const pattern = document.getElementById('regex-pattern').value;
        const input = document.getElementById('regex-input').value;
        if (!pattern || !input) { showToast('请输入正则和文本', true); return; }
        let flags = '';
        if (document.getElementById('regex-g').checked) flags += 'g';
        if (document.getElementById('regex-i').checked) flags += 'i';
        if (document.getElementById('regex-m').checked) flags += 'm';
        const regex = new RegExp(pattern, flags);
        const matches = input.match(regex);
        document.getElementById('regex-output').value = matches ? `找到 ${matches.length} 个匹配:\n${matches.join('\n')}` : '没有匹配';
        showToast('测试完成');
    } catch (e) { showToast('正则错误: ' + e.message, true); }
}

function regexReplace() {
    try {
        const pattern = document.getElementById('regex-pattern').value;
        const input = document.getElementById('regex-input').value;
        const replaceWith = document.getElementById('regex-replace').value;
        if (!pattern || !input) { showToast('请输入正则和文本', true); return; }
        let flags = '';
        if (document.getElementById('regex-g').checked) flags += 'g';
        if (document.getElementById('regex-i').checked) flags += 'i';
        if (document.getElementById('regex-m').checked) flags += 'm';
        document.getElementById('regex-output').value = input.replace(new RegExp(pattern, flags), replaceWith);
        showToast('替换完成');
    } catch (e) { showToast('正则错误: ' + e.message, true); }
}

function toUpperCase() {
    const input = document.getElementById('case-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    document.getElementById('case-output').value = input.toUpperCase();
    showToast('转换成功');
}

function toLowerCase() {
    const input = document.getElementById('case-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    document.getElementById('case-output').value = input.toLowerCase();
    showToast('转换成功');
}

function toTitleCase() {
    const input = document.getElementById('case-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    document.getElementById('case-output').value = input.replace(/\b\w/g, c => c.toUpperCase());
    showToast('转换成功');
}

function toCamelCase() {
    const input = document.getElementById('case-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    document.getElementById('case-output').value = input.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    showToast('转换成功');
}

function toSnakeCase() {
    const input = document.getElementById('case-input').value;
    if (!input) { showToast('请输入文本', true); return; }
    document.getElementById('case-output').value = input.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toLowerCase();
    showToast('转换成功');
}

// ========================================
// Date Tools
// ========================================
function refreshTimestamp() {
    const el = document.getElementById('current-timestamp');
    if (el) el.textContent = Date.now();
}

function timestampToDate() {
    const input = document.getElementById('timestamp-input').value;
    if (!input) { showToast('请输入时间戳', true); return; }
    let ts = parseInt(input);
    if (input.length === 10) ts *= 1000;
    const date = new Date(ts);
    document.getElementById('timestamp-output').value = `日期时间: ${date.toLocaleString('zh-CN')}\nISO格式: ${date.toISOString()}\nUTC: ${date.toUTCString()}\n时间戳(秒): ${Math.floor(ts / 1000)}\n时间戳(毫秒): ${ts}`;
    showToast('转换成功');
}

function dateToTimestamp() {
    const input = document.getElementById('datetime-input').value;
    if (!input) { showToast('请选择日期', true); return; }
    const date = new Date(input);
    document.getElementById('timestamp-output').value = `时间戳(秒): ${Math.floor(date.getTime() / 1000)}\n时间戳(毫秒): ${date.getTime()}\n日期时间: ${date.toLocaleString('zh-CN')}`;
    showToast('转换成功');
}

function parseCron() {
    const input = document.getElementById('cron-input').value;
    if (!input) { showToast('请输入Cron表达式', true); return; }
    const parts = input.trim().split(/\s+/);
    if (parts.length < 5) { showToast('Cron表达式格式错误', true); return; }
    const [minute, hour, day, month, weekday] = parts;
    const desc = [];
    desc.push(`分钟: ${minute === '*' ? '每分钟' : minute}`);
    desc.push(`小时: ${hour === '*' ? '每小时' : hour + '点'}`);
    desc.push(`日期: ${day === '*' ? '每天' : day + '号'}`);
    desc.push(`月份: ${month === '*' ? '每月' : month + '月'}`);
    desc.push(`星期: ${weekday === '*' ? '每天' : '星期' + weekday}`);
    document.getElementById('cron-output').value = desc.join('\n');
    showToast('解析完成');
}

function setCron(expr) {
    document.getElementById('cron-input').value = expr;
    parseCron();
}

function calcDateDiff() {
    const start = document.getElementById('date-start').value;
    const end = document.getElementById('date-end').value;
    if (!start || !end) { showToast('请选择日期', true); return; }
    const diff = Math.abs(new Date(end) - new Date(start));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    document.getElementById('date-output').value = `相差: ${days} 天\n相差: ${Math.floor(days / 7)} 周 ${days % 7} 天\n相差: ${(diff / (1000 * 60 * 60)).toFixed(1)} 小时`;
    showToast('计算完成');
}

function calcDateAdd() {
    const base = document.getElementById('date-base').value;
    const offset = parseInt(document.getElementById('date-offset').value) || 0;
    if (!base) { showToast('请选择日期', true); return; }
    const date = new Date(base);
    date.setDate(date.getDate() + offset);
    document.getElementById('date-output').value = `结果: ${date.toISOString().split('T')[0]}\n${date.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
    showToast('计算完成');
}

// ========================================
// Random Tools
// ========================================
function generateRandom() {
    const min = parseInt(document.getElementById('random-min').value) || 0;
    const max = parseInt(document.getElementById('random-max').value) || 100;
    const count = parseInt(document.getElementById('random-count').value) || 10;
    const unique = document.getElementById('random-unique').checked;
    const sort = document.getElementById('random-sort').checked;
    let nums = [];
    if (unique && count > max - min + 1) { showToast('范围太小无法生成不重复数字', true); return; }
    while (nums.length < count) {
        const n = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!unique || !nums.includes(n)) nums.push(n);
    }
    if (sort) nums.sort((a, b) => a - b);
    document.getElementById('random-output').value = nums.join('\n');
    showToast('生成成功');
}

function generatePassword() {
    const len = parseInt(document.getElementById('pwd-length').value) || 16;
    const count = parseInt(document.getElementById('pwd-count').value) || 5;
    let chars = '';
    if (document.getElementById('pwd-upper').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (document.getElementById('pwd-lower').checked) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (document.getElementById('pwd-number').checked) chars += '0123456789';
    if (document.getElementById('pwd-symbol').checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { showToast('请选择至少一种字符类型', true); return; }
    const passwords = [];
    for (let i = 0; i < count; i++) {
        let pwd = '';
        for (let j = 0; j < len; j++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
        passwords.push(pwd);
    }
    document.getElementById('pwd-output').value = passwords.join('\n');
    showToast('生成成功');
}

function generateUuid() {
    const count = parseInt(document.getElementById('uuid-count').value) || 5;
    const format = document.getElementById('uuid-format').value;
    const uuids = [];
    for (let i = 0; i < count; i++) {
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        if (format === 'nodash') uuid = uuid.replace(/-/g, '');
        if (format === 'upper' || format === 'upper-nodash') uuid = uuid.toUpperCase();
        if (format === 'upper-nodash') uuid = uuid.replace(/-/g, '');
        uuids.push(uuid);
    }
    document.getElementById('uuid-output').value = uuids.join('\n');
    showToast(`已生成${count}个UUID`);
}

// ========================================
// Color Tools
// ========================================
function updateColorFromPicker() {
    const hex = document.getElementById('color-picker').value;
    document.getElementById('color-hex').value = hex;
    updateColorDisplay(hex);
}

function updateColorFromHex() {
    let hex = document.getElementById('color-hex').value;
    if (!hex.startsWith('#')) hex = '#' + hex;
    document.getElementById('color-picker').value = hex;
    updateColorDisplay(hex);
}

function updateColorFromRgb() {
    const r = parseInt(document.getElementById('color-r').value) || 0;
    const g = parseInt(document.getElementById('color-g').value) || 0;
    const b = parseInt(document.getElementById('color-b').value) || 0;
    const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    document.getElementById('color-hex').value = hex;
    document.getElementById('color-picker').value = hex;
    updateColorDisplay(hex);
}

function updateColorDisplay(hex) {
    const preview = document.getElementById('color-preview');
    if (preview) preview.style.background = hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    document.getElementById('color-r').value = r;
    document.getElementById('color-g').value = g;
    document.getElementById('color-b').value = b;
    document.getElementById('color-rgb-output').value = `rgb(${r}, ${g}, ${b})`;
    // HSL calculation
    const rN = r / 255, gN = g / 255, bN = b / 255;
    const max = Math.max(rN, gN, bN), min = Math.min(rN, gN, bN);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rN: h = ((gN - bN) / d + (gN < bN ? 6 : 0)) / 6; break;
            case gN: h = ((bN - rN) / d + 2) / 6; break;
            case bN: h = ((rN - gN) / d + 4) / 6; break;
        }
    }
    document.getElementById('color-hsl-output').value = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

// ========================================
// Image Tools
// ========================================
function imageToBase64() {
    const file = document.getElementById('img-file-input').files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('img-base64-output').value = e.target.result;
        document.getElementById('img-preview').innerHTML = `<img src="${e.target.result}" style="max-width:100%;max-height:200px;">`;
        showToast('转换成功');
    };
    reader.readAsDataURL(file);
}

function base64ToImage() {
    let input = document.getElementById('img-base64-input').value.trim();
    if (!input) { showToast('请输入Base64', true); return; }
    if (!input.startsWith('data:')) input = 'data:image/png;base64,' + input;
    document.getElementById('img-preview').innerHTML = `<img src="${input}" style="max-width:100%;max-height:200px;">`;
    showToast('转换成功');
}

function generateQrcode() {
    const input = document.getElementById('qrcode-input').value;
    const size = parseInt(document.getElementById('qrcode-size').value) || 6;
    if (!input) { showToast('请输入内容', true); return; }
    try {
        const qr = qrcode(0, 'M');
        qr.addData(input);
        qr.make();
        document.getElementById('qrcode-output').innerHTML = qr.createSvgTag(size);
        showToast('生成成功');
    } catch (e) { showToast('生成失败: ' + e.message, true); }
}
