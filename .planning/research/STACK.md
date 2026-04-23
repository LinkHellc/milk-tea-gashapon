# Stack Research

**Domain:** 微信小程序 · 奶茶扭蛋机工具
**Researched:** 2026-04-23
**Confidence:** MEDIUM

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| 微信小程序原生框架 | 最新版 | 核心开发框架 | 项目要求原生开发，社区生态成熟 |
| JavaScript ES6+ | - | 编程语言 | 小程序原生支持，无需转译 |
| wx.createAnimation | 原生API | 胶囊弹出动画 | 硬件加速，跨机型兼容性好 |
| Canvas | 原生API | 分享图生成 | 提供drawImage等API实现截图 |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Lottie-web | 3.x | 复杂动画效果 | 如果需要比原生API更炫酷的动画效果 |
| dayjs | 1.x | 日期处理 | 积分历史、成就时间展示 |
| @leancloud/weapp-sdk | 2.x | 云开发 | 替代自建云服务，数据持久化 |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| 微信开发者工具 | 最新版 | 开发/调试/预览 | 必需，熟悉快捷键提升效率 |
| 小程序云开发控制台 | 内置 | 数据库/云函数 | 数据存储、概率算法云端实现 |
| 微信小程序代码质量插件 | - | ESLint/Prettier | 统一代码风格 |

## Installation

```bash
# 项目初始化（在微信开发者工具中新建项目）

# 云开发环境（如使用LeanCloud替代）
# 在项目根目录执行 npm init -y 后安装
npm install @leancloud/weapp-sdk --save

# 动画库（如需复杂动画）
npm install lottie-web --save

# 日期处理
npm install dayjs --save
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| 原生开发 | Taro/uni-app | 需要跨平台（抖音/支付宝）时 |
| 微信云开发 | 自建Node.js后端 | 需要更复杂业务逻辑时 |
| Canvas分享图 | 后端生成图片 | Canvas兼容性问题严重时 |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| wx.showModal 确认框 | 体验不如自定义弹窗 | 自定义toast/弹窗组件 |
| 小程序内嵌网页 | 需跨域且体验差 | 分离H5页面或原生实现 |
| 过多的本地存储 | 上限10MB且不持久 | 云数据库存储核心数据 |

## Stack Patterns by Variant

**如果使用微信云开发：**
- 数据库存储奶茶数据、用户积分、抽取历史
- 云函数实现概率算法（不可前端暴露）
- 安全性高，数据持久

**如果使用LeanCloud：**
- 更快接入，有weapp-sdk
- 适合快速MVP验证
- 长期看需迁移至自建后端

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| 微信开发者工具 | 最新稳定版 | 始终保持最新版避免未知bug |
| lottie-web | 3.x | 2.x有已知性能问题 |

## Sources

- 微信小程序官方文档 — 开发框架、API、组件
- 微信开发者工具官方文档 — 调试能力

---
*Stack research for: 微信小程序奶茶扭蛋机*
*Researched: 2026-04-23*