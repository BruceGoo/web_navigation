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
  ArrowUpDown,
  FileText,
  Layers
} from 'lucide-react';

interface DockerfileFormatOptions {
  instructionSorting: boolean;
  combineRunCommands: boolean;
  validateSyntax: boolean;
  checkBestPractices: boolean;
  preserveComments: boolean;
  multiStageDetection: boolean;
}

interface FormatResult {
  content: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

// Dockerfile 指令排序规则
const DOCKERFILE_INSTRUCTION_ORDER = [
  'FROM', 'ARG', 'LABEL', 'ENV', 'WORKDIR', 'COPY', 'ADD',
  'RUN', 'EXPOSE', 'VOLUME', 'USER', 'CMD', 'ENTRYPOINT', 'HEALTHCHECK'
];

// Dockerfile 最佳实践检查
const BEST_PRACTICES = {
  'FROM': '每个 Dockerfile 应该以 FROM 指令开始',
  'RUN apt-get update': '建议将 apt-get update 和 apt-get install 合并到同一个 RUN 指令',
  'apt-get install': '安装完成后建议清理 apt 缓存：apt-get clean \u0026\u0026 rm -rf /var/lib/apt/lists/*',
  'COPY': '尽量先复制变化频率较低的文件',
  'EXPOSE': 'EXPOSE 指令只是声明端口，不会实际发布端口',
  'CMD': 'CMD 指令应该用于定义容器启动时执行的命令',
  'ENTRYPOINT': 'ENTRYPOINT 指令用于配置容器启动时执行的命令'
};

export default function DockerfileFormatter() {
  const [inputContent, setInputContent] = useState(`# Dockerfile 示例
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]`);

  const [outputContent, setOutputContent] = useState('');
  const [options, setOptions] = useState<DockerfileFormatOptions>({
    instructionSorting: true,
    combineRunCommands: false,
    validateSyntax: true,
    checkBestPractices: true,
    preserveComments: true,
    multiStageDetection: true
  });

  const [validation, setValidation] = useState<{ valid: boolean; errors: string[]; warnings: string[]; suggestions: string[] }
  >({
    valid: true,
    errors: [],
    warnings: [],
    suggestions: []
  });

  // 解析 Dockerfile
  const parseDockerfile = useCallback((content: string) => {
    const lines = content.split('\n');
    const instructions: Array<{
      type: string;
      args: string;
      comment?: string;
      lineNumber: number;
      isMultiStage?: boolean;
      stageName?: string;
    }> = [];

    let currentComment = '';

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      if (!line) continue;

      // 处理注释
      if (line.startsWith('#')) {
        if (options.preserveComments) {
          currentComment = line;
        }
        continue;
      }

      // 解析指令
      const instructionMatch = line.match(/^([A-Z]+)\s+(.+)$/);
      if (instructionMatch) {
        const [, type, args] = instructionMatch;

        // 检测多阶段构建
        let isMultiStage = false;
        let stageName = '';
        if (type === 'FROM' && options.multiStageDetection) {
          const fromParts = args.split(' AS ');
          if (fromParts.length > 1) {
            isMultiStage = true;
            stageName = fromParts[1].trim();
          }
        }

        instructions.push({
          type,
          args: args.split(' AS ')[0].trim(), // 移除 AS 部分用于排序
          comment: currentComment,
          lineNumber: i + 1,
          isMultiStage,
          stageName
        });
        currentComment = '';
      }
    }

    return instructions;
  }, [options]);

  // 格式化 Dockerfile
  const formatDockerfile = useCallback((content: string, opts: DockerfileFormatOptions): FormatResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    const instructions = parseDockerfile(content);

    // 指令排序
    let sortedInstructions = [...instructions];
    if (opts.instructionSorting) {
      sortedInstructions.sort((a, b) => {
        const aIndex = DOCKERFILE_INSTRUCTION_ORDER.indexOf(a.type);
        const bIndex = DOCKERFILE_INSTRUCTION_ORDER.indexOf(b.type);
        return aIndex - bIndex;
      });
    }

    // 语法验证
    if (opts.validateSyntax) {
      validateDockerfileSyntax(instructions, errors, warnings);
    }

    // 最佳实践检查
    if (opts.checkBestPractices) {
      checkBestPractices(instructions, suggestions);
    }

    // 生成格式化内容
    const formattedLines: string[] = [];
    let currentStage = '';

    sortedInstructions.forEach((instruction, index) => {
      // 处理多阶段构建
      if (instruction.isMultiStage && instruction.stageName !== currentStage) {
        if (currentStage) {
          formattedLines.push(''); // 阶段间空行
        }
        currentStage = instruction.stageName || '';
      }

      // 添加注释
      if (instruction.comment && opts.preserveComments) {
        formattedLines.push(instruction.comment);
      }

      // 添加指令
      formattedLines.push(`${instruction.type} ${instruction.args}`);

      // 合并 RUN 命令（可选）
      if (opts.combineRunCommands && instruction.type === 'RUN' && index < sortedInstructions.length - 1) {
        const nextInstruction = sortedInstructions[index + 1];
        if (nextInstruction.type === 'RUN') {
          // 这里可以实现更复杂的 RUN 命令合并逻辑
          suggestions.push('考虑合并相邻的 RUN 命令以减少镜像层数');
        }
      }
    });

    return {
      content: formattedLines.join('\n'),
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }, [parseDockerfile]);

