'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  content: string;
  tags: string[];
}

const templates: Template[] = [
  {
    id: 'readme',
    name: 'README.md',
    description: '项目说明文档模板',
    icon: '📖',
    category: '开发文档',
    content: `# 项目名称

项目简介和描述。

## 🌟 功能特性

- ✨ 特性1
- 🚀 特性2
- 🎨 特性3
- 🔧 特性4

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装

\`\`\`bash
npm install
\`\`\`

### 使用示例

\`\`\`javascript
const example = require('your-package');

// 基本用法
example.run();
\`\`\`

## 📚 API 文档

### 方法1
描述方法1的功能。

\`\`\`javascript
example.method1(param1, param2);
\`\`\`

### 方法2
描述方法2的功能。

\`\`\`javascript
example.method2(options);
\`\`\`

## 🧪 测试

\`\`\`bash
npm test
\`\`\`

## 🤝 贡献

1. Fork 本仓库
2. 创建特性分支 (\`git checkout -b feature/amazing-feature\`)
3. 提交更改 (\`git commit -m 'Add some amazing feature'\`)
4. 推送到分支 (\`git push origin feature/amazing-feature\`)
5. 打开 Pull Request

## 📄 许可证

[MIT](LICENSE) © ${new Date().getFullYear()} 作者名称

## 🙏 致谢

- 感谢所有贡献者
- 特别感谢某人的帮助`,
    tags: ['开发', '文档', 'GitHub']
  },
  {
    id: 'blog-post',
    name: '博客文章',
    description: '技术博客文章模板',
    icon: '📝',
    category: '写作',
    content: `# 文章标题

**发布日期**: ${new Date().toLocaleDateString('zh-CN')}
**作者**: 您的名字
**标签**: #技术 #教程 #分享
**阅读时长**: 5分钟

## 📖 引言

在这里写文章的引言，介绍文章的主题和背景...

## 🎯 主要内容

### 第一部分标题

详细描述第一部分的内容，可以包含：

- 相关的背景知识
- 具体的问题描述
- 解决方案的思路

\`\`\`javascript
// 代码示例
function example() {
    console.log("Hello World");
}
\`\`\`

### 第二部分标题

继续深入讨论，包含：

1. 详细的步骤说明
2. 注意事项和最佳实践
3. 常见问题和解决方案

\u003e 💡 **提示**: 这里可以添加一些重要的提示信息。

### 第三部分标题

总结前面的内容，给出：

- 关键要点总结
- 进一步的思考
- 相关资源推荐

## 📊 实际案例

分享一个具体的案例或示例：

| 方案 | 优点 | 缺点 |
|------|------|------|
| 方案A | 简单易用 | 性能一般 |
| 方案B | 性能优秀 | 实现复杂 |

## 🔍 深入思考

提出一些值得深入思考的问题：

1. 这个方案有什么局限性？
2. 如何进一步优化？
3. 还有哪些替代方案？

## 📚 总结

总结文章的主要观点：

- ✅ 要点1
- ✅ 要点2
- ✅ 要点3

## 🔗 相关资源

- [官方文档](https://example.com)
- [相关教程](https://example.com)
- [示例代码](https://github.com/example)

---

**💬 讨论**: 如果您有任何问题或建议，欢迎在评论区留言交流。`,
    tags: ['博客', '技术', '写作']
  },
  {
    id: 'meeting-notes',
    name: '会议记录',
    description: '会议纪要模板',
    icon: '📋',
    category: '工作',
    content: `# 会议记录

**会议主题**: 项目进度讨论
**会议时间**: ${new Date().toLocaleDateString('zh-CN')} ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
**会议地点**: 会议室A / 线上会议
**主持人**: 主持人姓名
**记录人**: 记录人姓名
**会议类型**: 周例会 / 项目评审 / 紧急会议

## 👥 参会人员

### 核心成员
- 张经理 (项目负责人) - ✅
- 王工程师 (技术负责人) - ✅
- 李设计师 (UI/UX设计) - ✅
- 赵产品经理 - ✅

### 列席人员
- 陈测试工程师 - ✅
- 刘运维工程师 - ❌ (请假)

## 📋 会议议程

1. 上次会议行动项回顾 (10分钟)
2. 各部门进度汇报 (30分钟)
3. 问题讨论和解决方案 (20分钟)
4. 下阶段计划安排 (15分钟)
5. 其他事项 (5分钟)

## 📝 会议内容

### 1. 上次会议行动项回顾

| 行动项 | 负责人 | 截止日期 | 状态 | 备注 |
|--------|--------|----------|------|------|
| 完成API接口开发 | 王工程师 | 1月10日 | ✅ 完成 | 比预期提前2天 |
| 更新UI设计稿 | 李设计师 | 1月12日 | ✅ 完成 | 已提交评审 |
| 编写测试用例 | 陈测试工程师 | 1月15日 | 🔄 进行中 | 预计明天完成 |

### 2. 各部门进度汇报

#### 技术部门 (王工程师)
- **完成情况**: 后端API开发完成80%
- **遇到问题**: 第三方接口调用频率限制
- **解决方案**: 申请提高配额，同时实现缓存机制
- **下周计划**: 完成剩余API，开始性能优化

#### 设计部门 (李设计师)
- **完成情况**: 主要页面设计完成
- **遇到问题**: 移动端适配需要考虑更多设备
- **解决方案**: 重新评估响应式设计方案
- **下周计划**: 完成移动端适配，准备设计规范文档

#### 产品部门 (赵产品经理)
- **完成情况**: 需求文档更新，用户反馈收集
- **遇到问题**: 部分功能优先级需要调整
- **解决方案**: 重新评估功能优先级，调整开发计划
- **下周计划**: 完成需求优先级调整，准备版本发布计划

### 3. 问题讨论

#### 问题1: 性能瓶颈
**描述**: 系统在高并发情况下响应缓慢
**讨论结果**:
- 王工程师负责性能分析和优化
- 预计需要2周时间
- 需要增加缓存和数据库优化

#### 问题2: 用户体验改进
**描述**: 用户反馈界面操作复杂
**讨论结果**:
- 李设计师负责简化界面设计
- 赵产品经理负责收集更多用户反馈
- 计划进行A/B测试

### 4. 下阶段计划

#### 本周重点任务
- [ ] 完成性能优化方案设计
- [ ] 更新UI设计规范
- [ ] 完成测试用例编写
- [ ] 准备版本发布计划

#### 下周目标
- [ ] 开始性能优化实施
- [ ] 完成移动端适配
- [ ] 进行系统集成测试
- [ ] 准备用户验收测试

## ⚠️ 风险提示

1. **技术风险**: 性能优化可能遇到技术难点
2. **时间风险**: 移动端适配工作量可能被低估
3. **资源风险**: 测试环境资源可能不足

## 📊 决策事项

| 事项 | 决策 | 负责人 | 完成时间 |
|------|------|--------|----------|
| 技术方案选择 | 采用微服务架构 | 王工程师 | 1月20日 |
| UI设计方向 | 采用简洁风格 | 李设计师 | 1月18日 |
| 发布时间调整 | 延后一周发布 | 赵产品经理 | 1月22日 |

## 🎯 行动项

### 高优先级
- [ ] **王工程师**: 完成性能分析报告 (截止: 1月18日)
- [ ] **李设计师**: 提交简化版UI设计方案 (截止: 1月19日)
- [ ] **赵产品经理**: 更新项目时间线 (截止: 1月17日)

### 中优先级
- [ ] **陈测试工程师**: 完善自动化测试脚本 (截止: 1月25日)
- [ ] **全体成员**: 准备下周的系统集成测试 (截止: 1月24日)

### 低优先级
- [ ] **王工程师**: 调研新技术框架 (截止: 1月30日)
- [ ] **李设计师**: 准备设计规范文档 (截止: 1月28日)

## 📞 下次会议

**时间**: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN')} 14:00
**主题**: 系统集成测试准备
**重点议题**:
1. 性能优化进展汇报
2. 移动端适配结果评审
3. 集成测试计划确认

---

**备注**: 如有紧急事项，请及时在群内沟通或发起临时会议。`,
    tags: ['会议', '工作', '记录']
  },
  {
    id: 'project-plan',
    name: '项目计划',
    description: '项目管理计划模板',
    icon: '📊',
    category: '管理',
    content: `# 项目计划书

## 📋 项目基本信息

**项目名称**: 项目名称
**项目编号**: PROJ-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}
**项目负责人**: 负责人姓名
**项目经理**: 项目经理姓名
**文档版本**: v1.0
**制定日期**: ${new Date().toLocaleDateString('zh-CN')}
**计划开始日期**: ${new Date().toLocaleDateString('zh-CN')}
**计划结束日期**: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN')}

## 🎯 项目目标

### 总体目标
简要描述项目的总体目标和预期成果。

### 具体目标
- ✅ **目标1**: 具体描述目标1的内容和衡量标准
- ✅ **目标2**: 具体描述目标2的内容和衡量标准
- ✅ **目标3**: 具体描述目标3的内容和衡量标准

### 成功标准
- 📊 具体的量化指标和成功标准
- ⏰ 时间节点要求
- 💰 预算控制要求
- 🎯 质量要求

## 👥 项目团队

| 角色 | 姓名 | 职责 | 联系方式 |
|------|------|------|----------|
| 项目发起人 | 姓名 | 项目决策、资源支持 | 邮箱/电话 |
| 项目经理 | 姓名 | 项目整体管理 | 邮箱/电话 |
| 技术负责人 | 姓名 | 技术方案和实施 | 邮箱/电话 |
| 产品经理 | 姓名 | 需求和产品设计 | 邮箱/电话 |
| 测试负责人 | 姓名 | 测试和质量保证 | 邮箱/电话 |

## 📅 项目里程碑

### 第一阶段：项目启动 (第1-2周)
- [ ] 项目立项和团队组建
- [ ] 需求收集和分析
- [ ] 技术方案设计
- [ ] 项目计划制定

### 第二阶段：开发实施 (第3-8周)
- [ ] 系统架构设计
- [ ] 核心功能开发
- [ ] 用户界面设计
- [ ] 单元测试编写

### 第三阶段：测试验收 (第9-10周)
- [ ] 系统集成测试
- [ ] 用户验收测试
- [ ] 性能测试
- [ ] 安全测试

### 第四阶段：部署上线 (第11-12周)
- [ ] 生产环境部署
- [ ] 数据迁移
- [ ] 用户培训
- [ ] 项目验收

## 📊 工作分解结构 (WBS)

### 1. 项目管理
1.1 项目启动
1.2 项目规划
1.3 项目执行监控
1.4 项目收尾

### 2. 需求分析
2.1 业务需求分析
2.2 功能需求分析
2.3 非功能需求分析
2.4 需求文档编写

### 3. 系统设计
3.1 架构设计
3.2 详细设计
3.3 数据库设计
3.4 接口设计

### 4. 开发实施
4.1 前端开发
4.2 后端开发
4.3 数据库开发
4.4 集成开发

### 5. 测试验证
5.1 测试计划
5.2 测试用例设计
5.3 测试执行
5.4 缺陷修复

### 6. 部署上线
6.1 环境准备
6.2 系统部署
6.3 数据迁移
6.4 上线验证

## ⏰ 项目时间表

### 甘特图时间线

**第1-2周** (项目启动)
- 需求调研和分析
- 技术方案确定
- 团队组建

**第3-6周** (核心开发)
- 系统架构搭建
- 核心功能实现
- 基础测试

**第7-8周** (功能完善)
- 功能优化
- 界面完善
- 测试用例执行

**第9-10周** (系统测试)
- 集成测试
- 用户测试
- 性能优化

**第11-12周** (部署上线)
- 生产部署
- 用户培训
- 项目验收

## 💰 项目预算

### 人力成本
| 角色 | 人数 | 单价(元/人天) | 工期(天) | 小计(元) |
|------|------|---------------|----------|----------|
| 项目经理 | 1 | 1,200 | 60 | 72,000 |
| 开发人员 | 3 | 1,000 | 60 | 180,000 |
| 测试人员 | 2 | 800 | 30 | 48,000 |
| 设计人员 | 1 | 900 | 20 | 18,000 |
| **合计** | **7** | | | **318,000** |

### 其他成本
- 硬件设备：50,000元
- 软件许可：30,000元
- 培训费用：20,000元
- 其他费用：10,000元

### 总预算
**总预算：428,000元**

## ⚠️ 风险管理

### 高风险
1. **技术风险**: 新技术学习成本
   - 影响：可能延期2-3周
   - 应对：提前技术调研，安排培训

2. **人员风险**: 关键人员离职
   - 影响：项目进度受阻
   - 应对：建立知识文档，培养备份人员

### 中等风险
1. **需求变更**: 业务需求频繁变更
   - 影响：开发返工
   - 应对：严格需求管理，变更控制流程

2. **集成风险**: 系统集成复杂
   - 影响：集成测试时间增加
   - 应对：提前集成测试，分步集成

### 低风险
1. **设备风险**: 硬件设备故障
   - 应对：准备备用设备

2. **网络风险**: 网络环境不稳定
   - 应对：准备离线环境

## 📋 项目交付物

### 管理文档
- [ ] 项目章程
- [ ] 项目计划书
- [ ] 会议纪要
- [ ] 状态报告

### 技术文档
- [ ] 需求规格说明书
- [ ] 系统设计文档
- [ ] 测试计划和报告
- [ ] 用户手册

### 软件交付
- [ ] 应用程序代码
- [ ] 数据库脚本
- [ ] 部署文档
- [ ] 运维手册

## 📊 质量控制

### 质量标准
- 功能完整性：100%满足需求
- 性能要求：响应时间<2秒
- 可靠性：可用性>99%
- 安全性：通过安全测试

### 质量保证措施
1. 代码审查
2. 单元测试覆盖率>80%
3. 集成测试
4. 用户验收测试

## 📞 沟通计划

### 会议安排
- **每日站会**: 每天9:00，15分钟
- **周例会**: 每周一14:00，1小时
- **月度评审**: 每月最后一个周五，2小时

### 报告机制
- **日报**: 每日工作进展
- **周报**: 每周工作总结
- **月报**: 每月项目状态

---

**批准**: 项目负责人签字
**日期**: ${new Date().toLocaleDateString('zh-CN')}`,
    tags: ['管理', '计划', '项目']
  },
  {
    id: 'daily-journal',
    name: '日记模板',
    description: '个人日记和反思模板',
    icon: '📔',
    category: '个人',
    content: `# 日记 - ${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}

## 🌅 今日天气
- **天气**: ☀️ 晴朗 / ⛅ 多云 / 🌧️ 雨天 / ❄️ 雪天
- **温度**: 15°C - 25°C
- **心情**: 😊 开心 / 😐 平静 / 😔 低落 / 😤 烦躁 / 💪 充满动力

## 🎯 今日目标

### 主要目标 (Must Do)
- [ ] 目标1
- [ ] 目标2
- [ ] 目标3

### 次要目标 (Nice to Have)
- [ ] 目标4
- [ ] 目标5

## 📊 时间记录

| 时间段 | 活动 | 时长 | 效率评价 |
|--------|------|------|----------|
| 08:00-09:00 | 早餐 + 准备 | 1h | ⭐⭐⭐⭐⭐ |
| 09:00-12:00 | 工作/学习 | 3h | ⭐⭐⭐⭐☆ |
| 12:00-13:00 | 午餐 | 1h | ⭐⭐⭐⭐⭐ |
| 13:00-18:00 | 工作/学习 | 5h | ⭐⭐⭐⭐☆ |
| 18:00-19:00 | 晚餐 | 1h | ⭐⭐⭐⭐⭐ |
| 19:00-22:00 | 个人时间 | 3h | ⭐⭐⭐☆☆ |
| 22:00-23:00 | 睡前准备 | 1h | ⭐⭐⭐⭐⭐ |

## 📝 今日要事

### 工作/学习
- 完成了什么重要任务
- 学到了什么新知识
- 遇到了什么挑战
- 如何解决遇到的问题

### 人际关系
- 今天和谁有深入交流
- 有什么新的认识或感悟
- 是否帮助了他人
- 是否得到了他人的帮助

### 健康管理
- 运动情况: 步数 / 运动时长 / 运动类型
- 饮食情况: 是否规律 / 营养搭配
- 睡眠情况: 入睡时间 / 睡眠质量
- 精神状态: 精力充沛 / 一般 / 疲惫

## 💭 今日思考

### 最有价值的事情
今天最有价值的事情是什么？为什么？

\u003e 写下您的思考...

### 最大的挑战
今天面临的最大挑战是什么？如何解决的？

\u003e 记录挑战和解决过程...

### 新的发现
今天有什么新的发现或感悟？

\u003e 分享新的认知...

### 情绪变化
描述今天的情绪变化和原因：

- 早晨: 情绪状态 → 原因
- 上午: 情绪状态 → 原因
- 下午: 情绪状态 → 原因
- 晚上: 情绪状态 → 原因

## 📚 今日学习

### 新知识
- 学到了什么：
- 如何应用：
- 相关资源：

### 阅读记录
- 阅读内容：
- 主要收获：
- 思考感悟：

### 技能提升
- 练习了什么技能：
- 进步情况：
- 改进计划：

## 🙏 感恩记录

今天要感恩的事情：

1. 感恩...（家人/朋友/同事的帮助）
2. 感恩...（生活中的美好事物）
3. 感恩...（自己的成长和进步）
4. 感恩...（遇到的机遇和挑战）

## 🌟 今日亮点

### 成就事件
- 完成了什么值得骄傲的事情
- 超越了什么自我限制
- 实现了什么小目标

### 开心时刻
- 今天最开心的时刻是什么
- 谁带给您快乐
- 什么事物让您感到愉悦

### 美好回忆
- 今天想要记住的美好瞬间
- 有趣的事情
- 感动的时刻

## 🔍 自我反思

### 做得好的地方
- 哪些方面表现不错
- 哪些习惯在起作用
- 哪些方法有效

### 需要改进的地方
- 哪些方面可以做得更好
- 哪些习惯需要调整
- 哪些方法需要改进

### 明日改进计划
- 明天要尝试什么新方法
- 要注意避免什么问题
- 要重点改进什么方面

## 📅 明日计划

### 重要事项 (Top 3)
1. 事项1 - 预计耗时
2. 事项2 - 预计耗时
3. 事项3 - 预计耗时

### 时间安排
- 08:00-09:00:
- 09:00-12:00:
- 13:00-18:00:
- 19:00-22:00:

### 特别提醒
- 明天要特别注意什么
- 有什么重要约会或deadline
- 需要准备什么

## 🌙 睡前思考

### 今日评分
- 整体满意度: ⭐⭐⭐⭐☆ (1-5星)
- 目标完成度: ⭐⭐⭐⭐☆ (1-5星)
- 时间管理: ⭐⭐⭐☆☆ (1-5星)
- 情绪管理: ⭐⭐⭐⭐⭐ (1-5星)

### 睡前感恩
- 感谢今天遇到的所有人和事
- 感谢自己的努力和成长
- 感谢明天的新机会

### 明日期待
- 最期待明天发生什么
- 想要创造什么样的明天
- 对明天有什么祝福

---

**💤 晚安时间**: ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}

**🌟 今日金句**: "每一天都是新的开始，每一刻都有无限可能。"

**📖 明日关键词**: 成长、感恩、专注、快乐`,
    tags: ['日记', '反思', '成长']
  }
];

