# Phase 1: Project Setup & Authentication - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-26
**Phase:** 01-project-setup-authentication
**Areas discussed:** 登录入口设计, 未登录用户处理, 项目结构

---

## 登录入口设计

| Option | Description | Selected |
|--------|-------------|----------|
| 首页直接显示微信登录按钮 | 未登录时首页顶部显示登录按钮 | |
| 用户点击"扭一下"时才提示登录 | 点击抽取时才触发登录授权 | ✓ |
| 用户点击品牌时才提示登录 | 浏览品牌列表无需登录 | |

**User's choice:** 用户点击"扭一下"时才提示登录
**Notes:** 用户可以先浏览品牌列表，决定要抽取时才需要登录

---

## 未登录用户处理

| Option | Description | Selected |
|--------|-------------|----------|
| 不允许未登录用户抽取 | 未登录只能浏览，无法使用核心功能 | |
| 允许未登录抽取，结果页提示登录保存 | 可以先抽取，结果页引导登录 | ✓ |

**User's choice:** 允许未登录抽取，但结果页提示登录保存记录
**Notes:** 降低使用门槛，引导用户最终登录

---

## 项目结构

| Option | Description | Selected |
|--------|-------------|----------|
| 首页 + 抽取页 + 结果页 + 个人中心 | 完整页面结构 | ✓ |
| 首页 + 结果页（合并抽取流程） | 简化结构 | |
| 首页 + 抽取页 + 结果页 | 无个人中心 | |

**User's choice:** 首页（品牌列表）+ 抽取页（单个品牌扭蛋机）+ 结果页 + 个人中心
**Notes:** 需要个人中心展示积分、成就、历史记录

---

## Claude's Discretion

- 登录状态管理方式
- 授权失败时的降级处理
- 用户中心页面具体内容

