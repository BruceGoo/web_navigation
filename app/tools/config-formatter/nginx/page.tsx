'use client';

import { useState, useEffect, useCallback } from "react";;
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  Code,
  Copy,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Settings,
  Indent,
  Braces,
  Palette
} from 'lucide-react';

interface FormatOptions {
  indentSize: number;
  useSpaces: boolean;
  sortDirectives: boolean;
  validateBrackets: boolean;
  highlightSyntax: boolean;
  preserveComments: boolean;
}

interface FormatResult {
  content: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export default function NginxFormatter() {
  const [inputContent, setInputContent] = useState(`# Nginx 配置示例
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location ~* \\.(jpg|jpeg|png|gif|css|js|ico|svg)$ {
        expires 30d;
        access_log off;
    }
}`);

  const [outputContent, setOutputContent] = useState('');
  const [options, setOptions] = useState<FormatOptions>({
    indentSize: 4,
    useSpaces: true,
    sortDirectives: false,
    validateBrackets: true,
    highlightSyntax: true,
    preserveComments: true
  });

  const [validation, setValidation] = useState<{ valid: boolean; errors: string[]; warnings: string[] }>({
    valid: true,
    errors: [],
    warnings: []
  });

  // Nginx 关键字和指令
  const nginxDirectives = [
    'server', 'location', 'upstream', 'events', 'http', 'mail', 'stream',
    'listen', 'server_name', 'root', 'index', 'proxy_pass', 'try_files',
    'location', 'if', 'return', 'rewrite', 'break', 'last', 'redirect',
    'expires', 'access_log', 'error_log', 'include', 'default_type',
    'proxy_set_header', 'proxy_connect_timeout', 'proxy_send_timeout',
    'proxy_read_timeout', 'client_max_body_size', 'gzip', 'ssl',
    'ssl_certificate', 'ssl_certificate_key', 'ssl_protocols',
    'add_header', 'charset', 'etag', 'sendfile', 'tcp_nopush',
    'tcp_nodelay', 'keepalive_timeout', 'types_hash_max_size'
  ];

  // 格式化Nginx配置
  const formatNginxConfig = useCallback((config: string, opts: FormatOptions): FormatResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const lines = config.split('\n');
    const formattedLines: string[] = [];
    let indentLevel = 0;
    let bracketCount = 0;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const trimmed = line.trim();

      // 跳过空行和注释
      if (!trimmed) {
        if (opts.preserveComments || formattedLines.length > 0) {
          formattedLines.push('');
        }
        continue;
      }

      // 处理注释
      if (trimmed.startsWith('#')) {
        if (opts.preserveComments) {
          formattedLines.push(' '.repeat(Math.max(0, indentLevel * opts.indentSize)) + trimmed);
        }
        continue;
      }

      // 检查括号配对
      if (opts.validateBrackets) {
        const openBrackets = (trimmed.match(/{/g) || []).length;
        const closeBrackets = (trimmed.match(/}/g) || []).length;
        bracketCount += openBrackets - closeBrackets;

        if (trimmed.includes('}')) {
          indentLevel = Math.max(0, indentLevel - closeBrackets);
        }
      }

      // 缩进当前行
      const currentIndent = ' '.repeat(indentLevel * opts.indentSize);

      // 格式化指令
      let formattedLine = currentIndent + trimmed;

      // 指令排序（简单实现）
      if (opts.sortDirectives && trimmed.includes(' ')) {
        const parts = trimmed.split(/\s+/);
        const directive = parts[0];
        const args = parts.slice(1).join(' ');

        // 简单的指令排序逻辑
        if (nginxDirectives.includes(directive)) {
          formattedLine = currentIndent + directive + ' ' + args;
        }
      }

      formattedLines.push(formattedLine);

      // 更新缩进级别
      if (opts.validateBrackets && trimmed.includes('{')) {
        indentLevel += 1;
      }
    }

    // 检查括号配对
    if (opts.validateBrackets && bracketCount !== 0) {
      errors.push(`括号不匹配：${bracketCount > 0 ? '缺少 ' + bracketCount + ' 个闭合括号' : '多余 ' + Math.abs(bracketCount) + ' 个闭合括号'}`);
    }

    // 基本语法检查
    const result = formattedLines.join('\n');

    // 检查常见的Nginx语法错误
    if (opts.validateBrackets) {
      validateNginxSyntax(result, errors, warnings);
    }

    return {
      content: result,
      valid: errors.length === 0,
      errors,
      warnings
    };
  }, [options]);

  // Nginx语法验证
  const validateNginxSyntax = (config: string, errors: string[], warnings: string[]) => {
    const lines = config.split('\n');
    let inServerBlock = false;
    let inLocationBlock = false;
    let hasListenDirective = false;
    let hasServerNameDirective = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;

      // 块结构检查
      if (line === 'server {') {
        inServerBlock = true;
        hasListenDirective = false;
        hasServerNameDirective = false;
      } else if (line === '}' && inLocationBlock) {
        inLocationBlock = false;
      } else if (line === '}' && inServerBlock) {
        inServerBlock = false;
        if (!hasListenDirective) {
          warnings.push(`第 ${i + 1} 行: server 块缺少 listen 指令`);
        }
      } else if (line.includes('location')) {
        inLocationBlock = true;
      }

      // 指令检查
      if (inServerBlock) {
        if (line.startsWith('listen ')) {
          hasListenDirective = true;
          const listenMatch = line.match(/listen\s+(\d+)/);
          if (listenMatch) {
            const port = parseInt(listenMatch[1]);
            if (port < 1 || port > 65535) {
              errors.push(`第 ${i + 1} 行: 无效的端口号 ${port}`);
            }
          }
        }
        if (line.startsWith('server_name ')) {
          hasServerNameDirective = true;
        }
      }

      // 常见错误检查
      if (line.includes('proxy_pass') && !line.includes('http://') && !line.includes('https://')) {
        warnings.push(`第 ${i + 1} 行: proxy_pass 建议使用完整的 URL`);
      }

      if (line.includes('if ($host') && line.includes('rewrite')) {
        warnings.push(`第 ${i + 1} 行: if 指令与 rewrite 一起使用可能影响性能`);
      }
    }
  };

  // 格式化配置
  const formatConfig = useCallback(() => {
    if (!inputContent.trim()) {
      setOutputContent('');
      return;
    }

    const result = formatNginxConfig(inputContent, options);
    setOutputContent(result.content);
    setValidation({
      valid: result.valid,
      errors: result.errors,
      warnings: result.warnings
    });
  }, [inputContent, options, formatNginxConfig]);

  // 复制输出内容
  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(outputContent);
      alert('已复制到剪贴板');
    } catch (error) {
      alert('复制失败');
    }
  };

  // 下载配置文件
  const downloadConfig = () => {
    const blob = new Blob([outputContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nginx.conf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 上传配置文件
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInputContent(content);
      };
      reader.readAsText(file);
    }
  };

  // 清空内容
  const clearContent = () => {
    setInputContent('');
    setOutputContent('');
    setValidation({ valid: true, errors: [], warnings: [] });
  };

  // 加载示例配置
  const loadExample = () => {
    const example = `# Nginx 反向代理配置示例
server {
    listen 80;
    server_name example.com;

    # 静态资源处理
    location / {
        root /var/www/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}`;
    setInputContent(example);
  };

  // 自动格式化
  useEffect(() => {
    formatConfig();
  }, [inputContent, options]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Nginx 配置格式化器
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            专业的 Nginx 配置文件格式化工具，支持语法高亮、错误检查和最佳实践建议
          </p>
        </motion.div>

        {/* 设置面板 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center"
            >
              <Settings className="w-5 h-5 mr-2" />
              格式化选项
            </h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadExample}
                className="flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
              >
                <Code className="w-4 h-4 mr-2" />
                加载示例
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                缩进大小
              </label>
              <select
                value={options.indentSize}
                onChange={(e) => setOptions(prev => ({ ...prev, indentSize: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              >
                {[2, 4, 6, 8].map(size => (
                  <option key={size} value={size}>{size} 空格</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="useSpaces"
                checked={options.useSpaces}
                onChange={(e) => setOptions(prev => ({ ...prev, useSpaces: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="useSpaces" className="text-sm text-gray-700 dark:text-gray-300"
              >
                使用空格
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="validateBrackets"
                checked={options.validateBrackets}
                onChange={(e) => setOptions(prev => ({ ...prev, validateBrackets: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="validateBrackets" className="text-sm text-gray-700 dark:text-gray-300"
              >
                括号检查
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="preserveComments"
                checked={options.preserveComments}
                onChange={(e) => setOptions(prev => ({ ...prev, preserveComments: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="preserveComments" className="text-sm text-gray-700 dark:text-gray-300"
              >
                保留注释
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="highlightSyntax"
                checked={options.highlightSyntax}
                onChange={(e) => setOptions(prev => ({ ...prev, highlightSyntax: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="highlightSyntax" className="text-sm text-gray-700 dark:text-gray-300"
              >
                语法高亮
              </label>
            </div>
          </div>
        </motion.div>

        {/* 验证结果 */}
        {(validation.errors.length > 0 || validation.warnings.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${
              validation.errors.length > 0 ? 'border-l-4 border-red-500' : 'border-l-4 border-yellow-500'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                validation.errors.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
              }`}>
                {validation.errors.length > 0 ? <AlertCircle className="inline w-5 h-5 mr-2" /> : <AlertCircle className="inline w-5 h-5 mr-2" />}
                {validation.errors.length > 0 ? '错误' : '警告'}
              </h3>
              <div className="space-y-2">
                {validation.errors.map((error, index) => (
                  <div key={index} className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded"
                  >
                    {error}
                  </div>
                ))}
                {validation.warnings.map((warning, index) => (
                  <div key={index} className="text-yellow-600 dark:text-yellow-400 text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded"
                  >
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 编辑器区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入编辑器 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center"
              >
                <Code className="w-5 h-5 mr-2" />
                Nginx 配置内容
              </h3>

              <div className="flex items-center space-x-2">
                {validation.valid ? (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="w-5 h-5 mr-1" />
                    <span className="text-sm">格式正确</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500"
                  >
                    <AlertCircle className="w-5 h-5 mr-1" />
                    <span className="text-sm">有错误</span>
                  </div>
                )}
              </div>
            </div>

            <div className="h-96 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
            >
              <Editor
                height="100%"
                language="nginx"
                value={inputContent}
                onChange={(value) => setInputContent(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  folding: true,
                  renderWhitespace: 'selection',
                  scrollBeyondLastLine: false,
                  automaticLayout: true
                }}
              />
            </div>

            <div className="flex items-center justify-between mt-4"
            >
              <div className="flex items-center space-x-2"
              >
                <button
                  onClick={() => document.getElementById('fileInput')?.click()}
                  className="flex items-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  上传文件
                </button>
                <input
                  id="fileInput"
                  type="file"
                  accept=".conf,.nginx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <button
                onClick={clearContent}
                className="flex items-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                清空
              </button>
            </div>
          </motion.div>

          {/* 输出编辑器 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center"
              >
                <Palette className="w-5 h-5 mr-2" />
                格式化结果
              </h3>

              <div className="flex items-center space-x-2"
              >
                <button
                  onClick={copyOutput}
                  className="flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </button>
                <button
                  onClick={downloadConfig}
                  className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载
                </button>
              </div>
            </div>

            <div className="h-96 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
            >
              <Editor
                height="100%"
                language="nginx"
                value={outputContent}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  folding: true,
                  renderWhitespace: 'selection',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  readOnly: true
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}