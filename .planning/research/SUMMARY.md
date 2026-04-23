# Project Research Summary

**Project:** 奶茶扭蛋机 (Milk Tea Gashapon)
**Domain:** 微信小程序 - 盲盒抽卡类工具
**Researched:** 2026-04-23
**Confidence:** MEDIUM

## Executive Summary

This is a WeChat mini-program milk tea brand selector using a gashapon (capsule toy) mechanic. Users pick a milk tea brand, "twist" a capsule machine, and get a random milk tea recommendation from that brand. The core value proposition is "help indecisive people decide what to drink" through gamified randomness with collection mechanics.

Experts build this type of product using WeChat's native mini-program framework with cloud development for data persistence. The recommended architecture separates UI (pages + components), business logic (services), and state (pub/sub store). Critical success factors include: transparent probability algorithms (avoiding "rigged" accusations), reliable data persistence via cloud storage, and share image generation that works across device碎片化 (especially Huawei/OPPO/Xiaomi). Brand trademark risk is the biggest regulatory threat - v1 should use generic milk tea types rather than real brand names like "一点点" or "喜茶".

Key risks requiring proactive mitigation: animation performance on older devices, Canvas share image compatibility across Android devices, and ad monetization timing (must not disrupt core experience). Research suggests 3-phase roadmap: Phase 1 (core gashapon + animation), Phase 2 (user system + cloud persistence + sharing), Phase 3 (retention features + ads).

## Key Findings

### Recommended Stack

WeChat mini-program native development is the clear choice. Cloud development (wx.cloud or LeanCloud) is essential for data persistence - local storage alone risks user data loss and cannot support probability algorithms securely. wx.createAnimation provides hardware-accelerated animation sufficient for capsule effects; Lottie-web only needed if custom complex animations exceed native API capability.

**Core technologies:**
- **微信小程序原生框架 (最新版)** — required per project constraint, mature ecosystem
- **JavaScript ES6+** — native support, no transpilation needed
- **wx.createAnimation** — capsule pop animation, hardware accelerated, cross-device compatible
- **Canvas (原生API)** — share image generation via drawImage
- **微信云开发 / @leancloud/weapp-sdk** — data persistence, probability algorithm security
- **dayjs 1.x** — date handling for history/achievements
- **Lottie-web 3.x** — only if native animations insufficient

**Avoid:** wx.showModal (use custom toasts), webview embedding (CORS issues + poor UX), excessive localStorage (10MB limit + can be cleared).

### Expected Features

**Must have (table stakes):**
- **微信头像昵称展示** — identity marker, P1
- **品牌列表 (9个)** — entry point, P1
- **抽取核心动画 (胶囊弹出+翻开)** — core experience, P1
- **结果展示 (奶茶名+一句话介绍)** — reveal, P1
- **重新抽取** — retry, P1
- **分享图生成** — viral loop, P1
- **音效反馈** — immersion, P1
- **历史记录 (本地)** — awareness, P1

**Should have (differentiators):**
- **积分奖励机制** — retention, adds goal dimension
- **成就徽章系统** — collection satisfaction
- **隐藏款奶茶** — rarity creates话题

**Defer (v2+):**
- **用户自定义胶囊** — high complexity, needs high retention users first
- **品牌主题扭蛋机皮肤** — each brand unique visuals
- **社交排行榜** — depends on分享rate data

### Architecture Approach

Standard WeChat Page + Component architecture with clear layer separation:

```
View (WXML) → Components (JS) → Services (business logic) → State (pub/sub store) → Data (LocalStorage/Cloud)
```

Pages: index (brand selection), gashapon (core interaction), result (reveal), profile (points/history)
Key components: gashapon-machine (animation core), capsule (individual capsule), brand-card (brand display), share-card (canvas generation), score-panel (points UI)
Services: gashapon.service.js (random algorithm), brand.service.js, score.service.js, share.service.js

**Critical pattern:** Probability algorithm MUST run server-side (cloud function) not client-side to prevent manipulation. Animation via wx.createAnimation, not CSS keyframes. Canvas share generation needs real-device testing across Huawei/Xiaomi/OPPO.

### Critical Pitfalls

1. **概率算法不透明** — Users质疑抽到"不想要的结果"是操控的。Prevention: 公示基础概率 + 保底机制 (连续10次未出隐藏款则第11次必出) + 结果页展示"运气值"可视化。**Phase 1必须实现，云端算法不可前端暴露。**

2. **数据持久化存储陷阱** — 本地存储10MB限制+可被清除，用户积分/自定义数据清零。Prevention: 核心数据落云数据库，本地仅做缓存。**Phase 2必须完成，用户换手机后数据必须在。**

3. **分享图生成失败切断传播链** — Canvas白屏、QR码不识别、华为机型兼容性问题。Prevention: 不要依赖纯前端Canvas，使用微信标准分享图接口或后端生成分享图。**Phase 2必须完成且经真机测试(华为/小米/OPPO)。**

