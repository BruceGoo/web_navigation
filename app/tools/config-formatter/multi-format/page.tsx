'use client';

import { useState, useEffect, useCallback } from "react";;
import { motion } from 'framer-motion';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import {
  ArrowLeftRight,
  Copy,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Home,
  ChevronRight
} from 'lucide-react';
import yaml from 'js-yaml';
import ini from 'ini';

type ConfigFormat = 'json' | 'yaml' | 'toml' | 'ini' | 'properties';

interface FormatResult {
  content: string;
  valid: boolean;
  error?: string;
  lineNumber?: number;
}

const formatOptions: { value: ConfigFormat; label: string; icon: string }[] = [
  { value: 'json', label: 'JSON', icon: '📄' },
  { value: 'yaml', label: 'YAML', icon: '📝' },
  { value: 'toml', label: 'TOML', icon: '⚙️' },
  { value: 'ini', label: 'INI', icon: '📋' },
  { value: 'properties', label: 'Properties', icon: '🔧' }
];

export default function MultiFormatConverter() {
  const [inputContent, setInputContent] = useState('');
  const [outputContent, setOutputContent] = useState('');
  const [inputFormat, setInputFormat] = useState<ConfigFormat>('json');
  const [outputFormat, setOutputFormat] = useState<ConfigFormat>('yaml');
  const [validation, setValidation] = useState<{ valid: boolean; error?: string }>({ valid: true });

  // 验证输入格式
  const validateContent = useCallback((content: string, format: ConfigFormat): { valid: boolean; error?: string } => {
    if (!content.trim()) return { valid: true };

    try {
      switch (format) {
        case 'json':
          JSON.parse(content);
          return { valid: true };
        case 'yaml':
          yaml.load(content);
          return { valid: true };
        case 'toml':
          // 基础TOML验证
          const tomlLines = content.split('\n');
          for (let i = 0; i < tomlLines.length; i++) {
            const line = tomlLines[i].trim();
            if (line && !line.startsWith('#') && !line.startsWith('[') && !line.includes('=')) {
              return { valid: false, error: `第 ${i + 1} 行: TOML格式错误` };
            }
          }
          return { valid: true };
        case 'ini':
          ini.parse(content);
          return { valid: true };
        case 'properties':
          // Properties文件基础验证
          const lines = content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && !line.startsWith('#') && !line.startsWith('!') && !line.includes('=')) {
              return { valid: false, error: `第 ${i + 1} 行: Properties格式错误` };
            }
          }
          return { valid: true };
        default:
          return { valid: true };
      }
    } catch (error) {
      return { valid: false, error: error instanceof Error ? error.message : '格式错误' };
    }
  }, []);

  // 转换格式
  const convertFormat = useCallback(() => {
    if (!inputContent.trim()) {
      setOutputContent('');
      return;
    }

    try {
      let intermediate: any;

      // 解析输入格式
      switch (inputFormat) {
        case 'json':
          intermediate = JSON.parse(inputContent);
          break;
        case 'yaml':
          intermediate = yaml.load(inputContent);
          break;
        case 'toml':
          // 简化的TOML到对象转换
          intermediate = parseTomlToObject(inputContent);
          break;
        case 'ini':
          intermediate = ini.parse(inputContent);
          break;
        case 'properties':
          intermediate = parsePropertiesToObject(inputContent);
          break;
      }

      // 转换为目标格式
      let output = '';
      switch (outputFormat) {
        case 'json':
          output = JSON.stringify(intermediate, null, 2);
          break;
        case 'yaml':
          output = yaml.dump(intermediate, { indent: 2 });
          break;
        case 'toml':
          output = convertToToml(intermediate);
          break;
        case 'ini':
          output = ini.stringify(intermediate);
          break;
        case 'properties':
          output = convertToProperties(intermediate);
          break;
      }

      setOutputContent(output);
    } catch (error) {
      setOutputContent(`转换错误: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }, [inputContent, inputFormat, outputFormat]);

  // 简化的TOML解析
  const parseTomlToObject = (toml: string): any => {
    const result: any = {};
    const lines = toml.split('\n');
    let currentSection = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        currentSection = trimmed.slice(1, -1);
        result[currentSection] = {};
      } else if (trimmed.includes('=')) {
        const [key, value] = trimmed.split('=').map(s => s.trim());
        const parsedValue = parseValue(value);

        if (currentSection) {
          result[currentSection][key] = parsedValue;
        } else {
          result[key] = parsedValue;
        }
      }
    }
    return result;
  };

  // 简化的Properties解析
  const parsePropertiesToObject = (properties: string): any => {
    const result: any = {};
    const lines = properties.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) continue;

      const equalIndex = trimmed.indexOf('=');
      if (equalIndex !== -1) {
        const key = trimmed.substring(0, equalIndex).trim();
        const value = trimmed.substring(equalIndex + 1).trim();
        result[key] = parseValue(value);
      }
    }
    return result;
  };

  // 值解析
  const parseValue = (value: string): any => {
    value = value.trim();
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null' || value === 'undefined') return null;
    if (/^-?\d+$/.test(value)) return parseInt(value);
    if (/^-?\d*\.\d+$/.test(value)) return parseFloat(value);
    if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
    return value;
  };

  // 转换为TOML
  const convertToToml = (obj: any, indent = 0): string => {
    let result = '';
    const spaces = '  '.repeat(indent);

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (indent === 0) {
          result += `\n[${key}]\n`;
          result += convertToToml(value, indent + 1);
        } else {
          result += `${spaces}${key} = {\n`;
          result += convertToToml(value, indent + 1);
          result += `${spaces}}\n`;
        }
      } else {
        result += `${spaces}${key} = ${formatTomlValue(value)}\n`;
      }
    }
    return result;
  };

  // 转换为Properties
  const convertToProperties = (obj: any): string => {
    const result: string[] = [];

    const flatten = (obj: any, prefix = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          flatten(value, fullKey);
        } else {
          result.push(`${fullKey}=${formatPropertiesValue(value)}`);
        }
      }
    };

    flatten(obj);
    return result.join('\n');
  };

  // 格式化TOML值
  const formatTomlValue = (value: any): string => {
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();
    if (value === null) return 'null';
    if (Array.isArray(value)) return `[${value.map(formatTomlValue).join(', ')}]`;
    return `"${String(value)}"`;
  };

  // 格式化Properties值
  const formatPropertiesValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' && (value.includes(' ') || value.includes('='))) {
      return value;
    }
    return String(value);
  };

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setInputContent(value);
    const validation = validateContent(value, inputFormat);
    setValidation(validation);
  };

  // 复制输出内容
  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(outputContent);
      alert('已复制到剪贴板');
    } catch (error) {
      alert('复制失败');
    }
  };

  // 下载输出文件
  const downloadOutput = () => {
    const blob = new Blob([outputContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `output.${outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 上传文件
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
    setValidation({ valid: true });
  };

  // 交换输入输出格式
  const swapFormats = () => {
    const temp = inputFormat;
    setInputFormat(outputFormat);
    setOutputFormat(temp);
    const tempContent = inputContent;
    setInputContent(outputContent);
    setOutputContent(tempContent);
  };

  // 自动转换
  useEffect(() => {
    if (inputContent.trim()) {
      convertFormat();
    }
  }, [inputContent, inputFormat, outputFormat]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-900 dark:to-cyan-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4"
        >
          <Link href="/" className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Home className="w-4 h-4 mr-1" />
            主页
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/tools/config-formatter" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            配置格式化器
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-gray-100">多格式转换器</span>
        </motion.div>

        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/tools/config-formatter"
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
            返回配置格式化器
          </Link>
        </motion.div>
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            多格式配置转换器
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            支持 JSON、YAML、TOML、INI、Properties 等配置格式的互相转换和格式化
          </p>
        </motion.div>

        {/* 格式选择器 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              格式转换设置
            </h3>
            <button
              onClick={swapFormats}
              className="flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              交换格式
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                输入格式
              </label>
              <select
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value as ConfigFormat)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {formatOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                输出格式
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as ConfigFormat)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {formatOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* 编辑器区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入编辑器 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                输入配置内容
              </h3>
              <div className="flex items-center space-x-2">
                {validation.valid ? (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="w-5 h-5 mr-1" />
                    <span className="text-sm">格式正确</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500">
                    <AlertCircle className="w-5 h-5 mr-1" />
                    <span className="text-sm">{validation.error}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="h-96 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <Editor
                height="100%"
                language={inputFormat}
                value={inputContent}
                onChange={(value) => handleInputChange(value || '')}
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

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
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
                  accept=".json,.yaml,.yml,.toml,.ini,.properties"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <button
                onClick={clearContent}
                className="flex items-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
  Home,
  ChevronRight
                清空
              </button>
            </div>
          </motion.div>

          {/* 输出编辑器 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                转换结果
              </h3>

              <div className="flex items-center space-x-2">
                <button
                  onClick={copyOutput}
                  className="flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </button>
                <button
                  onClick={downloadOutput}
                  className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载
                </button>
              </div>
            </div>

            <div className="h-96 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <Editor
                height="100%"
                language={outputFormat}
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