  // Dockerfile 语法验证
  const validateDockerfileSyntax = (instructions: any[], errors: string[], warnings: string[]) => {
    const instructionTypes = new Set(instructions.map(inst => inst.type));

    // 基础检查
    if (!instructionTypes.has('FROM')) {
      errors.push('Dockerfile 必须包含 FROM 指令');
    }

    // FROM 指令检查
    const fromInstructions = instructions.filter(inst => inst.type === 'FROM');
    if (fromInstructions.length === 0) {
      errors.push('缺少 FROM 指令');
    }

    // 检查重复的 FROM 指令（非多阶段构建）
    const nonMultiStageFrom = fromInstructions.filter(inst => !inst.isMultiStage);
    if (nonMultiStageFrom.length > 1) {
      warnings.push('检测到多个 FROM 指令，建议使用多阶段构建语法（FROM ... AS ...）');
    }

    // 指令顺序检查
    instructions.forEach((instruction, index) => {
      const currentIndex = DOCKERFILE_INSTRUCTION_ORDER.indexOf(instruction.type);

      // 检查后续指令是否在当前指令之前
      for (let i = index + 1; i < instructions.length; i++) {
        const nextInstruction = instructions[i];
        const nextIndex = DOCKERFILE_INSTRUCTION_ORDER.indexOf(nextInstruction.type);

        if (nextIndex !== -1 && currentIndex > nextIndex) {
          warnings.push(`第 ${instruction.lineNumber} 行的 ${instruction.type} 指令在第 ${nextInstruction.lineNumber} 行的 ${nextInstruction.type} 指令之后，可能影响构建效率`);
        }
      }
    });

    // 特定指令检查
    instructions.forEach(instruction => {
      if (instruction.type === 'EXPOSE') {
        const portMatch = instruction.args.match(/(\d+)/);
        if (portMatch) {
          const port = parseInt(portMatch[1]);
          if (port < 1 || port > 65535) {
            errors.push(`第 ${instruction.lineNumber} 行: 无效的端口号 ${port}`);
          }
        }
      }

      if (instruction.type === 'RUN' && instruction.args.includes('apt-get')) {
        if (!instruction.args.includes('apt-get clean') && !instruction.args.includes('rm -rf /var/lib/apt/lists/*')) {
          warnings.push(`第 ${instruction.lineNumber} 行: apt-get 命令后建议清理缓存`);
        }
      }
    });
  };

  // 最佳实践检查
  const checkBestPractices = (instructions: any[], suggestions: string[]) => {
    const instructionTypes = new Set(instructions.map(inst => inst.type));

    // 检查是否包含推荐指令
    if (!instructionTypes.has('EXPOSE')) {
      suggestions.push('建议添加 EXPOSE 指令声明容器端口');
    }

    if (!instructionTypes.has('WORKDIR')) {
      suggestions.push('建议添加 WORKDIR 指令设置工作目录');
    }

    // 检查 COPY 和 RUN 的顺序
    const copyInstructions = instructions.filter(inst => inst.type === 'COPY');
    const runInstructions = instructions.filter(inst => inst.type === 'RUN');

    if (copyInstructions.length > 0 && runInstructions.length > 0) {
      const firstCopyIndex = instructions.indexOf(copyInstructions[0]);
      const firstRunIndex = instructions.indexOf(runInstructions[0]);

      if (firstCopyIndex > firstRunIndex) {
        suggestions.push('建议将 COPY 指令放在 RUN 指令之前，以更好地利用构建缓存');
      }
    }

    // 检查是否使用了最新标签
    instructions.forEach(instruction => {
      if (instruction.type === 'FROM' && instruction.args.includes(':latest')) {
        suggestions.push('避免使用 :latest 标签，建议使用具体的版本号以确保构建的一致性');
      }
    });
  };

  // 格式化配置
  const formatConfig = useCallback(() => {
    if (!inputContent.trim()) {
      setOutputContent('');
      return;
    }

    const result = formatDockerfile(inputContent, options);
    setOutputContent(result.content);
    setValidation({
      valid: result.valid,
      errors: result.errors,
      warnings: result.warnings,
      suggestions: result.suggestions
    });
  }, [inputContent, options, formatDockerfile]);

