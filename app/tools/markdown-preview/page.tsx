'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(`# Markdown 示例

这是一个**Markdown**预览工具的示例。

## 标题2

### 标题3

**粗体文本** 和 *斜体文本*

~~删除线文本~~

## 列表

### 无序列表
- 项目1
- 项目2
  - 子项目A
  - 子项目B
- 项目3

### 有序列表
1. 第一步
2. 第二步
3. 第三步

## 链接和图片

[链接到示例网站](https://example.com)

![示例图片](https://via.placeholder.com/300x200)

## 代码

### 行内代码
这是一个 \`console.log('Hello World')\` 示例。

### 代码块
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

## 表格

| 姓名 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25   | 北京 |
| 李四 | 30   | 上海 |
| 王五 | 28   | 广州 |

## 引用

> 这是一个引用块
> 可以包含多行内容
>
> - 甚至可以有列表
> - 和其他格式

## 任务列表

- [x] 完成的任务
- [ ] 未完成的任务
- [x] 另一个完成的任务

## 分割线

---

**享受使用Markdown写作的乐趣！** 🎉`);

  const [html, setHtml] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Real-time conversion from Markdown to HTML
  useEffect(() => {
    const convertMarkdown = async () => {
      try {
        const convertedHtml = await marked(markdown);
        setHtml(convertedHtml);
      } catch (err) {
        console.error("Markdown转换错误:", err);
        setHtml('<div class="text-red-500">Markdown转换出错</div>');
      }
    };

    convertMarkdown();
  }, [markdown]);

  const clearContent = useCallback(() => {
    setMarkdown('');
  }, []);

  const copyMarkdown = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown);
    } catch (err) {
      console.error('复制失败:', err);
    }
  }, [markdown]);

  const copyHtml = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(html);
    } catch (err) {
      console.error('复制失败:', err);
    }
  }, [html]);

  const loadTemplate = useCallback((template: string) => {
    setMarkdown(template);
  }, []);

  const exportHtml = useCallback(() => {
    const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown导出</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: ${theme === 'dark' ? '#e5e7eb' : '#374151'};
            background-color: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        pre {
            background-color: ${theme === 'dark' ? '#374151' : '#f9fafb'};
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
        }
        code {
            background-color: ${theme === 'dark' ? '#374151' : '#f9fafb'};
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
        }
        blockquote {
            border-left: 4px solid #3b82f6;
            margin: 0;
            padding-left: 1rem;
            color: ${theme === 'dark' ? '#9ca3af' : '#6b7280'};
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        th, td {
            border: 1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};
            padding: 0.5rem;
            text-align: left;
        }
        th {
            background-color: ${theme === 'dark' ? '#374151' : '#f9fafb'};
        }
    </style>
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
  }, [html, theme]);

  // Preset templates
  const templates = {
    basic: `# 标题

这是一个基础模板。

## 列表
- 项目1
- 项目2
- 项目3

## 链接
[点击这里](https://example.com)`,

    readme: `# 项目名称

项目简介和描述。

## 功能特性

- ✨ 特性1
- 🚀 特性2
- 🎨 特性3

## 安装

\`\`\`bash
npm install package-name
\`\`\`

## 使用方法

\`\`\`javascript
const example = require('package-name');
example.run();
\`\`\`

## 贡献

欢迎提交Issue和Pull Request。

## 许可证

MIT License`,

    blog: `# 文章标题

**发布时间**: 2024年1月15日
**作者**: 作者名字
**标签**: #技术 #分享

## 引言

这里是文章的引言部分...

## 正文

### 第一部分

这里是第一部分的详细内容...

### 第二部分

这里是第二部分的详细内容...

## 总结

这里是文章的总结...

---

感谢您的阅读！欢迎评论和分享。`,

    meeting: `# 会议记录

**会议主题**: 项目进度讨论
**会议时间**: 2024年1月15日 14:00-15:30
**会议地点**: 会议室A
**主持人**: 张经理
**记录人**: 李助理

## 参会人员
- 张经理（项目负责人）
- 王工程师（技术负责人）
- 李设计师（UI/UX设计）
- 赵产品经理

## 会议议程
1. 项目进度汇报
2. 技术难点讨论
3. 下阶段计划

## 会议内容

### 1. 项目进度汇报
- 前端开发：完成80%
- 后端API：完成90%
- UI设计：完成100%

### 2. 技术难点讨论
- 性能优化问题
- 第三方接口集成

### 3. 下阶段计划
- 完成剩余功能开发
- 进行系统测试
- 准备上线部署

## 行动项
- [ ] 王工程师：完成性能优化（截止：1月20日）
- [ ] 李设计师：提供最终设计稿（截止：1月18日）
- [ ] 赵产品经理：确认需求文档（截止：1月22日）

## 下次会议
**时间**: 2024年1月22日 14:00
**主题**: 测试和部署准备`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Markdown 即时预览
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            左写右看，实时预览Markdown效果
          </p>
        </motion.div>

        {/* Control panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-4 mb-6"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isPreviewMode
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {isPreviewMode ? '📝 编辑' : '👁️ 预览'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">字体大小:</label>
              <input
                type="range"
                min="12"
                max="20"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{fontSize}px</span>
            </div>

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

            <div className="flex gap-2">
              <button
                onClick={copyMarkdown}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
              >
                📋 复制Markdown
              </button>
              <button
                onClick={copyHtml}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
              >
                📋 复制HTML
              </button>
              <button
                onClick={exportHtml}
                className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
              >
                📄 导出HTML
              </button>
            </div>
          </div>

          {/* Template selection */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">快速模板:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => loadTemplate(templates.basic)}
                className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
              >
                基础模板
              </button>
              <button
                onClick={() => loadTemplate(templates.readme)}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
              >
                README模板
              </button>
              <button
                onClick={() => loadTemplate(templates.blog)}
                className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
              >
                博客模板
              </button>
              <button
                onClick={() => loadTemplate(templates.meeting)}
                className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
              >
                会议记录
              </button>
              <button
                onClick={clearContent}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
              >
                清空内容
              </button>
            </div>
          </div>
        </motion.div>

        {/* Edit and preview areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Edit area */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              编辑 Markdown:
            </label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="在这里输入您的Markdown内容..."
              className="w-full h-[600px] p-4 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ fontSize: `${fontSize}px` }}
            />
          </div>

          {/* Preview area */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              实时预览:
            </label>
            <div
              className={`h-[600px] p-4 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg overflow-y-auto prose prose-sm dark:prose-invert max-w-none`}
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </motion.div>

        {/* Usage instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            📚 Markdown 语法速查
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">标题</h4>
              <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs"># 一级标题
## 二级标题
### 三级标题</pre>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">强调</h4>
              <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs">**粗体**
*斜体*
~~删除线~~
\`代码\`</pre>
            </div>
            <div>
              <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">列表</h4>
              <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs">- 无序列表
1. 有序列表
- [ ] 任务列表</pre>
            </div>
            <div>
              <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">其他</h4>
              <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs">[链接](url)
![图片](url)
&gt; 引用
---</pre>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}