4. **品牌商标侵权风险** — 使用"喜茶"、"一点点"等品牌名触发维权，小程序被下架。Prevention: v1使用通用奶茶类型名(港式奶茶、水果茶)或代号系统。**Phase 1必须确定，已授权品牌或通用名2选1。**

5. **动画性能崩溃毁掉核心体验** — 老旧机型卡顿、掉帧、手机发烫。Prevention: wx.createAnimation，动画控制在500ms内，提供"跳过"按钮，老旧机型降级方案。**Phase 1完成并真机测试(iPhone 7等)。**

## Implications for Roadmap

Based on research, suggested 3-phase roadmap:

### Phase 1: 基础扭蛋体验 (Core Gashapon Experience)
**Rationale:** Core loop must work first. Probability algorithm must be designed from start (not bolted on later). Brand trademark decision must be front-loaded.
**Delivers:** 品牌列表 + 抽取动画 + 结果展示 + 分享功能(静态版) + 音效
**Implements:** 微信授权 + 基础动画 + 云函数概率算法 + 通用品牌名(或已授权品牌)
**Avoids:** 概率质疑(P1首期设计)、品牌侵权(P1确定品牌策略)、动画性能(首期真机测试)

### Phase 2: 用户系统与数据持久化 (User System + Cloud Persistence)
**Rationale:** User data and shares are where trust is lost. Must complete before scaling. Share image real-device issues surface here.
**Delivers:** 云数据库用户数据 + 积分系统 + 历史记录云同步 + 分享图生成(带小程序码) + 成就徽章基础版
**Implements:** 云开发/LeanCloud数据层 + 分享Card组件(canvas) + 积分service
**Avoids:** 数据丢失(云端source of truth)、分享图华为白屏(真机测试覆盖)

### Phase 3: 留存与变现 (Retention + Monetization)
**Rationale:** User habits must be established before ads. Premature monetization drives away users.
**Delivers:** 成就徽章完整版 + 隐藏款奶茶 + 激励视频广告入口 + 积分商城
**Implements:** 成就系统 + 广告联盟接入(轻量)
**Avoids:** 广告打断体验(仅结果页底部banner，激励视频用户主动触发)

### Phase Ordering Rationale

- **P1 before P2:** Core loop must validate before investing in user persistence. If gashapon mechanic fails, user system is wasted effort.
- **P2 before P3:** 变现 must not disrupt core experience. Ad integration before user habits =举报+流失.
- **Dependency from FEATURES:** 抽取动画 requires 结果展示 requires 分享生成 (sequential)
- **Dependency from PITFALLS:** 概率算法(云端) → 数据持久化 → 广告变现 (sequential risk mitigation)
- **Shared risk:** 品牌商标 decision spans P1-P2 (确定品牌策略是P1设计决策，但实际侵权风险在P2分享传播后显现)

### Research Flags

**Needs research during planning:**
- **Phase 2 (分享图生成):** Canvas API 华为/OPPO兼容性 — 需要找到可靠方案或后端替代
- **Phase 3 (广告接入):** 微信广告联盟资质申请流程 + 审核时间

**Standard patterns (skip deep research):**
- **Phase 1 (基础架构):** Page+Component模式官方文档充分，按部就班实现即可
- **Phase 2 (云开发):** 微信云开发文档完整，落地实践多

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | 微信官方文档为主，部分第三方库(LeanCloud)需核实最新版本 |
| Features | MEDIUM | 基于盲盒类通用模式分析，非特定产品验证 |
| Architecture | MEDIUM | 官方文档碎片化，部分基于2024-2025社区实践 |
| Pitfalls | MEDIUM | 微信平台常见问题，但具体场景(华为Canvas兼容性)需实测 |

**Overall confidence:** MEDIUM

### Gaps to Address

- **品牌授权状态:** 未明确是否已获得任何品牌授权。P1设计依赖此决策 — 通用名方案 vs 授权品牌方案会影响feature scope。
- **华为/OPPO Canvas兼容性:** 分享图生成在部分机型上的白屏问题，解决方案(后端生成 vs 微信标准接口)需要实测验证。
- **概率算法公平性验证:** 如何向用户证明概率未操控，需要产品+技术联合设计，不只是技术问题。
- **广告联盟接入资质:** 具体资质要求、申请时长、审核拒绝率未核实。

## Sources

### Primary (HIGH confidence)
- 微信小程序官方文档 — 开发框架、API、组件、隐私策略
- 微信开发者工具官方文档 — 调试能力

### Secondary (MEDIUM confidence)
- 微信小程序社区常见问题 — 侵权投诉案例、Canvas兼容性
- 微信官方广告接入指南 — 资质要求
- 小程序生态盲盒/抽卡类产品通用模式 — Feature分析

### Tertiary (LOW confidence)
- 同类盲盒小程序用户反馈(小红书/微博) — 用户情绪反映，非系统研究
- TDesign MiniProgram / MobX bindings — 参考实践，非第一手源

---
*Research completed: 2026-04-23*
*Ready for roadmap: yes*
