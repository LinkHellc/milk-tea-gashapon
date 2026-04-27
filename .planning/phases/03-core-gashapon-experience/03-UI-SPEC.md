---
phase: 3
slug: 03-core-gashapon-experience
status: draft
shadcn_initialized: false
preset: not applicable
created: 2026-04-27
---

# Phase 3 — UI Design Contract

> Visual and interaction contract for Phase 3: Core Gashapon Experience. Based on gsd-ui-researcher synthesis from 03-CONTEXT.md.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | none (WeChat native components) |
| Icon library | WeChat native icons |
| Font | System default (WeChat system font stack) |
| Unit | rpx (responsive pixel, 750rpx = screen width) |

---

## Spacing Scale

All values in rpx, multiples of 4 as required.

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4rpx | Icon micro gaps |
| sm | 8rpx | Inline element spacing |
| md | 16rpx | Default element spacing, card internal padding |
| lg | 24rpx | Section padding, between cards |
| xl | 32rpx | Layout gaps between major sections |
| 2xl | 48rpx | Major section breaks |
| 3xl | 64rpx | Page-level padding |

**Exceptions:** Animation container spacing — center-aligned with flex, minimal padding to maximize animation viewport.

---

## Typography

All sizes in rpx (WeChat converts to px). WeChat base font size 20rpx.

| Role | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Body | 28rpx | 400 (normal) | 1.5 | General text, milk tea descriptions |
| Label | 24rpx | 400 (normal) | 1.4 | Captions, hints, secondary text |
| Heading | 36rpx | 600 (semibold) | 1.2 | Result milk tea name display |
| Display | 48rpx | 600 (semibold) | 1.2 | Hero text, result reveal |

**Font weights:** Only 2 weights used: 400 (normal) and 600 (semibold).

---

## Color

### Global Palette (from Phase 2 D-12)

| Role | Hex | Usage |
|------|-----|-------|
| Dominant (60%) | #f8f8f8 | Page background |
| Secondary (30%) | #ffffff | Cards, dropdown panels |
| Accent (10%) | #ffb7b2 | CTA button, highlights |
| Destructive | #e57373 | Error states only |
| Text Primary | #333333 | Headings, body text |
| Text Secondary | #999999 | Captions, hints |
| Text Tertiary | #cccccc | Placeholders |

### Per-Brand Colors (D-10, carried from Phase 2)

Each brand machine uses its own brand-primary color as background gradient.

| Brand | Brand Color |
|-------|-------------|
| 一点点 | #71C685 |
| 喜茶 | #F5A6A0 |
| 霸王茶姬 | #B89B85 |
| 古茗 | #5B9A6E |
| 茶百道 | #5B9ECF |
| CoCo都可 | #E8A87C |
| KOI | #D4A84B |
| 瑞幸 | #5B8ABE |
| 沪上阿姨 | #B87CBB |

### Capsule Colors

| Element | Color | Notes |
|---------|-------|-------|
| Capsule shell | rgba(255,255,255,0.3) | Transparent with white edge highlights |
| Capsule highlight | #ffffff at 60% opacity | Creates 3D sphere illusion |
| Pearl inside | #F5A6A0 (pink) | Bubble tea pearl color |

### Gradient Background (D-12)
- Background: Linear gradient from #f8f8f8 to #fff5f5 (soft white to barely-there pink)
- Direction: Top to bottom

---

## Animation Specifications

### Animation Sequence (D-01 to D-05 from context)

Total duration: 1.5-2 seconds

| Step | Element | Duration | Description |
|------|---------|---------|-------------|
| 1 | Cup tilt | 0.2s | Cup rotates 15° to bottom-right (simulating drinking posture) |
| 2 | Capsule spiral rise | 0.8-1s | Capsule spirals up inside straw from bottom to top |
| 3 | Capsule eject | 0.2s | Capsule pops out above cup, continues slight rotation |
| 4 | Capsule open | 0.3s | Capsule splits open in middle, reveals pearl + milk tea name |
| 5 | Result display | continuous | Milk tea name + pearl displayed, cup returns to neutral |

### Animation CSS Properties

```
/* Cup tilt animation */
.cup-tilt {
  transform: rotate(15deg);
  transition: transform 0.2s ease-in;
}

/* Capsule spiral rise */
@keyframes capsule-spiral {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  20% { opacity: 1; }
  80% { transform: translateY(-300rpx) rotate(720deg); }
  100% { transform: translateY(-350rpx) rotate(900deg); }
}

/* Capsule open */
@keyframes capsule-open {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(0); }
}
```

---

## Component Inventory

### 1. Capsule (Animation Element)

**Visual:** Transparent sphere with white highlight, 3D illusion via gradient overlay