const categories = ['全部', '开发文档', '写作', '工作', '管理', '个人'];

export default function MarkdownTemplates() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 筛选模板
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === '全部' || template.category === selectedCategory;
    const matchesSearch = searchTerm === '' ||
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const copyTemplate = useCallback(async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  }, []);

  const useTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template);
  }, []);

  const downloadTemplate = useCallback((template: Template) => {
    const blob = new Blob([template.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Markdown 模板库
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            丰富的Markdown模板，快速开始写作
          </p>
        </motion.div>

        {/* 搜索和筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索模板..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 分类筛选 */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-600/80 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            找到 ${filteredTemplates.length} 个模板
          </div>
        </motion.div>

        {/* 模板列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => useTemplate(template)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{template.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{template.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyTemplate(template.content, template.id);
                    }}
                    className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all ${
                      copiedId === template.id
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {copiedId === template.id ? '✅ 已复制' : '📋 复制'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadTemplate(template);
                    }}
                    className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all"
                  >
                    📥 下载
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 模板预览 */}
        <AnimatePresence>
          {selectedTemplate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedTemplate(null)}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{selectedTemplate.icon}</span>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{selectedTemplate.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{selectedTemplate.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                    {selectedTemplate.content}
                  </pre>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                  <button
                    onClick={() => copyTemplate(selectedTemplate.content, selectedTemplate.id)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                      copiedId === selectedTemplate.id
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {copiedId === selectedTemplate.id ? '✅ 已复制' : '📋 复制内容'}
                  </button>
                  <button
                    onClick={() => downloadTemplate(selectedTemplate)}
                    className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all"
                  >
                    📥 下载模板
                  </button>
                  <button
                    onClick={() => {
                      // 在新窗口中打开Markdown编辑器
                      const content = encodeURIComponent(selectedTemplate.content);
                      window.open(`/tools/markdown-preview?template=${content}`, '_blank');
                    }}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all"
                  >
                    📝 编辑使用
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 使用说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            💡 使用说明
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">如何使用模板</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>1. 浏览并选择合适的模板</li>
                <li>2. 点击模板查看详细内容</li>
                <li>3. 复制或下载模板内容</li>
                <li>4. 根据需要进行修改</li>
                <li>5. 直接使用或进一步编辑</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">模板特色</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• 专业设计的格式结构</li>
                <li>• 包含常用内容和要素</li>
                <li>• 支持一键复制和下载</li>
                <li>• 可直接在编辑器中使用</li>
                <li>• 持续更新和扩展</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}