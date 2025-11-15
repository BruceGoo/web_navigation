export interface Tool {
  id: number;
  name: string;
  description: string;
  category: 'json-tools' | 'yaml-xml-tools' | 'markdown-tools' | 'smart-tools' | 'config-formatter' | 'config-templates';
  icon: string;
  url: string;
  tags: string[];
  featured: boolean;
  gradient: string;
}

export const toolsData: Tool[] = [
  // JSON 工具
  {
    id: 1,
    name: "JSON格式化",
    description: "JSON数据美化、验证与压缩工具",
    category: "json-tools",
    icon: "📊",
    url: "/tools/json-formatter",
    tags: ["JSON", "格式化", "验证"],
    featured: true,
    gradient: "from-emerald-500 to-green-500"
  },
  {
    id: 2,
    name: "JSON压缩",
    description: "压缩JSON数据，移除多余空格和换行",
    category: "json-tools",
    icon: "🗜️",
    url: "/tools/json-minify",
    tags: ["JSON", "压缩", "优化"],
    featured: false,
    gradient: "from-green-600 to-emerald-600"
  },
  {
    id: 3,
    name: "JSON校验",
    description: "验证JSON格式，显示详细错误信息",
    category: "json-tools",
    icon: "✅",
    url: "/tools/json-validator",
    tags: ["JSON", "校验", "错误检查"],
    featured: true,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 4,
    name: "JSON对比",
    description: "对比两个JSON数据的差异",
    category: "json-tools",
    icon: "🔍",
    url: "/tools/json-diff",
    tags: ["JSON", "对比", "差异"],
    featured: true,
    gradient: "from-purple-500 to-indigo-500"
  },
  {
    id: 5,
    name: "JSON转YAML",
    description: "将JSON数据转换为YAML格式",
    category: "json-tools",
    icon: "🔄",
    url: "/tools/json-to-yaml",
    tags: ["JSON", "YAML", "转换"],
    featured: false,
    gradient: "from-indigo-500 to-blue-500"
  },

  // YAML/XML 工具
  {
    id: 6,
    name: "YAML格式化",
    description: "YAML数据美化和格式化工具",
    category: "yaml-xml-tools",
    icon: "📝",
    url: "/tools/yaml-formatter",
    tags: ["YAML", "格式化", "美化"],
    featured: true,
    gradient: "from-cyan-500 to-teal-500"
  },
  {
    id: 7,
    name: "YAML校验",
    description: "验证YAML格式，显示语法错误",
    category: "yaml-xml-tools",
    icon: "🔧",
    url: "/tools/yaml-validator",
    tags: ["YAML", "校验", "语法检查"],
    featured: false,
    gradient: "from-teal-600 to-cyan-600"
  },
  {
    id: 8,
    name: "YAML↔XML↔JSON",
    description: "YAML、XML、JSON格式互转工具",
    category: "yaml-xml-tools",
    icon: "🔄",
    url: "/tools/format-converter",
    tags: ["YAML", "XML", "JSON", "转换"],
    featured: true,
    gradient: "from-orange-500 to-amber-500"
  },
  {
    id: 9,
    name: "XML格式化",
    description: "XML数据美化和格式化工具",
    category: "yaml-xml-tools",
    icon: "📄",
    url: "/tools/xml-formatter",
    tags: ["XML", "格式化", "美化"],
    featured: false,
    gradient: "from-amber-600 to-orange-600"
  },
  {
    id: 10,
    name: "XML压缩",
    description: "压缩XML数据，移除多余空格",
    category: "yaml-xml-tools",
    icon: "🗜️",
    url: "/tools/xml-minify",
    tags: ["XML", "压缩", "优化"],
    featured: false,
    gradient: "from-yellow-600 to-amber-600"
  },
  {
    id: 11,
    name: "XML树结构",
    description: "XML数据树型结构可视化",
    category: "yaml-xml-tools",
    icon: "🌳",
    url: "/tools/xml-tree",
    tags: ["XML", "树结构", "可视化"],
    featured: true,
    gradient: "from-green-500 to-emerald-500"
  },

  // Markdown 工具
  {
    id: 12,
    name: "Markdown预览",
    description: "Markdown即时预览，左写右看",
    category: "markdown-tools",
    icon: "👁️",
    url: "/tools/markdown-preview",
    tags: ["Markdown", "预览", "编辑器"],
    featured: true,
    gradient: "from-blue-600 to-indigo-600"
  },
  {
    id: 13,
    name: "Markdown转HTML",
    description: "将Markdown转换为HTML代码",
    category: "markdown-tools",
    icon: "🔄",
    url: "/tools/markdown-to-html",
    tags: ["Markdown", "HTML", "转换"],
    featured: true,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: 14,
    name: "Markdown模板",
    description: "常用Markdown模板，快速开始写作",
    category: "markdown-tools",
    icon: "📋",
    url: "/tools/markdown-templates",
    tags: ["Markdown", "模板", "写作"],
    featured: false,
    gradient: "from-purple-600 to-pink-600"
  },

  // 智能工具
  {
    id: 15,
    name: "番茄钟",
    description: "高效专注工作法，25分钟工作+5分钟休息",
    category: "smart-tools",
    icon: "🍅",
    url: "/tools/pomodoro",
    tags: ["效率", "专注", "时间管理"],
    featured: true,
    gradient: "from-red-500 to-pink-500"
  },

  // 配置格式化工具
  {
    id: 16,
    name: "配置格式化器",
    description: "Nginx、Dockerfile、YAML等配置文件格式化和校验工具",
    category: "config-formatter",
    icon: "⚙️",
    url: "/tools/config-formatter",
    tags: ["配置", "格式化", "Nginx", "Dockerfile", "YAML"],
    featured: true,
    gradient: "from-purple-500 to-indigo-500"
  },
  {
    id: 17,
    name: "多格式配置转换",
    description: "JSON、YAML、TOML、INI、Properties等配置格式互转",
    category: "config-formatter",
    icon: "🔄",
    url: "/tools/config-formatter/multi-format",
    tags: ["JSON", "YAML", "TOML", "INI", "格式转换"],
    featured: true,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 18,
    name: "Nginx配置格式化",
    description: "Nginx配置文件格式化、语法检查和最佳实践建议",
    category: "config-formatter",
    icon: "🌐",
    url: "/tools/config-formatter/nginx",
    tags: ["Nginx", "配置", "格式化", "语法检查"],
    featured: true,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: 19,
    name: "Dockerfile格式化",
    description: "Dockerfile格式化、指令排序和最佳实践检查",
    category: "config-formatter",
    icon: "🐳",
    url: "/tools/config-formatter/dockerfile",
    tags: ["Dockerfile", "容器", "格式化", "最佳实践"],
    featured: false,
    gradient: "from-blue-600 to-blue-400"
  },
  {
    id: 20,
    name: "Kubernetes YAML工具",
    description: "Kubernetes YAML格式化、资源识别和Schema校验",
    category: "config-formatter",
    icon: "☸️",
    url: "/tools/config-formatter/kubernetes",
    tags: ["Kubernetes", "YAML", "K8s", "资源验证"],
    featured: true,
    gradient: "from-purple-500 to-indigo-500"
  },

  // 配置模板库
  {
    id: 21,
    name: "配置模板中心",
    description: "专业的配置文件模板库，包含Nginx、Docker、K8s等常用配置模板",
    category: "config-templates",
    icon: "📋",
    url: "/tools/config-templates",
    tags: ["模板", "配置", "Nginx", "Docker", "Kubernetes"],
    featured: true,
    gradient: "from-indigo-500 to-purple-500"
  },
];

export const categories = [
  { id: 'all', name: '全部', icon: '🌟' },
  { id: 'json-tools', name: 'JSON工具', icon: '📊' },
  { id: 'yaml-xml-tools', name: 'YAML/XML', icon: '📝' },
  { id: 'markdown-tools', name: 'Markdown', icon: '📝' },
  { id: 'smart-tools', name: '智能工具', icon: '🛠️' },
  { id: 'config-formatter', name: '配置格式化', icon: '⚙️' },
  { id: 'config-templates', name: '配置模板', icon: '📋' },
] as const;
