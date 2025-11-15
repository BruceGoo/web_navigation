'use client';

import { useState, useCallback, useEffect } from 'react';
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
  Box,
  Network,
  Lock
} from 'lucide-react';
import * as yaml from 'js-yaml';

interface K8sResource {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace?: string;
    labels?: Record<string, string>;
  };
  spec?: any;
}

interface K8sFormatOptions {
  validateSchema: boolean;
  checkRequiredFields: boolean;
  formatResources: boolean;
  detectResourceType: boolean;
  validateMetadata: boolean;
  checkApiVersion: boolean;
}

interface FormatResult {
  content: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
  resourceType?: string;
  resourceName?: string;
}

const SUPPORTED_RESOURCES = [
  'Deployment', 'Service', 'Ingress', 'ConfigMap', 'Secret',
  'DaemonSet', 'StatefulSet', 'Job', 'CronJob', 'Pod',
  'PersistentVolume', 'PersistentVolumeClaim', 'Namespace',
  'Role', 'RoleBinding', 'ClusterRole', 'ClusterRoleBinding'
];

// API 版本映射
const API_VERSIONS = {
  'Deployment': 'apps/v1',
  'Service': 'v1',
  'Ingress': 'networking.k8s.io/v1',
  'ConfigMap': 'v1',
  'Secret': 'v1',
  'DaemonSet': 'apps/v1',
  'StatefulSet': 'apps/v1',
  'Job': 'batch/v1',
  'CronJob': 'batch/v1',
  'Pod': 'v1',
  'PersistentVolume': 'v1',
  'PersistentVolumeClaim': 'v1',
  'Namespace': 'v1',
  'Role': 'rbac.authorization.k8s.io/v1',
  'RoleBinding': 'rbac.authorization.k8s.io/v1',
  'ClusterRole': 'rbac.authorization.k8s.io/v1',
  'ClusterRoleBinding': 'rbac.authorization.k8s.io/v1'
};

// 必填字段映射
const REQUIRED_FIELDS = {
  'Deployment': ['apiVersion', 'kind', 'metadata', 'spec'],
  'Service': ['apiVersion', 'kind', 'metadata', 'spec'],
  'Ingress': ['apiVersion', 'kind', 'metadata', 'spec'],
  'ConfigMap': ['apiVersion', 'kind', 'metadata'],
  'Secret': ['apiVersion', 'kind', 'metadata'],
  'DaemonSet': ['apiVersion', 'kind', 'metadata', 'spec'],
  'StatefulSet': ['apiVersion', 'kind', 'metadata', 'spec'],
  'Job': ['apiVersion', 'kind', 'metadata', 'spec'],
  'CronJob': ['apiVersion', 'kind', 'metadata', 'spec'],
  'Pod': ['apiVersion', 'kind', 'metadata', 'spec']
};

