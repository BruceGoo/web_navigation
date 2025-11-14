# 创意导航 - 探索我的创意工具箱

一个个性创意风格的导航页面，展示各类实用有趣的工具集合。

## ✨ 功能特色

- **🎨 四大分类**：AI创意、时尚生活、趣味游戏、智能工具
- **🔍 智能搜索**：支持按名称、描述、标签搜索工具
- **📱 响应式设计**：完美适配桌面端和移动端
- **🎭 动态效果**：使用 Framer Motion 打造流畅的动画体验
- **🌙 暗色模式**：自动适配系统主题，支持手动切换
- **⚡ 快速导航**：平滑滚动和锚点定位

## 🛠️ 技术栈

- **框架**: Next.js 14+ (App Router)
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React
- **语言**: TypeScript

## 📦 项目结构

```
web_navigation/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 主页面
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── Navbar.tsx         # 导航栏
│   ├── HeroSection.tsx    # 英雄区
│   ├── ToolsSection.tsx   # 工具展示区
│   ├── ToolCard.tsx       # 工具卡片
│   └── Footer.tsx         # 页脚
├── data/                  # 数据文件
│   └── tools.ts           # 工具数据
├── tailwind.config.ts     # Tailwind 配置
└── package.json           # 依赖配置
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 📝 主要组件

### Navbar
- 固定顶部导航栏
- 分类锚点导航
- 响应式搜索框
- 移动端汉堡菜单

### HeroSection
- 创意欢迎语
- 动态背景效果
- 统计数据展示
- 滚动指示器

### ToolsSection
- 分类筛选功能
- 搜索结果展示
- 工具卡片网格布局
- 动态加载动画

### ToolCard
- 渐变背景设计
- 悬停动画效果
- 标签展示
- 访问按钮

## 🎯 核心功能

### 1. 工具分类系统
- 全部工具
- AI创意工具（6个）
- 时尚生活（6个）
- 趣味游戏（6个）
- 智能工具（6个）

### 2. 搜索功能
- 实时搜索
- 多字段匹配（名称、描述、标签）
- 无结果提示

### 3. 动画效果
- 页面滚动动画
- 卡片悬停效果
- 背景动态元素
- 加载过渡动画

## 🌐 部署

推荐使用 Vercel 部署：

1. Fork 本项目
2. 连接到 Vercel
3. 自动部署完成

或者手动部署：

```bash
npm run build
npm start
```

## 📱 响应式支持

- **桌面端** (>768px): 三列网格，完整功能
- **平板端** (768px-1024px): 两列网格
- **手机端** (<768px): 单列布局，汉堡菜单

## 🎨 设计系统

### 颜色方案
- **Primary**: 蓝色系 (#0ea5e9)
- **Secondary**: 紫色系 (#d946ef)
- **Accent**: 橙色系 (#f97316)
- **Success**: 绿色系 (#10b981)

### 动画时长
- 快速交互: 0.2s
- 标准过渡: 0.3s
- 慢速动画: 0.5-0.8s

## 📊 性能优化

- 图片懒加载
- 代码分割
- 动态导入
- 缓存策略

## 🔧 自定义配置

### 添加新工具

编辑 `data/tools.ts`:

```typescript
{
  id: 25,
  name: "新工具名称",
  description: "工具描述",
  category: "ai-creative", // 分类
  icon: "🎯",              // Emoji 图标
  url: "/tools/new-tool",   // 访问链接
  tags: ["标签1", "标签2"], // 技术标签
  featured: true,          // 是否推荐
  gradient: "from-blue-500 to-purple-500" // 渐变色
}
```

### 修改颜色主题

编辑 `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0f9ff', // 修改主色调
        // ...
      },
    },
  },
},
```

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide](https://lucide.dev)
- [Vercel](https://vercel.com)

---

**创意导航** - 让创意无限延伸 🚀

