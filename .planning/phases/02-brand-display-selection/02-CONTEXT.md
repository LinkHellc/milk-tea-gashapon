# Phase 2: Brand Display & Selection - Context

**Gathered:** 2026-04-26
**Status:** Ready for planning

<domain>
## Phase Boundary

首页展示9个奶茶品牌，每个品牌以奶茶杯形态的拟物化扭蛋机展示。用户点击品牌卡片进入抽取页（gashapon），抽取页顶部可切换品牌。

</domain>

<decisions>
## Implementation Decisions

### 布局样式
- **D-08:** 首页布局采用横向滚动轮播（swiper），每屏显示3个品牌，共3屏可浏览全部9个品牌

### 品牌卡片视觉
- **D-09:** 品牌卡片采用拟物奶茶杯造型——立式奶茶杯外观，圆角方块+杯盖+吸管孔，真实奶茶杯比例
- **D-10:** 每个品牌使用各自的主色调（一点点绿色系、喜茶粉色系、霸王茶姬棕色系等），强化品牌识别度

### 品牌切换交互
- **D-11:** 抽取页（gashapon）顶部设有当前品牌名称+下拉箭头，点击展开品牌列表直接切换，无需返回首页

### 整体视觉风格
- **D-12:** 马卡龙色系+柔和渐变背景——低饱和度马卡龙色（薄荷绿、樱花粉、奶油黄），温暖柔和，契合奶茶主题

### Claude's Discretion
- 轮播指示器样式（圆点 or 数字）
- 品牌卡片的阴影/高度细节
- 下拉选择器的展开动画

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project
- `.planning/PROJECT.md` — 项目背景、核心价值、品牌列表
- `.planning/REQUIREMENTS.md` — BRAND-01、BRAND-02 需求详情
- `.planning/ROADMAP.md` — Phase 2 完整定义

### Prior Phase Context
- `.planning/phases/01-project-setup-authentication/01-CONTEXT.md` — Phase 1 决策（页面结构、懒登录）

### No external specs
Requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `pages/index/index.{wxml,wxss,js,json}` — 首页骨架已创建，Phase 2 替换为真实品牌列表
- `pages/gashapon/gashapon.{wxml,wxss,js,json}` — 抽取页已有基本结构，需添加顶部品牌切换器
- `app.json` — window 配置（navigationBarBackgroundColor: #f5f5f5），可复用

### Established Patterns
- 微信小程序 swiper 组件实现横向轮播
- wxss 使用 rpx 单位实现响应式布局
- 品牌数据可使用 JS 数组定义（Phase 2 本地数据，Phase 5 迁移云端）

### Integration Points
- 品牌列表数据：index.js 的 data 中定义 brands 数组
- 品牌切换：gashapon.js 通过 brandId 参数识别当前品牌
- 导航：index.wxml 点击品牌卡片调用 wx.navigateTo 跳转 gashapon?brandId=xxx

</code_context>

<specifics>
## Specific Ideas

- 品牌卡片大小：建议 280rpx × 360rpx（3列布局留边距）
- 奶茶杯卡片元素：杯身（圆角矩形）+ 杯盖（顶部深色条）+ 吸管孔（小圆点）+ 品牌logo
- 轮播分页：底部圆点指示器，当前期望高亮
- 品牌数据示例结构：{ id: 'yidiandian', name: '一点点', color: '#4CAF50', logo: '/assets/brands/yidiandian.png' }

</specifics>

<deferred>
## Deferred Ideas

None — all decisions captured above.

</deferred>

---

*Phase: 02-brand-display-selection*
*Context gathered: 2026-04-26*