export default function KubernetesConfigFormatter() {
  const [inputContent, setInputContent] = useState(`apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: "default"
  labels:
    app: "nginx"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: "nginx"
  template:
    metadata:
      labels:
        app: "nginx"
    spec:
      containers:
      - name: nginx
        image: "nginx:1.21"
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
          requests:
            memory: "64Mi"
            cpu: "250m"`);

  const [outputContent, setOutputContent] = useState('');
  const [options, setOptions] = useState<K8sFormatOptions>({
    validateSchema: true,
    checkRequiredFields: true,
    formatResources: true,
    detectResourceType: true,
    validateMetadata: true,
    checkApiVersion: true
  });

  const [validation, setValidation] = useState<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    resourceType?: string;
    resourceName?: string;
  }>({
    valid: true,
    errors: [],
    warnings: []
  });

  const parseYamlContent = useCallback((yamlContent: string): { resources: K8sResource[]; parseErrors: string[] } => {
    try {
      const documents = yamlContent.split('---').map(doc => doc.trim()).filter(doc => doc);
      const resources: K8sResource[] = [];
      const parseErrors: string[] = [];

      documents.forEach((doc, index) => {
        try {
          const resource = yaml.load(doc) as K8sResource;
          if (resource) {
            resources.push(resource);
          }
        } catch (error) {
          parseErrors.push(`文档 ${index + 1}: ${error instanceof Error ? error.message : '解析错误'}`);
        }
      });

      return { resources, parseErrors };
    } catch (error) {
      return { resources: [], parseErrors: ['YAML 格式错误'] };
    }
  }, []);

  const validateResource = useCallback((resource: K8sResource, options: K8sFormatOptions): { errors: string[]; warnings: string[] } => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const resourceType = resource.kind;

    // 检查 API 版本
    if (options.checkApiVersion) {
      const expectedApiVersion = API_VERSIONS[resourceType as keyof typeof API_VERSIONS];
      if (expectedApiVersion && resource.apiVersion !== expectedApiVersion) {
        warnings.push(`${resourceType} ${resource.metadata.name}: API 版本建议为 ${expectedApiVersion}，当前为 ${resource.apiVersion}`);
      }
    }

    // 检查必填字段
    if (options.checkRequiredFields) {
      const requiredFields = REQUIRED_FIELDS[resourceType as keyof typeof REQUIRED_FIELDS];
      if (requiredFields) {
        requiredFields.forEach(field => {
          if (!resource[field as keyof K8sResource]) {
            errors.push(`${resourceType} ${resource.metadata.name}: 缺少必填字段 ${field}`);
          }
        });
      }
    }

    // 检查 metadata
    if (options.validateMetadata) {
      if (!resource.metadata.name) {
        errors.push(`${resourceType}: metadata.name 是必填字段`);
      }

      // 检查标签格式
      if (resource.metadata.labels) {
        Object.entries(resource.metadata.labels).forEach(([key, value]) => {
          if (!/^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/.test(key)) {
            warnings.push(`${resourceType} ${resource.metadata.name}: 标签键 ${key} 格式不符合规范`);
          }
          if (value && !/^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/.test(value)) {
            warnings.push(`${resourceType} ${resource.metadata.name}: 标签值 ${value} 格式不符合规范`);
          }
        });
      }
    }

    // 资源类型特定验证
    switch (resourceType) {
      case 'Deployment':
        if (resource.spec) {
          if (!resource.spec.selector?.matchLabels) {
            errors.push(`Deployment ${resource.metadata.name}: spec.selector.matchLabels 是必填字段`);
          }
          if (!resource.spec.template) {
            errors.push(`Deployment ${resource.metadata.name}: spec.template 是必填字段`);
          }
          if (resource.spec.replicas !== undefined && (resource.spec.replicas < 0 || resource.spec.replicas > 100)) {
            warnings.push(`Deployment ${resource.metadata.name}: replicas 数量异常（${resource.spec.replicas}）`);
          }
        }
        break;

      case 'Service':
        if (resource.spec) {
          if (!resource.spec.selector) {
            warnings.push(`Service ${resource.metadata.name}: spec.selector 为空，可能无法匹配 Pod`);
          }
          if (resource.spec.type === 'NodePort' && resource.spec.ports) {
            resource.spec.ports.forEach((port: any, idx: number) => {
              if (port.nodePort && (port.nodePort < 30000 || port.nodePort > 32767)) {
                warnings.push(`Service ${resource.metadata.name}: 端口 ${idx} 的 nodePort ${port.nodePort} 不在有效范围内（30000-32767）`);
              }
            });
          }
        }
        break;

      case 'Ingress':
        if (resource.spec) {
          if (!resource.spec.rules && !resource.spec.defaultBackend) {
            errors.push(`Ingress ${resource.metadata.name}: spec.rules 或 spec.defaultBackend 至少需要一个`);
          }
        }
        break;

      case 'Job':
        if (resource.spec) {
          if (resource.spec.completions !== undefined && resource.spec.completions <= 0) {
            warnings.push(`Job ${resource.metadata.name}: spec.completions 应该大于 0`);
          }
        }
        break;

      case 'CronJob':
        if (resource.spec) {
          if (resource.spec.schedule) {
            // 简单的 cron 表达式验证
            const cronPattern = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-1])|[*\/[0-9]+)\s+(\*|([0-9]|1[0-9]|2[0-3])|[*\/[0-9]+)\s+(\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|[*\/[0-9]+|[LWC])\s+(\*|([1-9]|1[0-2])|[*\/[0-9]+)\s+(\*|([0-6])|[*\/[0-9]+|[LWC#])$/;
            if (!cronPattern.test(resource.spec.schedule)) {
              warnings.push(`CronJob ${resource.metadata.name}: cron 表达式格式可能不正确`);
            }
          }
        }
        break;
    }

    return { errors, warnings };
  }, []);

  const formatConfig = useCallback((content: string, opts: K8sFormatOptions): FormatResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    let resourceType = '';
    let resourceName = '';

    // 解析YAML内容
    const { resources, parseErrors } = parseYamlContent(content);
    errors.push(...parseErrors);

    if (resources.length > 0) {
      const resource = resources[0];
      resourceType = resource.kind;
      resourceName = resource.metadata.name;

      if (opts.detectResourceType) {
        // 资源类型检测已在验证中完成
      }

      if (opts.validateSchema) {
        resources.forEach(resource => {
          const validation = validateResource(resource, opts);
          errors.push(...validation.errors);
          warnings.push(...validation.warnings);
        });
      }
    }

    // 格式化输出
    let formattedContent = content;
    if (opts.formatResources && resources.length > 0) {
      try {
        formattedContent = resources.map(resource =>
          yaml.dump(resource, {
            indent: 2,
            lineWidth: -1,
            noRefs: true,
            sortKeys: false
          })
        ).join('---\n');
      } catch (error) {
        errors.push(`格式化错误: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }

    return {
      content: formattedContent,
      valid: errors.length === 0,
      errors,
      warnings,
      resourceType,
      resourceName
    };
  }, [parseYamlContent, validateResource]);

  // 复制输出内容
  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(outputContent);
      alert('已复制到剪贴板');
    } catch (error) {
      alert('复制失败');
    }
  };

  // 下载YAML文件
  const downloadYaml = () => {
    const blob = new Blob([outputContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${validation.resourceName || 'kubernetes'}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 上传YAML文件
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
    const examples = {
      deployment: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: "default"
  labels:
    app: "nginx"
    environment: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: "nginx"
  template:
    metadata:
      labels:
        app: "nginx"
    spec:
      containers:
      - name: nginx
        image: "nginx:1.21"
        ports:
        - containerPort: 80
          name: http
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
          requests:
            memory: "64Mi"
            cpu: "250m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5`,

      service: `apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: "default"
  labels:
    app: "nginx"
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
    name: http
  selector:
    app: "nginx"`,

      ingress: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-ingress
  namespace: "default"
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-service
            port:
              number: 80`
    };

    setInputContent(examples.deployment);
  };

  // 自动格式化
  useEffect(() => {
    if (inputContent) {
      const result = formatConfig(inputContent, options);
      setOutputContent(result.content);
      setValidation({
        valid: result.valid,
        errors: result.errors,
        warnings: result.warnings,
        resourceType: result.resourceType,
        resourceName: result.resourceName
      });
    }
  }, [inputContent, options, formatConfig]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Kubernetes 配置格式化器
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            专业的 Kubernetes YAML 配置文件格式化和验证工具，支持多种资源类型校验
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
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              格式化选项
            </h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadExample}
                className="flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
              >
                <Box className="w-4 h-4 mr-2" />
                加载示例
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="validateSchema"
                checked={options.validateSchema}
                onChange={(e) => setOptions(prev => ({ ...prev, validateSchema: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="validateSchema" className="text-sm text-gray-700 dark:text-gray-300">
                Schema 校验
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="checkRequiredFields"
                checked={options.checkRequiredFields}
                onChange={(e) => setOptions(prev => ({ ...prev, checkRequiredFields: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="checkRequiredFields" className="text-sm text-gray-700 dark:text-gray-300">
                必填字段
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="formatResources"
                checked={options.formatResources}
                onChange={(e) => setOptions(prev => ({ ...prev, formatResources: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="formatResources" className="text-sm text-gray-700 dark:text-gray-300">
                格式化
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="detectResourceType"
                checked={options.detectResourceType}
                onChange={(e) => setOptions(prev => ({ ...prev, detectResourceType: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="detectResourceType" className="text-sm text-gray-700 dark:text-gray-300">
                资源识别
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="validateMetadata"
                checked={options.validateMetadata}
                onChange={(e) => setOptions(prev => ({ ...prev, validateMetadata: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="validateMetadata" className="text-sm text-gray-700 dark:text-gray-300">
                Metadata 校验
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="checkApiVersion"
                checked={options.checkApiVersion}
                onChange={(e) => setOptions(prev => ({ ...prev, checkApiVersion: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="checkApiVersion" className="text-sm text-gray-700 dark:text-gray-300">
                API 版本
              </label>
            </div>
          </div>
        </motion.div>

        {/* 资源类型显示 */}
        {validation.resourceType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Box className="w-6 h-6 mr-3 text-blue-500" />
                <div>
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    检测到资源类型: {validation.resourceType}
                  </span>
                  {validation.resourceName && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      资源名称: {validation.resourceName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {validation.valid ? (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="w-5 h-5 mr-1" />
                    <span className="text-sm">配置有效</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500">
                    <AlertCircle className="w-5 h-5 mr-1" />
                    <span className="text-sm">配置有误</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

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
                  <div key={index} className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    {error}
                  </div>
                ))}
                {validation.warnings.map((warning, index) => (
                  <div key={index} className="text-yellow-600 dark:text-yellow-400 text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
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
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <Box className="w-5 h-5 mr-2" />
                输入配置
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
                    <span className="text-sm">有错误</span>
                  </div>
                )}
              </div>
            </div>

            <div className="h-96 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <Editor
                height="100%"
                language="yaml"
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
                  accept=".yaml,.yml"
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <Network className="w-5 h-5 mr-2" />
                格式化结果
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
                  onClick={downloadYaml}
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
                language="yaml"
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