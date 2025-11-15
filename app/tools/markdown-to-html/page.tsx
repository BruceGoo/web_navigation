'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

interface ExampleType {
  basic: string;
  advanced: string;
  readme: string;
  blog: string;
}

export default function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState<string>(`# 欢迎使用Markdown转HTML工具

这是一个将**Markdown**转换为HTML的工具。

## 功能特点

- ✨ 实时转换
- 🎨 代码高亮
- 📱 响应式设计
- 💾 导出功能

## 代码示例

### JavaScript
\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

### Python
\`\`\`python
def greet(name):
    return f"Hello, {name}!"
\`\`\`

## 表格示例

| 功能 | 状态 | 描述 |
|------|------|------|
| 转换 | ✅ | 支持Markdown转HTML |
| 导出 | ✅ | 可导出HTML文件 |
| 复制 | ✅ | 支持复制结果 |

## 引用

> 这是一个引用示例
> 可以包含多行内容

---

**感谢您的使用！**`);

  const [html, setHtml] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [includeStyles, setIncludeStyles] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Convert Markdown to HTML
  const convertToHtml = useCallback(async () => {
    if (!markdown.trim()) {
      setError('请输入Markdown内容');
      return;
    }

    try {
      const htmlContent = await marked(markdown);
      setHtml(htmlContent);
      setError('');
    } catch (err) {
      setError(`转换错误: ${err instanceof Error ? err.message : '未知错误'}`);
      setHtml('');
    }
  }, [markdown]);

  // Clear all content
  const clearAll = useCallback(() => {
    setMarkdown('');
    setHtml('');
    setError('');
  }, []);

  // Copy HTML to clipboard
  const copyHtml = useCallback(async () => {
    if (html) {
      try {
        await navigator.clipboard.writeText(html);
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  }, [html]);

  // Load example content
  const loadExample = useCallback((type: keyof ExampleType) => {
    const examples: ExampleType = {
      basic: `# 基础示例

这是一个**基础**的Markdown示例。

- 列表项1
- 列表项2
- 列表项3

[链接示例](https://example.com)`,

      advanced: `# 高级示例

## 代码块

\`\`\`javascript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
\`\`\`

## 表格

| 语言 | 用途 | 流行度 |
|------|------|--------|
| JavaScript | 前端 | ⭐⭐⭐⭐⭐ |
| Python | 数据科学 | ⭐⭐⭐⭐⭐ |
| Go | 后端 | ⭐⭐⭐⭐ |

## 任务列表

- [x] 完成的任务
- [ ] 未完成的任务
- [x] 另一个完成的任务`,

      readme: `# 项目README

## 项目名称

项目描述和简介。

### 安装

\`\`\`bash
npm install package-name
\`\`\`

### 使用方法

\`\`\`javascript
const package = require('package-name');
package.init();
\`\`\`

### 特性

- 🚀 快速
- 🎨 美观
- 📱 响应式

### 许可证

MIT License`,

      blog: `# 博客文章模板

**发布日期**: 2024年1月15日
**作者**: 您的名字
**标签**: #技术 #教程

## 引言

这里是文章的引言部分...

## 主要内容

### 第一部分

详细的内容描述...

### 第二部分

更多内容...

## 总结

总结性发言...

---

感谢您的阅读！`
    };
    setMarkdown(examples[type] || examples.basic);
  }, []);

  // Export HTML with optional styles
  const exportHtml = useCallback(() => {
    if (!html) return;

    const cssStyles = `
<style>
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: ${theme === 'dark' ? '#e5e7eb' : '#374151'};
    background-color: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
}

h1, h2, h3, h4, h5, h6 {
    color: ${theme === 'dark' ? '#f9fafb' : '#111827'};
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

h1 { font-size: 2.25rem; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem; }
h2 { font-size: 1.875rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }
h5 { font-size: 1.125rem; }
h6 { font-size: 1rem; }

p { margin-bottom: 1rem; }

a {
    color: #3b82f6;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

code {
    background-color: ${theme === 'dark' ? '#374151' : '#f3f4f6'};
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
}

pre {
    background-color: ${theme === 'dark' ? '#1f2937' : '#f9fafb'};
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    border: 1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};
}

pre code {
    background-color: transparent;
    padding: 0;
}

blockquote {
    border-left: 4px solid #3b82f6;
    margin: 1rem 0;
    padding-left: 1rem;
    color: ${theme === 'dark' ? '#9ca3af' : '#6b7280'};
    font-style: italic;
}

table {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
}

th, td {
    border: 1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};
    padding: 0.75rem;
    text-align: left;
}

th {
    background-color: ${theme === 'dark' ? '#374151' : '#f9fafb'};
    font-weight: 600;
}

ul, ol {
    margin-bottom: 1rem;
    padding-left: 2rem;
}

li {
    margin-bottom: 0.25rem;
}

hr {
    border: none;
    border-top: 2px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};
    margin: 2rem 0;
}

img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
}
</style>`;

    const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown转HTML导出</title>
    ${includeStyles ? cssStyles : ''}
</head>
<body>
    ${html}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown-export.html';
    a.click();
    URL.revokeObjectURL(url);
  }, [html, theme, includeStyles]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Markdown 转 HTML
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            将Markdown文档转换为HTML格式
          </p>
        </motion.div>

        {/* Tool Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6"
        >
          {/* Control Panel */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={convertToHtml}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🔄 转换
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🗑️ 清空
              </button>
              <button
                onClick={copyHtml}
                disabled={!html}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all transform hover:scale-105 disabled:transform-none shadow-lg"
              >
                📋 复制HTML
              </button>
              <button
                onClick={exportHtml}
                disabled={!html}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all transform hover:scale-105 disabled:transform-none shadow-lg"
              >
                📄 导出HTML
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">主题:</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                  className="px-3 py-1 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">🌞 浅色</option>
                  <option value="dark">🌙 深色</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={includeStyles}
                    onChange={(e) => setIncludeStyles(e.target.checked)}
                    className="rounded"
                  />
                  包含样式
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => loadExample('basic')}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
              >
                基础示例
              </button>
              <button
                onClick={() => loadExample('advanced')}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
              >
                高级示例
              </button>
              <button
                onClick={() => loadExample('readme')}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
              >
                README示例
              </button>
              <button
                onClick={() => loadExample('blog')}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
              >
                博客示例
              </button>
            </div>
          </div>

          {/* Input/Output Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Markdown Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                输入 Markdown:
              </label>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="在此输入您的Markdown内容..."
                className="w-full h-96 p-4 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* HTML Output */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                输出 HTML:
              </label>
              <textarea
                value={html}
                readOnly
                placeholder="转换后的HTML将显示在这里..."
                className="w-full h-96 p-4 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg font-mono text-sm resize-none"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                <span className="text-red-700 dark:text-red-400">{error}</span>
              </div>
            </motion.div>
          )}

          {/* HTML Preview */}
          {html && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                HTML 预览:
              </label>
              <div
                className={`w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg prose prose-sm dark:prose-invert max-w-none ${
                  theme === 'dark' ? 'prose-invert' : ''
                }`}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </motion.div>
          )}

          {/* Feature Description */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">🎨 样式选项</h3>
              <ul className="text-xs text-blue-600 dark:text-blue-500 space-y-1">
                <li>• 浅色/深色主题</li>
                <li>• 自定义CSS样式</li>
                <li>• 响应式设计</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">📤 导出功能</h3>
              <ul className="text-xs text-green-600 dark:text-green-500 space-y-1">
                <li>• 完整HTML文档</li>
                <li>• 可选样式包含</li>
                <li>• 独立运行文件</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}