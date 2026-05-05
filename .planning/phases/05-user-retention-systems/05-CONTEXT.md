# Phase 5: User Retention Systems - Context

**Gathered:** 2026-04-27
**Status:** Ready for planning

<domain>
## Phase Boundary

实现用户留存系统：积分累积、成就徽章、抽取历史、自定义奶茶款型。数据必须落云数据库（本地存储上限10MB）。

</domain>

<decisions>
## Implementation Decisions

### 积分系统 (POINTS-01)

- **D-01:** 每次抽取获得积分，积分存云数据库
- **D-02:** 每次抽取基础分10分，不同品牌可能有额外加成
- **D-03:** 积分查看入口：可在个人中心或结果页展示

### 成就系统 (ACHIEVE-01)

- **D-04:** 成就存在云数据库，包含：achievementId, name, description, icon, unlockedAt, isUnlocked
- **D-05:** 成就列表：首次抽取、新人奖、隐藏款获取、品牌集齐(9个)、连续抽取10/50/100次
- **D-06:** 成就解锁时在前端显示弹窗提示

### 历史记录 (HISTORY-01)

- **D-07:** 每次抽取结果存入云数据库：brandId, milkTea, timestamp
- **D-08:** 历史页面展示抽取列表，最新在前

### 自定义奶茶 (GASH-05)

- **D-09:** 用户可添加自定义奶茶名到当前品牌
- **D-10:** 自定义奶茶存储在云数据库或本地（视复杂度定）
- **D-11:** 自定义奶茶只对自己可见

### Claude's Discretion

- 积分是否需要云数据库还是可以本地模拟
- 成就解锁触发时机（抽取后？概率触发？）
- 历史记录翻页方案

</decisions>

<canonical_refs>
## Canonical References

### Project
- `.planning/PROJECT.md` — 项目背景
- `.planning/REQUIREMENTS.md` — POINTS-01, ACHIEVE-01, HISTORY-01, GASH-05
- `.planning/ROADMAP.md` — Phase 5 完整定义
- CLAUDE.md — 本地存储上限10MB，数据必须落云数据库

### Prior Phases
- `.planning/phases/03-core-gashapon-experience/03-CONTEXT.md` — 云数据库使用说明
- `cloudfunctions/gashapon/index.js` — 已有云函数

</canonical_refs>

<existing_artifacts>
## Existing Code

### cloudfunctions/gashapon/index.js (Phase 3)
- 云函数已有，可复用或扩展

### result page (Phase 4)
- 有 onRetryTap, onShareTap
- 可在抽取后更新积分

### pages/index/index.js (Phase 2)
- 首页，可跳转个人中心

</existing_artifacts>

<specifics>
## Specific Ideas

### 成就列表
1. 首次抽取 (first_draw): 解锁：首次完成一次抽取
2. 新人奖 (newbie): 解锁：累计抽取3次
3. 奶茶爱好者 (enthusiast): 解锁：累计抽取10次
4. 隐藏款 (hidden): 解锁：抽到某款概率极低的奶茶
5. 品牌收集家 (collector): 解锁：集齐9个品牌的各一款
6. 连续抽取 (addict): 解锁：连续抽取50/100次

### 积分规则
- 每次抽取：+10分
- 抽取到隐藏款：+50分
- 首次解锁新成就：+20分

### 历史记录结构
```javascript
{
  id: 'auto',
  brandId: 'yidiandian',
  milkTeaName: '波霸奶茶',
  milkTeaDescription: '大颗珍珠，嚼劲十足',
  timestamp: Date.now()
}
```

### 自定义奶茶结构
```javascript
{
  brandId: 'yidiandian',
  customName: '我的特调',
  customDescription: '自定义描述'
}
```

</specifics>

<deferred>
## Deferred Ideas

- 积分排行榜（需用户体系）
- 成就徽章UI展示（可做成九宫格收集样式）
- 自定义奶茶的云同步

---
*Phase: 05-user-retention-systems*
*Context gathered: 2026-04-27*
