# Phase 1: Project Setup & Authentication - Context

**Gathered:** 2026-04-26
**Status:** Ready for planning

<domain>
## Phase Boundary

微信小程序项目初始化 + 微信授权登录。本阶段完成项目搭建、页面结构、微信授权登录功能。

</domain>

<decisions>
## Implementation Decisions

### 登录入口
- **D-01:** 用户点击"扭一下"按钮时才触发微信登录授权提示（不是首页直接弹出）

### 未登录用户处理
- **D-02:** 允许未登录用户使用抽取功能
- **D-03:** 结果页展示"登录保存记录"提示，引导用户登录

### 页面结构
- **D-04:** 页面结构：
  - `pages/index/index` — 首页（品牌列表）
  - `pages/gashapon/gashapon` — 抽取页（单个品牌扭蛋机）
  - `pages/result/result` — 结果页
  - `pages/profile/profile` — 个人中心

### 项目初始化
- **D-05:** 微信小程序原生开发，使用微信开发者工具初始化项目
- **D-06:** 项目名称：奶茶扭蛋机
- **D-07:** app.json 配置页面路由，pages 数组按上述顺序注册

### Claude's Discretion
- 登录状态管理方式（Storage 存 localStorage vs 云开发）
- 授权失败时的降级处理
- 用户中心页面具体内容（积分、成就、历史记录的展示方式）

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project
- `PROJECT.md` — 项目背景、关键决策、品牌列表
- `REQUIREMENTS.md` — AUTH-01, AUTH-02 需求详情
- `ROADMAP.md` — Phase 1 完整定义

### Research
- `.planning/research/STACK.md` — 微信小程序技术栈

### No external specs
Requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 无（项目从零开始）

### Established Patterns
- 微信小程序标准项目结构：app.js + app.json + app.wxss + pages/
- wx.getUserProfile() 用于获取用户信息（需明确用途说明）

### Integration Points
- 新页面需在 app.json 的 pages 数组中注册
- 登录状态可使用 wx.getStorageSync('userInfo') 判断

</code_context>

<specifics>
## Specific Ideas

- 品牌列表首页：9个品牌以奶茶杯形态展示，每个品牌有独立视觉风格
- 抽取页：展示选中品牌的奶茶杯形态扭蛋机，点击"扭一下"触发登录（如未登录）并开始抽取
- 结果页：展示抽到的奶茶名称和介绍，未登录用户显示"登录保存记录"提示

</specifics>

<deferred>
## Deferred Ideas

### Reviewed Todos (not folded)
- 无

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-project-setup-authentication*
*Context gathered: 2026-04-26*