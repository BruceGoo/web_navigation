export interface Tool {
  id: number;
  name: string;
  description: string;
  category: 'all' | 'ai-creative' | 'fashion-life' | 'fun-games' | 'smart-tools';
  icon: string;
  url: string;
  tags: string[];
  featured: boolean;
  gradient: string;
}

export const toolsData: Tool[] = [
  // AI 创意工具
  {
    id: 1,
    name: "AI图片编辑器",
    description: "基于AI的智能图片处理工具，轻松实现专业级修图",
    category: "ai-creative",
    icon: "🎨",
    url: "/tools/ai-image-editor",
    tags: ["AI", "图像处理", "Next.js", "Vercel"],
    featured: true,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    name: "AI文案生成器",
    description: "智能创作助手，助力内容创作与营销文案",
    category: "ai-creative",
    icon: "✍️",
    url: "/tools/ai-writer",
    tags: ["AI", "文案", "创作"],
    featured: true,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    name: "AI头像生成",
    description: "个性化AI头像制作，打造独特的数字身份",
    category: "ai-creative",
    icon: "🤖",
    url: "/tools/ai-avatar",
    tags: ["AI", "头像", "设计"],
    featured: false,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: 4,
    name: "AI音乐创作",
    description: "AI驱动的音乐创作平台，人人都是音乐家",
    category: "ai-creative",
    icon: "🎵",
    url: "/tools/ai-music",
    tags: ["AI", "音乐", "创作"],
    featured: true,
    gradient: "from-pink-500 to-rose-500"
  },
  {
    id: 5,
    name: "AI视频制作",
    description: "智能视频编辑与生成，让创意更简单",
    category: "ai-creative",
    icon: "🎬",
    url: "/tools/ai-video",
    tags: ["AI", "视频", "编辑"],
    featured: false,
    gradient: "from-violet-500 to-purple-500"
  },
  {
    id: 6,
    name: "AI设计助手",
    description: "智能UI/UX设计工具，提升设计效率",
    category: "ai-creative",
    icon: "💎",
    url: "/tools/ai-design",
    tags: ["AI", "设计", "UI/UX"],
    featured: false,
    gradient: "from-cyan-500 to-blue-500"
  },

  // 时尚生活
  {
    id: 7,
    name: "时尚搭配师",
    description: "AI驱动的服装搭配推荐，引领时尚潮流",
    category: "fashion-life",
    icon: "👗",
    url: "/tools/style-advisor",
    tags: ["时尚", "搭配", "AI"],
    featured: true,
    gradient: "from-rose-500 to-pink-500"
  },
  {
    id: 8,
    name: "美食探店",
    description: "智能餐厅推荐，发现城市美食新体验",
    category: "fashion-life",
    icon: "🍽️",
    url: "/tools/food-explorer",
    tags: ["美食", "推荐", "生活"],
    featured: false,
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: 9,
    name: "旅行规划师",
    description: "个性化旅行路线规划，打造完美旅程",
    category: "fashion-life",
    icon: "✈️",
    url: "/tools/travel-planner",
    tags: ["旅行", "规划", "生活"],
    featured: true,
    gradient: "from-sky-500 to-blue-500"
  },
  {
    id: 10,
    name: "健身计划",
    description: "定制化健身方案，科学健康生活",
    category: "fashion-life",
    icon: "💪",
    url: "/tools/fitness",
    tags: ["健身", "健康", "生活"],
    featured: false,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: 11,
    name: "家居装修",
    description: "3D家居设计工具，打造梦想空间",
    category: "fashion-life",
    icon: "🏠",
    url: "/tools/home-design",
    tags: ["装修", "设计", "家居"],
    featured: false,
    gradient: "from-amber-500 to-orange-500"
  },
  {
    id: 12,
    name: "护肤顾问",
    description: "AI皮肤分析，定制专属护肤方案",
    category: "fashion-life",
    icon: "💄",
    url: "/tools/skincare",
    tags: ["护肤", "美容", "AI"],
    featured: true,
    gradient: "from-pink-500 to-purple-500"
  },

  // 趣味游戏
  {
    id: 13,
    name: "数字华容道",
    description: "经典益智游戏，挑战你的逻辑思维",
    category: "fun-games",
    icon: "🧩",
    url: "/games/slide-puzzle",
    tags: ["益智", "游戏", "逻辑"],
    featured: true,
    gradient: "from-purple-500 to-indigo-500"
  },
  {
    id: 14,
    name: "音乐节拍",
    description: "跟随音乐节拍，释放你的节奏感",
    category: "fun-games",
    icon: "🥁",
    url: "/games/rhythm-game",
    tags: ["音乐", "游戏", "节奏"],
    featured: false,
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    id: 15,
    name: "记忆翻牌",
    description: "考验记忆力的经典卡牌游戏",
    category: "fun-games",
    icon: "🃏",
    url: "/games/memory-cards",
    tags: ["记忆", "游戏", "卡牌"],
    featured: false,
    gradient: "from-blue-500 to-purple-500"
  },
  {
    id: 16,
    name: "猜谜达人",
    description: "丰富的谜题挑战，激发你的创造力",
    category: "fun-games",
    icon: "🎯",
    url: "/games/riddles",
    tags: ["猜谜", "游戏", "文字"],
    featured: true,
    gradient: "from-red-500 to-pink-500"
  },
  {
    id: 17,
    name: "太空射击",
    description: "经典街机游戏，重温童年回忆",
    category: "fun-games",
    icon: "🚀",
    url: "/games/space-shooter",
    tags: ["射击", "游戏", "街机"],
    featured: false,
    gradient: "from-slate-500 to-gray-600"
  },
  {
    id: 18,
    name: "2048",
    description: "数字合成游戏，挑战最高分",
    category: "fun-games",
    icon: "🔢",
    url: "/games/2048",
    tags: ["数字", "游戏", "益智"],
    featured: true,
    gradient: "from-green-500 to-teal-500"
  },

  // 智能工具
  {
    id: 19,
    name: "二维码生成",
    description: "快速生成各类二维码，支持多种格式",
    category: "smart-tools",
    icon: "📱",
    url: "/tools/qr-generator",
    tags: ["二维码", "工具", "生成"],
    featured: true,
    gradient: "from-gray-700 to-gray-900"
  },
  {
    id: 20,
    name: "颜色提取器",
    description: "从图片中提取配色方案，设计师必备",
    category: "smart-tools",
    icon: "🎨",
    url: "/tools/color-extractor",
    tags: ["颜色", "设计", "工具"],
    featured: false,
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    id: 21,
    name: "文字云生成",
    description: "创建精美的文字云可视化效果",
    category: "smart-tools",
    icon: "☁️",
    url: "/tools/word-cloud",
    tags: ["文字", "可视化", "设计"],
    featured: true,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: 22,
    name: "JSON格式化",
    description: "JSON数据美化、验证与压缩工具",
    category: "smart-tools",
    icon: "📊",
    url: "/tools/json-formatter",
    tags: ["JSON", "开发", "工具"],
    featured: false,
    gradient: "from-emerald-500 to-green-500"
  },
  {
    id: 23,
    name: "URL短链生成",
    description: "将长链接转换为短链接，分享更便捷",
    category: "smart-tools",
    icon: "🔗",
    url: "/tools/url-shortener",
    tags: ["URL", "工具", "链接"],
    featured: false,
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    id: 24,
    name: "文件转换器",
    description: "支持多种格式的文件在线转换",
    category: "smart-tools",
    icon: "🔄",
    url: "/tools/file-converter",
    tags: ["转换", "文件", "工具"],
    featured: true,
    gradient: "from-orange-500 to-yellow-500"
  },
  {
    id: 25,
    name: "番茄钟",
    description: "高效专注工作法，25分钟工作+5分钟休息",
    category: "smart-tools",
    icon: "🍅",
    url: "/tools/pomodoro",
    tags: ["效率", "专注", "时间管理"],
    featured: true,
    gradient: "from-red-500 to-pink-500"
  },
];

export const categories = [
  { id: 'all', name: '全部', icon: '🌟' },
  { id: 'ai-creative', name: 'AI创意', icon: '🤖' },
  { id: 'fashion-life', name: '时尚生活', icon: '✨' },
  { id: 'fun-games', name: '趣味游戏', icon: '🎮' },
  { id: 'smart-tools', name: '智能工具', icon: '🛠️' },
] as const;
