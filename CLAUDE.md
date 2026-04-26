# 奶茶扭蛋机

微信小程序 · 奶茶选择工具 · 抽卡机制

## Project Overview

**What this is:** 奶茶扭蛋机 — 一款微信小程序，帮助奶茶爱好者通过扭蛋机形式随机抽取奶茶推荐。

**Core loop:** 选择品牌 → 扭蛋抽取 → 查看结果 → 生成分享图

**Tech stack:** 微信小程序原生开发 + 云开发（概率算法云端实现）

## Key Decisions

- 扭蛋机而非转盘（更强戏剧感和分享欲）
- 每个品牌独立视觉风格
- 奶茶杯形态扭蛋机 + 透明球形胶囊
- 概率算法必须云端实现（不可前端暴露）
- 品牌商标需注意侵权风险（v1使用真实品牌名）

## Files

| Artifact | Location |
|----------|----------|
| Project | `.planning/PROJECT.md` |
| Requirements | `.planning/REQUIREMENTS.md` |
| Roadmap | `.planning/ROADMAP.md` |
| State | `.planning/STATE.md` |
| Research | `.planning/research/` |
| Config | `.planning/config.json` |

## Roadmap

**5 phases** | **14 requirements**

| Phase | Goal |
|-------|------|
| 1 | Project Setup & Auth — 微信授权登录 |
| 2 | Brand Display & Selection — 9品牌扭蛋机 + 切换 |
| 3 | Core Gashapon Experience — 胶囊动画 + 云端概率 |
| 4 | Result Display & Sharing — 重新抽取 + 分享 |
| 5 | User Retention Systems — 积分 + 成就 + 历史 |

## Workflow

```
/gsd-new-project → /gsd-plan-phase → /gsd-execute-phase → repeat
```

- `/gsd-progress` — 查看项目进度
- `/gsd-plan-phase N` — 创建第N阶段详细计划
- `/gsd-execute-phase N` — 执行第N阶段

## Brand List (v1)

1. 一点点
2. 喜茶
3. 霸王茶姬
4. 古茗
5. 茶百道
6. CoCo都可
7. KOI
8. 瑞幸
9. 沪上阿姨

## Important Notes

- 概率算法必须云端实现，不能前端暴露
- 品牌商标使用需注意侵权风险
- Canvas分享图在华为/小米设备可能有兼容性问题，需真机测试
- 本地存储上限10MB，积分/成就等数据必须落云数据库