  // 复制输出内容
  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(outputContent);
      alert('已复制到剪贴板');
    } catch (error) {
      alert('复制失败');
    }
  };

  // 下载Dockerfile
  const downloadDockerfile = () => {
    const blob = new Blob([outputContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Dockerfile';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 上传Dockerfile
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
    setValidation({ valid: true, errors: [], warnings: [], suggestions: [] });
  };

  // 加载示例
  const loadExample = () => {
    const example = `# 多阶段构建示例
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM node:18-alpine AS production

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 设置工作目录
WORKDIR /app

# 复制依赖和构建结果
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# 切换用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

# 启动应用
CMD ["node", "dist/index.js"]`;
    setInputContent(example);
  };

  // 自动格式化
  useEffect(() => {
    formatConfig();
  }, [inputContent, options]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 dark:from-gray-900 dark:via-blue-900 dark:to-cyan-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4"
          >
            Dockerfile 格式化器
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            专业的 Dockerfile 格式化工具，支持指令排序、语法校验和最佳实践建议
          </p>
        </motion.div>

        {/* 设置面板 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center"
            >
              <Settings className="w-5 h-5 mr-2" />
              格式化选项
            </h3>
            <div className="flex items-center space-x-4"
            >
              <button
                onClick={loadExample}
                className="flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                加载示例
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            <div className="flex items-center"
            >
              <input
                type="checkbox"
                id="instructionSorting"
                checked={options.instructionSorting}
                onChange={(e) => setOptions(prev => ({ ...prev, instructionSorting: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="instructionSorting" className="text-sm text-gray-700 dark:text-gray-300"
              >
                指令排序
              </label>
            </div>

            <div className="flex items-center"
            >
              <input
                type="checkbox"
                id="validateSyntax"
                checked={options.validateSyntax}
                onChange={(e) => setOptions(prev => ({ ...prev, validateSyntax: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="validateSyntax" className="text-sm text-gray-700 dark:text-gray-300"
              >
                语法校验
              </label>
            </div>

            <div className="flex items-center"
            >
              <input
                type="checkbox"
                id="checkBestPractices"
                checked={options.checkBestPractices}
                onChange={(e) => setOptions(prev => ({ ...prev, checkBestPractices: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="checkBestPractices" className="text-sm text-gray-700 dark:text-gray-300"
              >
                最佳实践
              </label>
            </div>

            <div className="flex items-center"
            >
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

            <div className="flex items-center"
            >
              <input
                type="checkbox"
                id="multiStageDetection"
                checked={options.multiStageDetection}
                onChange={(e) => setOptions(prev => ({ ...prev, multiStageDetection: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="multiStageDetection" className="text-sm text-gray-700 dark:text-gray-300"
              >
                多阶段检测
              </label>
            </div>

            <div className="flex items-center"
            >
              <input
                type="checkbox"
                id="combineRunCommands"
                checked={options.combineRunCommands}
                onChange={(e) => setOptions(prev => ({ ...prev, combineRunCommands: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="combineRunCommands" className="text-sm text-gray-700 dark:text-gray-300"
              >
                合并RUN
              </label>
            </div>
          </div>
        </motion.div>

        {/* 验证和建议结果 */}
        {(validation.errors.length > 0 || validation.warnings.length > 0 || validation.suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${
              validation.errors.length > 0 ? 'border-l-4 border-red-500' :
              validation.warnings.length > 0 ? 'border-l-4 border-yellow-500' : 'border-l-4 border-blue-500'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                validation.errors.length > 0 ? 'text-red-600 dark:text-red-400' :
                validation.warnings.length > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'
              }`}
              >
                {validation.errors.length > 0 ? <AlertCircle className="inline w-5 h-5 mr-2" /> : <AlertCircle className="inline w-5 h-5 mr-2" />}
                {validation.errors.length > 0 ? '错误' : validation.warnings.length > 0 ? '警告' : '建议'}
              </h3>
              <div className="space-y-2"
              >
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
                {validation.suggestions.map((suggestion, index) => (
                  <div key={index} className="text-blue-600 dark:text-blue-400 text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded"
                  >
                    💡 {suggestion}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 编辑器区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* 输入编辑器 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center"
              >
                <Code className="w-5 h-5 mr-2" />
                Dockerfile 内容
              </h3>

              <div className="flex items-center space-x-2"
              >
                {validation.valid ? (
                  <div className="flex items-center text-green-500"
                  >
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
                language="dockerfile"
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
                  accept="Dockerfile,Dockerfile.*"
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
                <Layers className="w-5 h-5 mr-2" />
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
                  onClick={downloadDockerfile}
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
                language="dockerfile"
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