# Phase 3: Core Gashapon Experience - Context

**Gathered:** 2026-04-27
**Status:** Ready for planning

<domain>
## Phase Boundary

实现奶茶扭蛋机的核心体验：点击"扭一下"，胶囊从吸管螺旋上升弹出，揭示随机奶茶结果。云端实现概率算法，结果不可前端预测。

</domain>

<decisions>
## Implementation Decisions

### 核心动画（最关键的视觉体验）

- **D-01:** 胶囊从吸管吸出，模拟珍珠奶茶喝珍珠的场景——扭蛋=喝奶茶，完美合一
- **D-02:** 动画轨迹：胶囊在吸管内**螺旋上升**（像真珍珠一样旋转着被吸上去），到达顶部后弹出
- **D-03:** 杯子配合动作：杯体**向右下方向倾斜**（模拟仰头喝奶茶吸珍珠），增强真实感
- **D-04:** 胶囊弹出到**杯子上方**（杯子上方约50-80rpx），在半空打开揭晓结果
- **D-05:** 揭晓方式：胶囊从中间裂开，里面显示奶茶名+一颗珍珠图形，忠实于真实扭蛋机"打开胶囊盖"的体验

### 动画与云端时序

- **D-06:** 点击"扭一下"后，**动画与云端概率调用同步并行启动**——用户在看动画时云端已完成计算，几乎无等待感
- **D-07:** 如果云端调用慢，动画先播放完，结果返回后在result页面展示（用户不会感知到等待）

### 云端概率算法

- **D-08:** 概率算法必须在**微信云开发云函数**中实现，不可前端暴露（GASH-02核心要求）
- **D-09:** 每个品牌有8-12款默认奶茶，奶茶数据存储在**云数据库**，Phase 3先用本地Mock数据

### 结果页增强

- **D-10:** 跳转到result页面后，播放胶囊结果动画（胶囊弹出→打开），然后展示奶茶结果卡
- **D-11:** 结果卡包含：奶茶名 + 品牌名 + 一句话介绍 + 用户头像（Phase 1）

### 结果卡设计

- **D-12:** 结果卡显示内容：奶茶名称（突出显示）+ 品牌名（副标题）+ 一句话介绍 + 珍珠图形
- **D-13:** 奶茶名下面有一句话介绍（如"经典口味，浓郁奶香"），每款奶茶有不同的介绍

### Claude's Discretion

- 动画时长（建议1.5-2秒内完成，保持节奏感）
- 胶囊颜色（透明+高光反射）
- 珍珠图形样式（圆形 vs 水滴形）
- 云函数的具体接口定义
- 奶茶介绍文案的风格

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project
- `.planning/PROJECT.md` — 项目背景、核心价值、品牌列表
- `.planning/REQUIREMENTS.md` — GASH-01、GASH-02、GASH-03 需求详情
- `.planning/ROADMAP.md` — Phase 3 完整定义

### Prior Phases
- `.planning/phases/01-project-setup-authentication/01-CONTEXT.md` — 登录流程（lazy auth）
- `.planning/phases/02-brand-display-selection/02-CONTEXT.md` — 杯子视觉（D-09奶茶杯，D-10品牌色，D-11吸管位置），index和gashapon页面结构

### Tech Stack
- 微信云开发（云函数+云数据库）
- 本地Mock数据文件

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `pages/gashapon/gashapon.js` — 有 onGashaponTap 和 startGashapon 方法，Phase 3 修改这里触发动画+云端调用
- `pages/gashapon/gashapon.wxml` — 已有 machine-card（奶茶杯），需要在这里叠加动画层
- `pages/result/result.js` — 已有结果展示逻辑，Phase 3 在这里添加动画
- `data/brands.js` — 9个品牌数据
- `utils/auth.js` — Phase 1 的登录工具

### Established Patterns
- 微信 swiper 动画 → wx.createAnimation() 用于自定义动画
- 云函数调用：wx.cloud.callFunction()
- 云数据库：wx.cloud.database()

### Integration Points
- gashapon.js 的 onGashaponTap → 触发动画 + wx.cloud.callFunction({ name: 'gashapon' })
- result.js onLoad → 接收 cloud 返回的 milkTea 数据，播放揭晓动画
- cloud function 'gashapon' → 输入 brandId，返回 { milkTea, description }

</code_context>

<specifics>
## Specific Ideas

### 动画序列（完整）
1. 用户点"扭一下"
2. 杯体向右下倾斜（模拟仰头）
3. 胶囊在吸管内螺旋上升（0.8-1秒）
4. 胶囊弹出到杯子上方
5. 胶囊在半空打开（0.3秒）
6. 显示奶茶名+珍珠（揭晓）
7. 跳转到result页面展示结果卡

### 奶茶数据结构（Mock）
每品牌8-12款，如：
{ id: 'yidiandian-1', brand: 'yidiandian', name: '波霸奶茶', description: '大颗珍珠，嚼劲十足' }

### 云函数接口（待实现）
云函数名：gashapon
输入：{ brandId: string }
输出：{ milkTea: { name, description }, brandId, brandName }

</specifics>

<deferred>
## Deferred Ideas

### 奶茶数据迁移
- 奶茶数据先放本地JS Mock，Phase 5迁移到云数据库

### Phase 4 相关
- 分享图生成（Canvas兼容性问题已知）

</deferred>

---

*Phase: 03-core-gashapon-experience*
*Context gathered: 2026-04-27*