**States:**
- Hidden: opacity 0, scale 0, inside straw
- Rising: opacity 1, spiraling upward
- Ejected: above cup, rotating
- Open: splits in middle, content revealed

**CSS details:**
- Container: 120rpx × 120rpx circle
- Background: radial gradient (white center → transparent edge)
- Border: 2rpx solid rgba(255,255,255,0.5)
- Box-shadow: 0 0 20rpx rgba(255,255,255,0.3)

### 2. Pearl (Inside Capsule)

**Visual:** Small pink circle representing bubble tea pearl

**CSS details:**
- 40rpx diameter circle
- Background: #F5A6A0 (pink pearl color)
- Border-radius: 50%
- Positioned inside opened capsule

### 3. Result Card (Result Page)

**Visual:** Card displaying milk tea name, brand, and description

**Dimensions:** 600rpx × auto, centered, border-radius 24rpx

**Structure:**
```
┌─────────────────────────────────┐
│       [Pearl Icon - 60rpx]      │
│                                 │
│       奶茶名称 (48rpx, bold)    │
│       品牌名 (28rpx)            │
│                                 │
│   一句话介绍 (24rpx, secondary) │
│                                 │
│       [User Avatar + Name]     │
└─────────────────────────────────┘
```

**CSS details:**
- Background: #ffffff
- Box-shadow: 0 12rpx 32rpx rgba(0,0,0,0.15)
- Padding: 48rpx
- Border-radius: 24rpx

### 4. Gashapon Button ("扭一下")

**Dimensions:** 400rpx × 96rpx, border-radius 48rpx (pill shape)

**Visual:**
- Background: #ffb7b2 (accent)
- Text: #ffffff, 36rpx, semibold
- Shadow: 0 8rpx 24rpx rgba(255,183,178,0.4)

**States:**
- Default: as above
- Hover/pressed: opacity 0.85, shadow reduced
- Disabled (during spin): background #cccccc, shadow none
- Loading: pulsing opacity animation

---

## Page Layouts

### Gashapon Page (pages/gashapon)

```
┌─────────────────────────────────────────┐
│  Navigation bar: brand name + back     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ▼ 喜茶                       ▼  │   │  ← Brand dropdown (D-11)
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │      [Milk Tea Cup]            │   │  ← CSS cup, tilted during animation
│  │       with straw               │   │
│  │                                 │   │
│  │      [Capsule animation]       │   │  ← Animates above cup during spin
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│         [  扭一下  ]                   │  ← CTA button (disabled during spin)
│                                         │
│  (User info from Phase 1 if present)   │
└─────────────────────────────────────────┘
```

### Result Page (pages/result)

```
┌─────────────────────────────────────────┐
│  Navigation bar: 抽取结果              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │      ○ (Pearl - 80rpx)         │   │  ← Pearl graphic
│  │                                 │   │
│  │      波霸奶茶                   │   │  ← Milk tea name (48rpx bold)
│  │      一点点                     │   │  ← Brand name
│  │                                 │   │
│  │   大颗珍珠，嚼劲十足            │   │  ← Description (24rpx)
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [  再扭一次  ]  [  分享结果  ]       │  ← Action buttons
│                                         │
│  (User avatar + name if logged in)     │
└─────────────────────────────────────────┘
```

---

## Copywriting Contract

| Element | Copy | Notes |
|---------|------|-------|
| Primary CTA | 扭一下 | Button on gashapon page |
| Loading state | 抽取中... | Shown during cloud call + animation |
| Result page title | 抽取结果 | Navigation bar |
| Result milk tea name | {奶茶名} | Large, centered, bold |
| Result brand | {品牌名} | Below milk tea name |
| Result description | {一句话介绍} | Below brand |
| Retry button | 再扭一次 | On result page |
| Share button | 分享结果 | On result page (Phase 4) |
| Error: cloud failed | 网络开小差，请重试 | Show when cloud call fails |

---

## Navigation

- Gashapon → Result: `wx.navigateTo` with URL params `?brandId=xxx&brandName=yyy&milkTea=xxx&description=yyy`
- Result → Gashapon (retry): `wx.navigateBack({ delta: 1 })`
- Cloud probability call: parallel with animation start, no blocking

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| none | none | not required — WeChat native components only |

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending

---

## Pre-Population Summary

| Source | Decisions Used |
|--------|----------------|
| 03-CONTEXT.md | D-01 to D-13 (animation sequence, capsule reveal, cup tilt, brand colors, result card) |
| 02-CONTEXT.md | D-10 (brand colors), D-12 (global palette), page structure |
| 02-UI-SPEC.md | Spacing scale, typography table, button specs (carried forward) |
| Project | WeChat native components, rpx units |
