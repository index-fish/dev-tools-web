// ========================================
// DevToolbox - Tool Templates
// ========================================

const toolTemplates = {
    // ========================================
    // JSON Tools
    // ========================================
    'json-format': `
        <div class="tool-card">
            <div class="card-header">
                <h2>JSON 格式化</h2>
                <p class="card-description">JSON 格式化、压缩、校验工具 - 支持语法高亮</p>
            </div>
            <div class="card-body">
                <div class="top-toolbar">
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="formatJson()">✨ 格式化</button>
                        <button class="btn btn-secondary" onclick="compressJson()">📦 压缩</button>
                        <button class="btn btn-outline" onclick="validateJson()">✅ 校验</button>
                        <button class="btn btn-outline" onclick="clearMonacoTool('json')">🗑️ 清空</button>
                    </div>
                    <div class="toolbar-separator"></div>
                    <div class="form-group-inline">
                        <label>缩进</label>
                        <select id="json-indent" class="input-select-small">
                            <option value="2" selected>2 空格</option>
                            <option value="4">4 空格</option>
                            <option value="tab">Tab</option>
                        </select>
                    </div>
                </div>

                <div class="split-view">
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>输入 JSON</label>
                            <span class="language-badge">JSON</span>
                        </div>
                        <div id="json-input" class="monaco-container"></div>
                    </div>
                    <div class="resizer" id="json-resizer"></div>
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>输出结果</label>
                            <span class="language-badge">JSON</span>
                        </div>
                        <div class="editor-wrapper">
                            <div id="json-output" class="monaco-container output"></div>
                            <button class="copy-btn" onclick="copyFromMonaco('json-output')">📋 复制</button>
                        </div>
                    </div>
                </div>
                <div class="resizer-v"></div>
            </div>
        </div>
    `,

    'json-escape': `
        <div class="tool-card">
            <div class="card-header">
                <h2>JSON 转义</h2>
                <p class="card-description">JSON 字符串转义与反转义 - 支持语法高亮</p>
            </div>
            <div class="card-body">
                <div class="top-toolbar">
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="jsonEscape()">🔒 转义</button>
                        <button class="btn btn-secondary" onclick="jsonUnescape()">🔓 反转义</button>
                    </div>
                </div>

                <div class="split-view">
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>输入文本</label>
                            <span class="language-badge">JSON</span>
                        </div>
                        <div id="json-escape-input" class="monaco-container"></div>
                    </div>
                    <div class="resizer"></div>
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>输出结果</label>
                            <span class="language-badge">JSON</span>
                        </div>
                        <div class="editor-wrapper">
                            <div id="json-escape-output" class="monaco-container output"></div>
                            <button class="copy-btn" onclick="copyFromMonaco('json-escape-output')">📋 复制</button>
                        </div>
                    </div>
                </div>
                <div class="resizer-v"></div>
            </div>
        </div>
    `,

    'json-to-class': `
        <div class="tool-card">
            <div class="card-header">
                <h2>JSON 生成实体类</h2>
                <p class="card-description">根据 JSON 自动生成各种语言的实体类 - 支持语法高亮</p>
            </div>
            <div class="card-body">
                <div class="top-toolbar">
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="jsonToClass()">🔄 生成</button>
                    </div>
                    <div class="toolbar-separator"></div>
                    <div class="form-group-inline">
                        <label>目标语言</label>
                        <select id="json-class-lang" class="input-select-small" onchange="updateOutputLanguage()">
                            <option value="typescript">TypeScript</option>
                            <option value="java">Java</option>
                            <option value="csharp">C#</option>
                            <option value="python">Python</option>
                            <option value="go">Go</option>
                        </select>
                    </div>
                    <div class="form-group-inline">
                        <label>类名</label>
                        <input type="text" id="json-class-name" class="input-field" style="width: 120px; padding: 0.35rem 0.6rem; font-size: 0.75rem;" value="MyClass">
                    </div>
                </div>

                <div class="split-view">
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>输入 JSON</label>
                            <span class="language-badge">JSON</span>
                        </div>
                        <div id="json-class-input" class="monaco-container"></div>
                    </div>
                    <div class="resizer"></div>
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>生成结果</label>
                            <span id="json-class-lang-badge" class="language-badge">TypeScript</span>
                        </div>
                        <div class="editor-wrapper">
                            <div id="json-class-output" class="monaco-container output"></div>
                            <button class="copy-btn" onclick="copyFromMonaco('json-class-output')">📋 复制</button>
                        </div>
                    </div>
                </div>
                <div class="resizer-v"></div>
            </div>
        </div>
    `,

    // ========================================
    // Code Formatters
    // ========================================
    'html-format': `
        <div class="tool-card">
            <div class="card-header">
                <h2>HTML 格式化</h2>
                <p class="card-description">HTML 代码格式化与压缩 - 支持语法高亮</p>
            </div>
            <div class="card-body">
                <div class="top-toolbar">
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="formatHtml()">✨ 格式化</button>
                        <button class="btn btn-secondary" onclick="compressHtml()">📦 压缩</button>
                    </div>
                </div>

                <div class="split-view">
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>输入 HTML</label>
                            <span class="language-badge">HTML</span>
                        </div>
                        <div id="html-input" class="monaco-container"></div>
                    </div>
                    <div class="resizer"></div>
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>输出结果</label>
                            <span class="language-badge">HTML</span>
                        </div>
                        <div class="editor-wrapper">
                            <div id="html-output" class="monaco-container output"></div>
                            <button class="copy-btn" onclick="copyFromMonaco('html-output')">📋 复制</button>
                        </div>
                    </div>
                </div>
                <div class="resizer-v"></div>
            </div>
        </div>
    `,

    'js-format': `
        <div class="tool-card">
            <div class="card-header">
                <h2>JavaScript 格式化</h2>
                <p class="card-description">JavaScript 代码格式化与压缩 - 支持语法高亮</p>
            </div>
            <div class="card-body">
                <div class="top-toolbar">
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="formatJs()">✨ 格式化</button>
                        <button class="btn btn-secondary" onclick="compressJs()">📦 压缩</button>
                    </div>
                </div>

                <div class="split-view">
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>输入 JavaScript</label>
                            <span class="language-badge">JavaScript</span>
                        </div>
                        <div id="js-input" class="monaco-container"></div>
                    </div>
                    <div class="resizer"></div>
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>输出结果</label>
                            <span class="language-badge">JavaScript</span>
                        </div>
                        <div class="editor-wrapper">
                            <div id="js-output" class="monaco-container output"></div>
                            <button class="copy-btn" onclick="copyFromMonaco('js-output')">📋 复制</button>
                        </div>
                    </div>
                </div>
                <div class="resizer-v"></div>
            </div>
        </div>
    `,

    'css-format': `
        <div class="tool-card">
            <div class="card-header">
                <h2>CSS 格式化</h2>
                <p class="card-description">CSS 代码格式化与压缩 - 支持语法高亮</p>
            </div>
            <div class="card-body">
                <div class="top-toolbar">
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="formatCss()">✨ 格式化</button>
                        <button class="btn btn-secondary" onclick="compressCss()">📦 压缩</button>
                    </div>
                </div>

                <div class="split-view">
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>输入 CSS</label>
                            <span class="language-badge">CSS</span>
                        </div>
                        <div id="css-input" class="monaco-container"></div>
                    </div>
                    <div class="resizer"></div>
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>输出结果</label>
                            <span class="language-badge">CSS</span>
                        </div>
                        <div class="editor-wrapper">
                            <div id="css-output" class="monaco-container output"></div>
                            <button class="copy-btn" onclick="copyFromMonaco('css-output')">📋 复制</button>
                        </div>
                    </div>
                </div>
                <div class="resizer-v"></div>
            </div>
        </div>
    `,

    'xml-format': `
        <div class="tool-card">
            <div class="card-header">
                <h2>XML 格式化</h2>
                <p class="card-description">XML 代码格式化与压缩 - 支持语法高亮</p>
            </div>
            <div class="card-body">
                <div class="top-toolbar">
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="formatXml()">✨ 格式化</button>
                        <button class="btn btn-secondary" onclick="compressXml()">📦 压缩</button>
                    </div>
                </div>

                <div class="split-view">
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>输入 XML</label>
                            <span class="language-badge">XML</span>
                        </div>
                        <div id="xml-input" class="monaco-container"></div>
                    </div>
                    <div class="resizer"></div>
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>输出结果</label>
                            <span class="language-badge">XML</span>
                        </div>
                        <div class="editor-wrapper">
                            <div id="xml-output" class="monaco-container output"></div>
                            <button class="copy-btn" onclick="copyFromMonaco('xml-output')">📋 复制</button>
                        </div>
                    </div>
                </div>
                <div class="resizer-v"></div>
            </div>
        </div>
    `,

    'sql-format': `
        <div class="tool-card">
            <div class="card-header">
                <h2>SQL 格式化</h2>
                <p class="card-description">SQL 语句格式化 - 支持语法高亮</p>
            </div>
            <div class="card-body">
                <div class="top-toolbar">
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="formatSql()">✨ 格式化</button>
                        <button class="btn btn-secondary" onclick="compressSql()">📦 压缩</button>
                    </div>
                    <div class="toolbar-separator"></div>
                    <div class="form-group-inline">
                        <label>数据库类型</label>
                        <select id="sql-dialect" class="input-select-small">
                            <option value="sql">标准 SQL</option>
                            <option value="mysql">MySQL</option>
                            <option value="postgresql">PostgreSQL</option>
                            <option value="sqlite">SQLite</option>
                        </select>
                    </div>
                </div>

                <div class="split-view">
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>输入 SQL</label>
                            <span class="language-badge">SQL</span>
                        </div>
                        <div id="sql-input" class="monaco-container"></div>
                    </div>
                    <div class="resizer"></div>
                    <div class="split-pane">
                        <div class="editor-label">
                            <label>输出结果</label>
                            <span class="language-badge">SQL</span>
                        </div>
                        <div class="editor-wrapper">
                            <div id="sql-output" class="monaco-container output"></div>
                            <button class="copy-btn" onclick="copyFromMonaco('sql-output')">📋 复制</button>
                        </div>
                    </div>
                </div>
                <div class="resizer-v"></div>
            </div>
        </div>
    `,

    // ========================================
    // Encoding/Decoding
    // ========================================
    'base64': `
        <div class="tool-card">
            <div class="card-header">
                <h2>Base64 编码/解码</h2>
                <p class="card-description">Base64 编码与解码，支持中文</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="base64-input" class="input-textarea" placeholder="请输入要编码或解码的文本"></textarea>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="base64Encode()">📤 编码</button>
                    <button class="btn btn-secondary" onclick="base64Decode()">📥 解码</button>
                    <button class="btn btn-outline" onclick="clearTool('base64')">🗑️ 清空</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="base64-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('base64-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'base-multi': `
        <div class="tool-card">
            <div class="card-header">
                <h2>Base16/32/58/62/85 编码</h2>
                <p class="card-description">多种 Base 编码转换</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="base-multi-input" class="input-textarea" placeholder="请输入文本"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>编码类型</label>
                        <select id="base-type" class="input-select">
                            <option value="16">Base16 (Hex)</option>
                            <option value="32">Base32</option>
                            <option value="58">Base58</option>
                            <option value="62">Base62</option>
                        </select>
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="baseMultiEncode()">📤 编码</button>
                    <button class="btn btn-secondary" onclick="baseMultiDecode()">📥 解码</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="base-multi-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('base-multi-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'url': `
        <div class="tool-card">
            <div class="card-header">
                <h2>URL 编码/解码</h2>
                <p class="card-description">URL 编码与解码</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="url-input" class="input-textarea" placeholder="请输入URL或文本"></textarea>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="urlEncode()">📤 编码</button>
                    <button class="btn btn-secondary" onclick="urlDecode()">📥 解码</button>
                    <button class="btn btn-outline" onclick="urlEncodeComponent()">🔧 组件编码</button>
                    <button class="btn btn-outline" onclick="urlDecodeComponent()">🔧 组件解码</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="url-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('url-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'unicode': `
        <div class="tool-card">
            <div class="card-header">
                <h2>Unicode 编码/解码</h2>
                <p class="card-description">Unicode 与中文互转</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="unicode-input" class="input-textarea" placeholder="输入中文或 \\u4e2d\\u6587"></textarea>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="toUnicode()">📤 转Unicode</button>
                    <button class="btn btn-secondary" onclick="fromUnicode()">📥 转中文</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="unicode-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('unicode-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'hex': `
        <div class="tool-card">
            <div class="card-header">
                <h2>Hex 编码/解码</h2>
                <p class="card-description">十六进制编码转换</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="hex-input" class="input-textarea" placeholder="请输入文本或十六进制"></textarea>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="hexEncode()">📤 文本转Hex</button>
                    <button class="btn btn-secondary" onclick="hexDecode()">📥 Hex转文本</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="hex-output" class="input-textarea output mono" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('hex-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'gzip': `
        <div class="tool-card">
            <div class="card-header">
                <h2>Gzip 压缩/解压</h2>
                <p class="card-description">Gzip 和 Deflate 压缩解压</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="gzip-input" class="input-textarea" placeholder="请输入文本或Base64编码的压缩数据"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>压缩算法</label>
                        <select id="gzip-algo" class="input-select">
                            <option value="gzip">Gzip</option>
                            <option value="deflate">Deflate</option>
                        </select>
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="gzipCompress()">📦 压缩</button>
                    <button class="btn btn-secondary" onclick="gzipDecompress()">📂 解压</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="gzip-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('gzip-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'jwt': `
        <div class="tool-card">
            <div class="card-header">
                <h2>JWT 解析器</h2>
                <p class="card-description">解析 JWT Token</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入 JWT Token</label>
                    <textarea id="jwt-input" class="input-textarea code" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."></textarea>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="parseJwt()">🔍 解析</button>
                </div>
                <div class="jwt-results">
                    <div class="form-group">
                        <label>Header</label>
                        <textarea id="jwt-header" class="input-textarea output code small" readonly></textarea>
                    </div>
                    <div class="form-group">
                        <label>Payload</label>
                        <textarea id="jwt-payload" class="input-textarea output code" readonly></textarea>
                    </div>
                    <div class="form-group">
                        <label>Signature</label>
                        <input type="text" id="jwt-signature" class="input-field mono" readonly>
                    </div>
                </div>
            </div>
        </div>
    `,

    // ========================================
    // Hash Algorithms
    // ========================================
    'hash': `
        <div class="tool-card">
            <div class="card-header">
                <h2>MD5/SHA 加密</h2>
                <p class="card-description">计算文本的哈希值</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="hash-input" class="input-textarea" placeholder="请输入要计算哈希的文本"></textarea>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="calculateHash()">🔐 计算哈希</button>
                    <button class="btn btn-outline" onclick="clearTool('hash')">🗑️ 清空</button>
                </div>
                <div class="hash-results">
                    <div class="hash-item">
                        <label>MD5 (32位)</label>
                        <div class="hash-value-container">
                            <input type="text" id="hash-md5" class="input-field mono" readonly>
                            <button class="copy-btn-small" onclick="copyToClipboard('hash-md5')">📋</button>
                        </div>
                    </div>
                    <div class="hash-item">
                        <label>MD5 (16位)</label>
                        <div class="hash-value-container">
                            <input type="text" id="hash-md5-16" class="input-field mono" readonly>
                            <button class="copy-btn-small" onclick="copyToClipboard('hash-md5-16')">📋</button>
                        </div>
                    </div>
                    <div class="hash-item">
                        <label>SHA1</label>
                        <div class="hash-value-container">
                            <input type="text" id="hash-sha1" class="input-field mono" readonly>
                            <button class="copy-btn-small" onclick="copyToClipboard('hash-sha1')">📋</button>
                        </div>
                    </div>
                    <div class="hash-item">
                        <label>SHA256</label>
                        <div class="hash-value-container">
                            <input type="text" id="hash-sha256" class="input-field mono" readonly>
                            <button class="copy-btn-small" onclick="copyToClipboard('hash-sha256')">📋</button>
                        </div>
                    </div>
                    <div class="hash-item">
                        <label>SHA512</label>
                        <div class="hash-value-container">
                            <input type="text" id="hash-sha512" class="input-field mono" readonly>
                            <button class="copy-btn-small" onclick="copyToClipboard('hash-sha512')">📋</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    'hmac': `
        <div class="tool-card">
            <div class="card-header">
                <h2>HMAC 加密</h2>
                <p class="card-description">HMAC-MD5 / HMAC-SHA 加密</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="hmac-input" class="input-textarea" placeholder="请输入文本"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>密钥</label>
                        <input type="text" id="hmac-key" class="input-field" placeholder="请输入密钥">
                    </div>
                    <div class="form-group">
                        <label>算法</label>
                        <select id="hmac-algo" class="input-select">
                            <option value="MD5">HMAC-MD5</option>
                            <option value="SHA1">HMAC-SHA1</option>
                            <option value="SHA256">HMAC-SHA256</option>
                            <option value="SHA512">HMAC-SHA512</option>
                        </select>
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="calculateHmac()">🔐 计算</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="hmac-output" class="input-textarea output mono" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('hmac-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'crc': `
        <div class="tool-card">
            <div class="card-header">
                <h2>CRC 校验</h2>
                <p class="card-description">CRC16/CRC32 校验计算</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="crc-input" class="input-textarea" placeholder="请输入文本"></textarea>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="calculateCrc()">🔐 计算CRC</button>
                </div>
                <div class="hash-results">
                    <div class="hash-item">
                        <label>CRC32</label>
                        <div class="hash-value-container">
                            <input type="text" id="crc32-output" class="input-field mono" readonly>
                            <button class="copy-btn-small" onclick="copyToClipboard('crc32-output')">📋</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    'file-hash': `
        <div class="tool-card">
            <div class="card-header">
                <h2>文件 Hash 计算</h2>
                <p class="card-description">计算文件的 MD5、SHA1、SHA256 值</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>选择文件</label>
                    <input type="file" id="file-hash-input" class="input-field" onchange="calculateFileHash()">
                </div>
                <div class="hash-results">
                    <div class="hash-item">
                        <label>MD5</label>
                        <div class="hash-value-container">
                            <input type="text" id="file-md5" class="input-field mono" readonly placeholder="等待选择文件...">
                            <button class="copy-btn-small" onclick="copyToClipboard('file-md5')">📋</button>
                        </div>
                    </div>
                    <div class="hash-item">
                        <label>SHA1</label>
                        <div class="hash-value-container">
                            <input type="text" id="file-sha1" class="input-field mono" readonly placeholder="等待选择文件...">
                            <button class="copy-btn-small" onclick="copyToClipboard('file-sha1')">📋</button>
                        </div>
                    </div>
                    <div class="hash-item">
                        <label>SHA256</label>
                        <div class="hash-value-container">
                            <input type="text" id="file-sha256" class="input-field mono" readonly placeholder="等待选择文件...">
                            <button class="copy-btn-small" onclick="copyToClipboard('file-sha256')">📋</button>
                        </div>
                    </div>
    `,
};

// Add more templates
Object.assign(toolTemplates, {
    // ========================================
    // Symmetric Encryption
    // ========================================
    'aes': `
        <div class="tool-card">
            <div class="card-header">
                <h2>AES 加密/解密</h2>
                <p class="card-description">高级加密标准 (Advanced Encryption Standard)</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="aes-input" class="input-textarea" placeholder="请输入要加密或解密的文本"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>密钥 (Key)</label>
                        <input type="text" id="aes-key" class="input-field" placeholder="16/24/32位密钥">
                    </div>
                    <div class="form-group">
                        <label>向量 (IV)</label>
                        <input type="text" id="aes-iv" class="input-field" placeholder="16位向量">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>模式</label>
                        <select id="aes-mode" class="input-select">
                            <option value="CBC">CBC</option>
                            <option value="ECB">ECB</option>
                            <option value="CFB">CFB</option>
                            <option value="OFB">OFB</option>
                            <option value="CTR">CTR</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>填充</label>
                        <select id="aes-padding" class="input-select">
                            <option value="Pkcs7">PKCS7</option>
                            <option value="ZeroPadding">ZeroPadding</option>
                            <option value="NoPadding">NoPadding</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>输出格式</label>
                        <select id="aes-output-format" class="input-select">
                            <option value="base64">Base64</option>
                            <option value="hex">Hex</option>
                        </select>
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="aesEncrypt()">🔒 加密</button>
                    <button class="btn btn-secondary" onclick="aesDecrypt()">🔓 解密</button>
                    <button class="btn btn-outline" onclick="generateAesKey()">🎲 生成密钥</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="aes-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('aes-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'des': `
        <div class="tool-card">
            <div class="card-header">
                <h2>DES 加密/解密</h2>
                <p class="card-description">数据加密标准 (Data Encryption Standard)</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="des-input" class="input-textarea" placeholder="请输入要加密或解密的文本"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>密钥 (8位)</label>
                        <input type="text" id="des-key" class="input-field" placeholder="8位密钥">
                    </div>
                    <div class="form-group">
                        <label>向量 (8位)</label>
                        <input type="text" id="des-iv" class="input-field" placeholder="8位向量">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>模式</label>
                        <select id="des-mode" class="input-select">
                            <option value="CBC">CBC</option>
                            <option value="ECB">ECB</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>输出格式</label>
                        <select id="des-output-format" class="input-select">
                            <option value="base64">Base64</option>
                            <option value="hex">Hex</option>
                        </select>
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="desEncrypt()">🔒 加密</button>
                    <button class="btn btn-secondary" onclick="desDecrypt()">🔓 解密</button>
                    <button class="btn btn-outline" onclick="generateDesKey()">🎲 生成密钥</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="des-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('des-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'triple-des': `
        <div class="tool-card">
            <div class="card-header">
                <h2>Triple DES 加密/解密</h2>
                <p class="card-description">三重DES加密 (3DES)</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="3des-input" class="input-textarea" placeholder="请输入要加密或解密的文本"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>密钥 (24位)</label>
                        <input type="text" id="3des-key" class="input-field" placeholder="24位密钥">
                    </div>
                    <div class="form-group">
                        <label>向量 (8位)</label>
                        <input type="text" id="3des-iv" class="input-field" placeholder="8位向量">
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="tripleDesEncrypt()">🔒 加密</button>
                    <button class="btn btn-secondary" onclick="tripleDesDecrypt()">🔓 解密</button>
                    <button class="btn btn-outline" onclick="generate3DesKey()">🎲 生成密钥</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="3des-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('3des-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'rc4': `
        <div class="tool-card">
            <div class="card-header">
                <h2>RC4 加密/解密</h2>
                <p class="card-description">RC4 流密码</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="rc4-input" class="input-textarea" placeholder="请输入文本"></textarea>
                </div>
                <div class="form-group">
                    <label>密钥</label>
                    <input type="text" id="rc4-key" class="input-field" placeholder="请输入密钥">
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="rc4Encrypt()">🔒 加密</button>
                    <button class="btn btn-secondary" onclick="rc4Decrypt()">🔓 解密</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="rc4-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('rc4-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'rabbit': `
        <div class="tool-card">
            <div class="card-header">
                <h2>Rabbit 加密/解密</h2>
                <p class="card-description">Rabbit 流密码</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="rabbit-input" class="input-textarea" placeholder="请输入文本"></textarea>
                </div>
                <div class="form-group">
                    <label>密钥</label>
                    <input type="text" id="rabbit-key" class="input-field" placeholder="请输入密钥">
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="rabbitEncrypt()">🔒 加密</button>
                    <button class="btn btn-secondary" onclick="rabbitDecrypt()">🔓 解密</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="rabbit-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('rabbit-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'xor': `
        <div class="tool-card">
            <div class="card-header">
                <h2>XOR 异或加密</h2>
                <p class="card-description">简单异或加密</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="xor-input" class="input-textarea" placeholder="请输入文本"></textarea>
                </div>
                <div class="form-group">
                    <label>密钥</label>
                    <input type="text" id="xor-key" class="input-field" placeholder="请输入密钥">
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="xorEncrypt()">🔄 XOR 加密/解密</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="xor-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('xor-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'rsa': `
        <div class="tool-card">
            <div class="card-header">
                <h2>RSA 加密/解密</h2>
                <p class="card-description">非对称加密算法</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="rsa-input" class="input-textarea" placeholder="请输入文本"></textarea>
                </div>
                <div class="form-group">
                    <label>公钥</label>
                    <textarea id="rsa-public-key" class="input-textarea small code" placeholder="-----BEGIN PUBLIC KEY-----"></textarea>
                </div>
                <div class="form-group">
                    <label>私钥</label>
                    <textarea id="rsa-private-key" class="input-textarea small code" placeholder="-----BEGIN PRIVATE KEY-----"></textarea>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="rsaEncrypt()">🔒 公钥加密</button>
                    <button class="btn btn-secondary" onclick="rsaDecrypt()">🔓 私钥解密</button>
                    <button class="btn btn-outline" onclick="generateRsaKeyPair()">🎲 生成密钥对</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="rsa-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('rsa-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'morse': `
        <div class="tool-card">
            <div class="card-header">
                <h2>摩斯密码</h2>
                <p class="card-description">摩斯电码转换</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="morse-input" class="input-textarea" placeholder="输入文本或摩斯密码 (用空格分隔)"></textarea>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="textToMorse()">📤 文本转摩斯</button>
                    <button class="btn btn-secondary" onclick="morseToText()">📥 摩斯转文本</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="morse-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('morse-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'caesar': `
        <div class="tool-card">
            <div class="card-header">
                <h2>凯撒密码</h2>
                <p class="card-description">凯撒位移密码</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="caesar-input" class="input-textarea" placeholder="请输入英文文本"></textarea>
                </div>
                <div class="form-group">
                    <label>位移量 (1-25)</label>
                    <input type="number" id="caesar-shift" class="input-field" value="3" min="1" max="25">
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="caesarEncrypt()">🔒 加密</button>
                    <button class="btn btn-secondary" onclick="caesarDecrypt()">🔓 解密</button>
                    <button class="btn btn-outline" onclick="caesarBruteforce()">🔍 暴力破解</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="caesar-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('caesar-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    // ========================================
    // Number Tools
    // ========================================
    'radix': `
        <div class="tool-card">
            <div class="card-header">
                <h2>进制转换</h2>
                <p class="card-description">2/8/10/16进制互转</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入数字</label>
                    <input type="text" id="radix-input" class="input-field" placeholder="请输入数字">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>源进制</label>
                        <select id="radix-from" class="input-select">
                            <option value="2">二进制</option>
                            <option value="8">八进制</option>
                            <option value="10" selected>十进制</option>
                            <option value="16">十六进制</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>目标进制</label>
                        <select id="radix-to" class="input-select">
                            <option value="2">二进制</option>
                            <option value="8">八进制</option>
                            <option value="10">十进制</option>
                            <option value="16" selected>十六进制</option>
                        </select>
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="convertRadix()">🔄 转换</button>
                    <button class="btn btn-outline" onclick="convertRadixAll()">📊 转换全部</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="radix-output" class="input-textarea output mono" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('radix-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'ieee754': `
        <div class="tool-card">
            <div class="card-header">
                <h2>IEEE 754 浮点数</h2>
                <p class="card-description">IEEE 754 浮点数转换</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入浮点数</label>
                    <input type="text" id="ieee754-input" class="input-field" placeholder="如: 3.14">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>精度</label>
                        <select id="ieee754-precision" class="input-select">
                            <option value="32">32位 (单精度)</option>
                            <option value="64">64位 (双精度)</option>
                        </select>
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="floatToIeee754()">🔄 转换</button>
                </div>
                <div class="hash-results">
                    <div class="hash-item">
                        <label>二进制表示</label>
                        <div class="hash-value-container">
                            <input type="text" id="ieee754-binary" class="input-field mono" readonly>
                            <button class="copy-btn-small" onclick="copyToClipboard('ieee754-binary')">📋</button>
                        </div>
                    </div>
                    <div class="hash-item">
                        <label>十六进制表示</label>
                        <div class="hash-value-container">
                            <input type="text" id="ieee754-hex" class="input-field mono" readonly>
                            <button class="copy-btn-small" onclick="copyToClipboard('ieee754-hex')">📋</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    'calculator': `
        <div class="tool-card">
            <div class="card-header">
                <h2>计算器</h2>
                <p class="card-description">表达式计算器</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入表达式</label>
                    <input type="text" id="calc-input" class="input-field mono" placeholder="如: (1+2)*3/4">
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="calculate()">🔢 计算</button>
                </div>
                <div class="form-group">
                    <label>计算结果</label>
                    <input type="text" id="calc-output" class="input-field mono" readonly>
                </div>
            </div>
        </div>
    `,

    'chmod': `
        <div class="tool-card">
            <div class="card-header">
                <h2>Chmod 计算器</h2>
                <p class="card-description">Linux 文件权限计算</p>
            </div>
            <div class="card-body">
                <div class="chmod-grid">
                    <div class="chmod-section">
                        <h4>Owner</h4>
                        <label><input type="checkbox" id="chmod-owner-r" onchange="updateChmod()"> Read</label>
                        <label><input type="checkbox" id="chmod-owner-w" onchange="updateChmod()"> Write</label>
                        <label><input type="checkbox" id="chmod-owner-x" onchange="updateChmod()"> Execute</label>
                    </div>
                    <div class="chmod-section">
                        <h4>Group</h4>
                        <label><input type="checkbox" id="chmod-group-r" onchange="updateChmod()"> Read</label>
                        <label><input type="checkbox" id="chmod-group-w" onchange="updateChmod()"> Write</label>
                        <label><input type="checkbox" id="chmod-group-x" onchange="updateChmod()"> Execute</label>
                    </div>
                    <div class="chmod-section">
                        <h4>Others</h4>
                        <label><input type="checkbox" id="chmod-other-r" onchange="updateChmod()"> Read</label>
                        <label><input type="checkbox" id="chmod-other-w" onchange="updateChmod()"> Write</label>
                        <label><input type="checkbox" id="chmod-other-x" onchange="updateChmod()"> Execute</label>
                    </div>
                </div>
                <div class="hash-results">
                    <div class="hash-item">
                        <label>数字格式</label>
                        <div class="hash-value-container">
                            <input type="text" id="chmod-numeric" class="input-field mono" value="000" readonly>
                            <button class="copy-btn-small" onclick="copyToClipboard('chmod-numeric')">📋</button>
                        </div>
                    </div>
                    <div class="hash-item">
                        <label>符号格式</label>
                        <div class="hash-value-container">
                            <input type="text" id="chmod-symbolic" class="input-field mono" value="---------" readonly>
                            <button class="copy-btn-small" onclick="copyToClipboard('chmod-symbolic')">📋</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    // ========================================
    // Text Tools
    // ========================================
    'text-diff': `
        <div class="tool-card">
            <div class="card-header">
                <h2>文本对比</h2>
                <p class="card-description">使用 Monaco Diff Editor 专业对比两段文本的差异</p>
            </div>
            <div class="card-body">
                <div class="diff-toolbar">
                    <div class="diff-options">
                        <label class="checkbox-inline">
                            <input type="checkbox" id="diff-inline" onchange="toggleDiffViewMode()">
                            <span>行内对比模式</span>
                        </label>
                        <label class="checkbox-inline">
                            <input type="checkbox" id="diff-ignore-whitespace" onchange="updateDiffEditor()">
                            <span>忽略空白符</span>
                        </label>
                        <select id="diff-language" class="input-select" style="width: auto; padding: 0.4rem 2rem 0.4rem 0.6rem;" onchange="updateDiffLanguage()">
                            <option value="plaintext">纯文本</option>
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="json">JSON</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="sql">SQL</option>
                            <option value="xml">XML</option>
                            <option value="markdown">Markdown</option>
                        </select>
                    </div>
                    <div class="diff-stats" id="diff-stats"></div>
                </div>
                <div class="diff-labels">
                    <div class="diff-label diff-label-left">
                        <span class="diff-label-icon">📄</span>
                        <span>原始文本 (Original)</span>
                    </div>
                    <div class="diff-label diff-label-right">
                        <span class="diff-label-icon">📝</span>
                        <span>修改后文本 (Modified)</span>
                    </div>
                </div>
                <div id="monaco-diff-container" class="monaco-diff-container"></div>
                <div class="resizer-v"></div>
                <div class="diff-actions">
                    <button class="btn btn-primary" onclick="computeDiffStats()">📊 统计差异</button>
                    <button class="btn btn-secondary" onclick="swapDiffEditors()">🔄 交换文本</button>
                    <button class="btn btn-outline" onclick="clearDiffEditors()">🗑️ 清空</button>
                    <button class="btn btn-outline" onclick="loadDiffSample()">📋 加载示例</button>
                </div>
            </div>
        </div>
    `,


    'text-process': `
        <div class="tool-card">
            <div class="card-header">
                <h2>文本处理</h2>
                <p class="card-description">去重、排序、去空行等</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="textproc-input" class="input-textarea" placeholder="每行一个"></textarea>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="textRemoveDuplicate()">🔄 去重</button>
                    <button class="btn btn-secondary" onclick="textSort()">📊 排序</button>
                    <button class="btn btn-outline" onclick="textRemoveEmpty()">🧹 去空行</button>
                    <button class="btn btn-outline" onclick="textReverse()">↕️ 逆序</button>
                    <button class="btn btn-outline" onclick="textTrim()">✂️ 去首尾空格</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="textproc-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('textproc-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'text-escape': `
        <div class="tool-card">
            <div class="card-header">
                <h2>文本转义</h2>
                <p class="card-description">HTML/JS/特殊字符转义</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="text-escape-input" class="input-textarea" placeholder="请输入文本"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>转义类型</label>
                        <select id="escape-type" class="input-select">
                            <option value="html">HTML 实体</option>
                            <option value="js">JavaScript 字符串</option>
                            <option value="sql">SQL</option>
                        </select>
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="escapeText()">🔒 转义</button>
                    <button class="btn btn-secondary" onclick="unescapeText()">🔓 反转义</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="text-escape-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('text-escape-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'word-count': `
        <div class="tool-card">
            <div class="card-header">
                <h2>字数统计</h2>
                <p class="card-description">统计文本的字符、单词、行数</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="wordcount-input" class="input-textarea" placeholder="请输入文本" oninput="countWords()"></textarea>
                </div>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value" id="stat-chars">0</span>
                        <span class="stat-label">字符数</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="stat-chars-no-space">0</span>
                        <span class="stat-label">字符数(不含空格)</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="stat-words">0</span>
                        <span class="stat-label">单词数</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="stat-lines">0</span>
                        <span class="stat-label">行数</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="stat-chinese">0</span>
                        <span class="stat-label">中文字符</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="stat-bytes">0</span>
                        <span class="stat-label">字节数(UTF-8)</span>
                    </div>
                </div>
            </div>
        </div>
    `,

    'regex': `
        <div class="tool-card">
            <div class="card-header">
                <h2>正则表达式</h2>
                <p class="card-description">正则表达式测试与匹配</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>正则表达式</label>
                    <input type="text" id="regex-pattern" class="input-field mono" placeholder="如: \\d+">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>标志</label>
                        <div class="checkbox-group">
                            <label><input type="checkbox" id="regex-g" checked> g (全局)</label>
                            <label><input type="checkbox" id="regex-i"> i (忽略大小写)</label>
                            <label><input type="checkbox" id="regex-m"> m (多行)</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>测试文本</label>
                    <textarea id="regex-input" class="input-textarea" placeholder="请输入测试文本"></textarea>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="testRegex()">🔍 测试匹配</button>
                    <button class="btn btn-secondary" onclick="regexReplace()">🔄 替换</button>
                </div>
                <div class="form-group">
                    <label>替换为</label>
                    <input type="text" id="regex-replace" class="input-field" placeholder="替换文本">
                </div>
                <div class="form-group">
                    <label>匹配结果</label>
                    <textarea id="regex-output" class="input-textarea output" readonly></textarea>
                </div>
            </div>
        </div>
    `,

    'case-convert': `
        <div class="tool-card">
            <div class="card-header">
                <h2>大小写转换</h2>
                <p class="card-description">英文大小写、驼峰命名转换</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入文本</label>
                    <textarea id="case-input" class="input-textarea" placeholder="请输入文本"></textarea>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="toUpperCase()">🔠 全部大写</button>
                    <button class="btn btn-secondary" onclick="toLowerCase()">🔡 全部小写</button>
                    <button class="btn btn-outline" onclick="toTitleCase()">📝 首字母大写</button>
                    <button class="btn btn-outline" onclick="toCamelCase()">🐪 驼峰命名</button>
                    <button class="btn btn-outline" onclick="toSnakeCase()">🐍 下划线命名</button>
                </div>
                <div class="form-group">
                    <label>输出结果</label>
                    <textarea id="case-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('case-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    // ========================================
    // Date Tools
    // ========================================
    'timestamp': `
        <div class="tool-card">
            <div class="card-header">
                <h2>Unix 时间戳</h2>
                <p class="card-description">时间戳与日期时间互转</p>
            </div>
            <div class="card-body">
                <div class="timestamp-now">
                    <span class="label">当前时间戳:</span>
                    <span class="value" id="current-timestamp">-</span>
                    <button class="btn btn-small" onclick="refreshTimestamp()">🔄</button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>时间戳</label>
                        <input type="text" id="timestamp-input" class="input-field" placeholder="秒或毫秒">
                    </div>
                    <div class="form-group">
                        <label>日期时间</label>
                        <input type="datetime-local" id="datetime-input" class="input-field">
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="timestampToDate()">📅 时间戳转日期</button>
                    <button class="btn btn-secondary" onclick="dateToTimestamp()">⏱️ 日期转时间戳</button>
                </div>
                <div class="form-group">
                    <label>转换结果</label>
                    <textarea id="timestamp-output" class="input-textarea output" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('timestamp-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'cron': `
        <div class="tool-card">
            <div class="card-header">
                <h2>Cron 表达式</h2>
                <p class="card-description">Cron 表达式解析与生成</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Cron 表达式</label>
                    <input type="text" id="cron-input" class="input-field mono" placeholder="如: 0 0 * * *" value="0 0 * * *">
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="parseCron()">🔍 解析</button>
                </div>
                <div class="cron-presets">
                    <h4>常用表达式</h4>
                    <button class="btn btn-small" onclick="setCron('* * * * *')">每分钟</button>
                    <button class="btn btn-small" onclick="setCron('0 * * * *')">每小时</button>
                    <button class="btn btn-small" onclick="setCron('0 0 * * *')">每天0点</button>
                    <button class="btn btn-small" onclick="setCron('0 0 * * 1')">每周一</button>
                    <button class="btn btn-small" onclick="setCron('0 0 1 * *')">每月1号</button>
                </div>
                <div class="form-group">
                    <label>解析结果</label>
                    <textarea id="cron-output" class="input-textarea output" readonly></textarea>
                </div>
            </div>
        </div>
    `,

    'date-calc': `
        <div class="tool-card">
            <div class="card-header">
                <h2>日期计算器</h2>
                <p class="card-description">日期加减、间隔计算</p>
            </div>
            <div class="card-body">
                <div class="form-row">
                    <div class="form-group">
                        <label>起始日期</label>
                        <input type="date" id="date-start" class="input-field">
                    </div>
                    <div class="form-group">
                        <label>结束日期</label>
                        <input type="date" id="date-end" class="input-field">
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="calcDateDiff()">📅 计算间隔</button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>基准日期</label>
                        <input type="date" id="date-base" class="input-field">
                    </div>
                    <div class="form-group">
                        <label>增减天数</label>
                        <input type="number" id="date-offset" class="input-field" value="0">
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-secondary" onclick="calcDateAdd()">➕ 日期加减</button>
                </div>
                <div class="form-group">
                    <label>计算结果</label>
                    <textarea id="date-output" class="input-textarea output" readonly></textarea>
                </div>
            </div>
        </div>
    `,

    // ========================================
    // Random Tools
    // ========================================
    'random': `
        <div class="tool-card">
            <div class="card-header">
                <h2>随机数生成器</h2>
                <p class="card-description">生成指定范围的随机数</p>
            </div>
            <div class="card-body">
                <div class="form-row">
                    <div class="form-group">
                        <label>最小值</label>
                        <input type="number" id="random-min" class="input-field" value="0">
                    </div>
                    <div class="form-group">
                        <label>最大值</label>
                        <input type="number" id="random-max" class="input-field" value="100">
                    </div>
                    <div class="form-group">
                        <label>数量</label>
                        <input type="number" id="random-count" class="input-field" value="10">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="random-unique"> 不重复
                        </label>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="random-sort"> 排序
                        </label>
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="generateRandom()">🎲 生成</button>
                </div>
                <div class="form-group">
                    <label>生成结果</label>
                    <textarea id="random-output" class="input-textarea output mono" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('random-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'password': `
        <div class="tool-card">
            <div class="card-header">
                <h2>随机密码生成</h2>
                <p class="card-description">生成安全随机密码</p>
            </div>
            <div class="card-body">
                <div class="form-row">
                    <div class="form-group">
                        <label>密码长度</label>
                        <input type="number" id="pwd-length" class="input-field" value="16" min="4" max="128">
                    </div>
                    <div class="form-group">
                        <label>生成数量</label>
                        <input type="number" id="pwd-count" class="input-field" value="5" min="1" max="100">
                    </div>
                </div>
                <div class="checkbox-group">
                    <label><input type="checkbox" id="pwd-upper" checked> 大写字母 (A-Z)</label>
                    <label><input type="checkbox" id="pwd-lower" checked> 小写字母 (a-z)</label>
                    <label><input type="checkbox" id="pwd-number" checked> 数字 (0-9)</label>
                    <label><input type="checkbox" id="pwd-symbol" checked> 特殊符号 (!@#$...)</label>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="generatePassword()">🔐 生成密码</button>
                </div>
                <div class="form-group">
                    <label>生成结果</label>
                    <textarea id="pwd-output" class="input-textarea output mono" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('pwd-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    'uuid': `
        <div class="tool-card">
            <div class="card-header">
                <h2>UUID/GUID 生成</h2>
                <p class="card-description">生成通用唯一识别码</p>
            </div>
            <div class="card-body">
                <div class="form-row">
                    <div class="form-group">
                        <label>生成数量</label>
                        <input type="number" id="uuid-count" class="input-field" value="5" min="1" max="100">
                    </div>
                    <div class="form-group">
                        <label>格式</label>
                        <select id="uuid-format" class="input-select">
                            <option value="default">标准格式</option>
                            <option value="nodash">无连字符</option>
                            <option value="upper">大写</option>
                            <option value="upper-nodash">大写无连字符</option>
                        </select>
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="generateUuid()">🎲 生成 UUID</button>
                </div>
                <div class="form-group">
                    <label>生成结果</label>
                    <textarea id="uuid-output" class="input-textarea output mono" readonly></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('uuid-output')">📋 复制</button>
                </div>
            </div>
        </div>
    `,

    // ========================================
    // Color Tools
    // ========================================
    'color': `
        <div class="tool-card">
            <div class="card-header">
                <h2>RGB 颜色转换</h2>
                <p class="card-description">RGB、HEX、HSL 颜色格式互转</p>
            </div>
            <div class="card-body">
                <div class="color-preview-container">
                    <input type="color" id="color-picker" class="color-picker" value="#6366f1" onchange="updateColorFromPicker()">
                    <div id="color-preview" class="color-preview" style="background: #6366f1"></div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>HEX</label>
                        <input type="text" id="color-hex" class="input-field mono" value="#6366f1" oninput="updateColorFromHex()">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>R</label>
                        <input type="number" id="color-r" class="input-field" value="99" min="0" max="255" oninput="updateColorFromRgb()">
                    </div>
                    <div class="form-group">
                        <label>G</label>
                        <input type="number" id="color-g" class="input-field" value="102" min="0" max="255" oninput="updateColorFromRgb()">
                    </div>
                    <div class="form-group">
                        <label>B</label>
                        <input type="number" id="color-b" class="input-field" value="241" min="0" max="255" oninput="updateColorFromRgb()">
                    </div>
                </div>
                <div class="hash-results">
                    <div class="hash-item">
                        <label>RGB</label>
                        <div class="hash-value-container">
                            <input type="text" id="color-rgb-output" class="input-field mono" value="rgb(99, 102, 241)" readonly>
                            <button class="copy-btn-small" onclick="copyToClipboard('color-rgb-output')">📋</button>
                        </div>
                    </div>
                    <div class="hash-item">
                        <label>HSL</label>
                        <div class="hash-value-container">
                            <input type="text" id="color-hsl-output" class="input-field mono" readonly>
                            <button class="copy-btn-small" onclick="copyToClipboard('color-hsl-output')">📋</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    // ========================================
    // Image Tools
    // ========================================
    'img-base64': `
        <div class="tool-card">
            <div class="card-header">
                <h2>图片与Base64转换</h2>
                <p class="card-description">图片文件与Base64编码互转</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>选择图片</label>
                    <input type="file" id="img-file-input" class="input-field" accept="image/*" onchange="imageToBase64()">
                </div>
                <div class="form-group">
                    <label>图片预览</label>
                    <div id="img-preview" class="img-preview"></div>
                </div>
                <div class="form-group">
                    <label>Base64 编码</label>
                    <textarea id="img-base64-output" class="input-textarea output code" readonly placeholder="选择图片后显示Base64编码"></textarea>
                    <button class="copy-btn" onclick="copyToClipboard('img-base64-output')">📋 复制</button>
                </div>
                <hr>
                <div class="form-group">
                    <label>或输入 Base64</label>
                    <textarea id="img-base64-input" class="input-textarea code" placeholder="粘贴Base64编码以生成图片"></textarea>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="base64ToImage()">🖼️ 转为图片</button>
                </div>
            </div>
        </div>
    `,

    'qrcode': `
        <div class="tool-card">
            <div class="card-header">
                <h2>二维码生成</h2>
                <p class="card-description">生成二维码图片</p>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>输入内容</label>
                    <textarea id="qrcode-input" class="input-textarea" placeholder="请输入要生成二维码的内容"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>尺寸</label>
                        <select id="qrcode-size" class="input-select">
                            <option value="4">小 (132px)</option>
                            <option value="6" selected>中 (198px)</option>
                            <option value="8">大 (264px)</option>
                            <option value="10">超大 (330px)</option>
                        </select>
                    </div>
                </div>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="generateQrcode()">📱 生成二维码</button>
                </div>
                <div class="qrcode-container">
                    <div id="qrcode-output"></div>
                </div>
            </div>
        </div>
    `,
});

// Tool titles for navigation
const toolTitles = {
    'json-format': 'JSON 格式化',
    'json-escape': 'JSON 转义',
    'json-to-class': 'JSON 生成实体类',
    'html-format': 'HTML 格式化',
    'js-format': 'JavaScript 格式化',
    'css-format': 'CSS 格式化',
    'xml-format': 'XML 格式化',
    'sql-format': 'SQL 格式化',
    'base64': 'Base64 编码/解码',
    'base-multi': 'Base16/32/58/62 编码',
    'url': 'URL 编码/解码',
    'unicode': 'Unicode 编码/解码',
    'hex': 'Hex 编码/解码',
    'gzip': 'Gzip 压缩/解压',
    'jwt': 'JWT 解析器',
    'hash': 'MD5/SHA 加密',
    'hmac': 'HMAC 加密',
    'crc': 'CRC 校验',
    'file-hash': '文件 Hash 计算',
    'aes': 'AES 加密/解密',
    'des': 'DES 加密/解密',
    'triple-des': 'Triple DES 加密',
    'rc4': 'RC4 加密/解密',
    'rabbit': 'Rabbit 加密/解密',
    'xor': 'XOR 异或加密',
    'rsa': 'RSA 加密/解密',
    'morse': '摩斯密码',
    'caesar': '凯撒密码',
    'radix': '进制转换',
    'ieee754': 'IEEE 754 浮点数',
    'calculator': '计算器',
    'chmod': 'Chmod 计算器',
    'text-diff': '文本对比',
    'text-process': '文本处理',
    'text-escape': '文本转义',
    'word-count': '字数统计',
    'regex': '正则表达式',
    'case-convert': '大小写转换',
    'timestamp': 'Unix 时间戳',
    'cron': 'Cron 表达式',
    'date-calc': '日期计算器',
    'random': '随机数生成器',
    'password': '随机密码生成',
    'uuid': 'UUID/GUID 生成',
    'color': 'RGB 颜色转换',
    'img-base64': '图片与Base64转换',
    'qrcode': '二维码生成',
};

