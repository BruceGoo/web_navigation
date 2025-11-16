'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Copy, Download, Search, Filter, Star, BookOpen, Code, FileText, CheckCircle, Home, ChevronRight } from 'lucide-react';

interface ConfigTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  content: string;
  language: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popularity: number;
  isFavorite: boolean;
}

const configTemplates: ConfigTemplate[] = [
  // Nginx 模板
  {
    id: 'nginx-static-site',
    name: '静态网站托管',
    description: '适用于 Vue/React 单页应用的 Nginx 配置，支持前端路由',
    category: 'nginx',
    subcategory: 'static-site',
    language: 'nginx',
    difficulty: 'beginner',
    popularity: 95,
    isFavorite: false,
    tags: ['静态网站', 'SPA', '前端路由', 'history-mode'],
    content: `server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    index index.html;

    # 前端路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}`
  },
  {
    id: 'nginx-reverse-proxy',
    name: '反向代理配置',
    description: '将请求转发到后端服务的标准反向代理配置',
    category: 'nginx',
    subcategory: 'reverse-proxy',
    language: 'nginx',
    difficulty: 'intermediate',
    popularity: 88,
    isFavorite: true,
    tags: ['反向代理', '负载均衡', '后端服务', 'proxy_pass'],
    content: `upstream backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001 backup;
    keepalive 32;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}`
  },
  {
    id: 'nginx-ssl-https',
    name: 'HTTPS SSL 配置',
    description: '完整的 HTTPS 配置，包含 SSL 优化和安全头设置',
    category: 'nginx',
    subcategory: 'ssl-https',
    language: 'nginx',
    difficulty: 'intermediate',
    popularity: 92,
    isFavorite: false,
    tags: ['HTTPS', 'SSL', '安全', '证书', 'TLS'],
    content: `# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;

    # SSL 证书
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;

    # SSL 安全设置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    location / {
        root /var/www/html;
        index index.html;
    }
}`
  },

  // Dockerfile 模板
  {
    id: 'dockerfile-node-basic',
    name: 'Node.js 基础镜像',
    description: 'Node.js 应用的基础 Dockerfile，适合开发和测试环境',
    category: 'dockerfile',
    subcategory: 'node-basic',
    language: 'dockerfile',
    difficulty: 'beginner',
    popularity: 89,
    isFavorite: true,
    tags: ['Node.js', 'JavaScript', '基础镜像', '开发环境'],
    content: `FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制包管理文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 更改文件所有权
RUN chown -R nextjs:nodejs /app
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["npm", "start"]`
  },

  // Kubernetes 模板
  {
    id: 'k8s-deployment-basic',
    name: '基础 Deployment',
    description: 'Kubernetes 基础 Deployment 配置，包含副本、选择器和模板',
    category: 'kubernetes',
    subcategory: 'deployment',
    language: 'yaml',
    difficulty: 'beginner',
    popularity: 91,
    isFavorite: true,
    tags: ['Kubernetes', 'Deployment', 'Pod', '副本管理'],
    content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
  namespace: default
  labels:
    app: myapp
    environment: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        version: v1
    spec:
      containers:
      - name: app
        image: myapp:1.0.0
        ports:
        - containerPort: 8080
          name: http
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5`
  }
];

// 分类配置
const categories = [
  { id: 'all', name: '全部模板', icon: '📚', count: configTemplates.length },
  { id: 'nginx', name: 'Nginx 配置', icon: '🌐', count: configTemplates.filter(t => t.category === 'nginx').length },
  { id: 'dockerfile', name: 'Dockerfile', icon: '🐳', count: configTemplates.filter(t => t.category === 'dockerfile').length },
  { id: 'kubernetes', name: 'Kubernetes', icon: '☸️', count: configTemplates.filter(t => t.category === 'kubernetes').length }
];

export default function ConfigTemplates() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 过滤模板
  const filteredTemplates = configTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;

    return matchesCategory && matchesSearch && matchesDifficulty;
  });

  // 复制模板内容
  const copyTemplate = async (template: ConfigTemplate) => {
    try {
      await navigator.clipboard.writeText(template.content);
      setCopiedId(template.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      alert('复制失败');
    }
  };

  // 下载模板文件
  const downloadTemplate = (template: ConfigTemplate) => {
    const filename = getFilename(template);
    const blob = new Blob([template.content], { type: getFileMimeType(template.language) });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 获取文件名
  const getFilename = (template: ConfigTemplate): string => {
    const name = template.name.toLowerCase().replace(/\s+/g, '-');
    switch (template.language) {
      case 'nginx': return `${name}.conf`;
      case 'dockerfile': return 'Dockerfile';
      case 'yaml': return `${name}.yaml`;
      case 'javascript': return `${name}.js`;
      default: return `${name}.txt`;
    }
  };

  // 获取文件 MIME 类型
  const getFileMimeType = (language: string): string => {
    switch (language) {
      case 'nginx': return 'text/plain';
      case 'dockerfile': return 'text/plain';
      case 'yaml': return 'text/yaml';
      case 'javascript': return 'text/javascript';
      default: return 'text/plain';
    }
  };

  // 切换收藏状态
  const toggleFavorite = (templateId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
  };

  // 获取难度标签样式
  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            配置模板中心
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            专业的配置文件模板库，包含 Nginx、Dockerfile、Kubernetes 等常用配置模板，一键复制使用
          </p>
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
          <span className="text-gray-900 dark:text-gray-100">配置模板中心</span>
        </motion.div>

        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/tools"
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
            返回工具中心
          </Link>
        </motion.div>
        </motion.div>

        {/* 搜索和过滤 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索模板名称、描述或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">所有难度</option>
              <option value="beginner">初级</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>
          </div>

          {/* 分类标签 */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 模板网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* 模板头部 */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">
                      {template.category === 'nginx' ? '🌐' :
                        template.category === 'dockerfile' ? '🐳' :
                        template.category === 'kubernetes' ? '☸️' : '📦'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(template.id)}
                    className={`p-2 rounded-full transition-colors ${
                      favorites.has(template.id)
                        ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20'
                        : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/20'
                    }`}
                  >
                    <Star className="w-5 h-5" fill={favorites.has(template.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* 标签和难度 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-wrap gap-2">
                    {template.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyStyle(template.difficulty)}`}>
                    {template.difficulty === 'beginner' ? '初级' :
                      template.difficulty === 'intermediate' ? '中级' : '高级'}
                  </span>
                </div>

                {/* 代码预览 */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    代码预览
                  </label>
                  <pre className="bg-gray-900 text-gray-300 p-3 rounded-lg text-xs overflow-x-auto max-h-32">
                    <code>{template.content.substring(0, 300)}
                      {template.content.length > 300 && '...'}
                    </code>
                  </pre>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => copyTemplate(template)}
                      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                        copiedId === template.id
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {copiedId === template.id ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          复制
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => downloadTemplate(template)}
                      className="flex items-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载
                    </button>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      📊 热度: {template.popularity}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 空状态 */}
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              未找到匹配的模板
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              尝试调整搜索条件或浏览其他分类
            </p>
          </motion.div>
        )}

        {/* 底部说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              💡 使用提示
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center justify-center">
                <Code className="w-5 h-5 mr-2 text-blue-500" />
                一键复制配置文件
              </div>
              <div className="flex items-center justify-center">
                <FileText className="w-5 h-5 mr-2 text-green-500" />
                直接下载配置文件
              </div>
              <div className="flex items-center justify-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                收藏常用模板
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}