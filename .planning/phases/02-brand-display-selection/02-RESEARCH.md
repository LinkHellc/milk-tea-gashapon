# Phase 2: Brand Display & Selection - Research

**Researched:** 2026-04-26
**Domain:** 微信小程序品牌展示与切换
**Confidence:** MEDIUM

## Summary

Phase 2 implements the brand selection homepage and brand switching functionality. The homepage displays 9 milk tea brands in a horizontal swiper carousel (3 brands per screen, 3 screens total), where each brand appears as a realistic milk tea cup-shaped card. Users tap a brand card to enter the gashapon page, which includes a dropdown brand switcher at the top.

**Primary recommendation:** Use WeChat swiper component with `indicator-dots` and `display-multiple-items` properties. Define brand data as a local JavaScript array first (cloud migration in Phase 5). Brand cards use CSS to simulate a milk tea cup appearance (rounded rectangle body + lid strip + straw hole). Macaron pastel colors with soft gradients create the overall atmosphere.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-08:** 首页布局采用横向滚动轮播（swiper），每屏显示3个品牌，共3屏可浏览全部9个品牌
- **D-09:** 品牌卡片采用拟物奶茶杯造型——立式奶茶杯外观，圆角方块+杯盖+吸管孔，真实奶茶杯比例
- **D-10:** 每个品牌使用各自的主色调（一点点绿色系、喜茶粉色系、霸王茶姬棕色系等），强化品牌识别度
- **D-11:** 抽取页（gashapon）顶部设有当前品牌名称+下拉箭头，点击展开品牌列表直接切换，无需返回首页
- **D-12:** 马卡龙色系+柔和渐变背景——低饱和度马卡龙色（薄荷绿、樱花粉、奶油黄），温暖柔和，契合奶茶主题

### Claude's Discretion
- 轮播指示器样式（圆点 or 数字）
- 品牌卡片的阴影/高度细节
- 下拉选择器的展开动画

### Deferred Ideas (OUT OF SCOPE)
None — all decisions captured above.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BRAND-01 | 首页展示9个奶茶品牌，每个品牌显示logo和名字，入口为奶茶杯形态扭蛋机 | Swiper carousel implementation, milk tea cup card CSS patterns, brand color palette |
| BRAND-02 | 用户可随时切换品牌 | Dropdown picker pattern in gashapon page, brand switching via URL parameter |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Brand list display | Browser/Client | — | WXML wx:for over local data array |
| Swiper carousel | Browser/Client | — | WeChat swiper component, CSS transforms |
| Brand card rendering | Browser/Client | — | CSS-styled milk tea cup shape |
| Brand switching | Browser/Client | API/Backend | URL parameter brandId, no cloud call needed |
| Brand data storage | Browser/Client | — | Local JS array, cloud migration in Phase 5 |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| WeChat swiper component | Native | Horizontal carousel | D-08 mandates swiper layout |
| WeChat picker component | Native | Brand dropdown selector | Native dropdown, minimal code |
| wx.navigateTo | Native | Page navigation with brandId | Standard WeChat navigation |
| wx.getStorageSync | Native | Check login state | Phase 1 established pattern |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| — | — | — | Phase 2 uses no external libraries beyond native WeChat APIs |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Swiper (D-08 locked) | Grid layout, vertical list | Carousel mandated by decision |
| CSS milk tea cup (D-09 locked) | SVG milk tea cup illustration | CSS approach uses less assets, easier to theme per brand |

**Installation:** No npm packages needed — pure WeChat native components.

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      INDEX PAGE (首页)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              SWIPER (D-08: 3 items/screen)           │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐              │   │
│  │  │ Brand 1 │  │ Brand 2 │  │ Brand 3 │  ← Page 1    │   │
│  │  │ 🥤     │  │ 🥤     │  │ 🥤     │              │   │
│  │  └─────────┘  └─────────┘  └─────────┘              │   │
│  │  ○ ○ ○  ← indicator dots                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│            tap brand card │ wx.navigateTo                    │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              GASHAPON PAGE (抽取页)                   │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │ ▼ BrandName  ← dropdown trigger (D-11)        │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │         MILK TEA CUP MACHINE                 │   │   │
│  │  │         (CSS styled, brand color)            │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │              [ 扭一下 ] button                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure
```
pages/
├── index/
│   ├── index.wxml      # swiper + brand cards
│   ├── index.wxss      # milk tea cup CSS, swiper styles
│   ├── index.js        # brands array, navigation handlers
│   └── index.json      # page config
└── gashapon/
    ├── gashapon.wxml   # machine + dropdown brand picker
    ├── gashapon.wxss    # machine styles, dropdown animation
    ├── gashapon.js     # brand switch logic, dropdown state
    └── gashapon.json   # page config
data/
└── brands.js           # brand data array (Phase 2 local, Phase 5 cloud)
```

### Pattern 1: Milk Tea Cup Card (D-09)
**What:** CSS-styled card that resembles a physical milk tea cup
**When to use:** Brand display on index page
**Example:**
```xml
<!-- index.wxml -->
<view class="brand-card" style="background: {{brand.color}};">
  <view class="cup-lid"></view>
  <view class="cup-body">
    <image class="brand-logo" src="{{brand.logo}}"></image>
    <text class="brand-name">{{brand.name}}</text>
  </view>
  <view class="straw-hole"></view>
</view>
```
```css
/* index.wxss */
.brand-card {
  width: 280rpx;
  height: 360rpx;
  border-radius: 20rpx;
  position: relative;
  overflow: hidden;
}
.cup-lid {
  height: 40rpx;
  background: rgba(0,0,0,0.2);
  border-radius: 20rpx 20rpx 0 0;
}
.cup-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.straw-hole {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  position: absolute;
  top: 50rpx;
  right: 40rpx;
}
```

### Pattern 2: Brand Dropdown Picker (D-11)
**What:** Tap brand name + arrow to reveal picker, select to switch brand
**When to use:** Gashapon page brand switching
**Example:**
```xml
<!-- gashapon.wxml -->
<view class="brand-selector" bindtap="toggleBrandPicker">
  <text class="current-brand">{{currentBrand.name}}</text>
  <text class="arrow">▼</text>
</view>
<picker-view wx:if="{{showBrandPicker}}" class="brand-picker" bindchange="onBrandChange">
  <picker-view-column>
    <view wx:for="{{brands}}" class="picker-item">{{item.name}}</view>
  </picker-view-column>
</picker-view>
```

### Pattern 3: Swiper Carousel (D-08)
**What:** Horizontal swiper showing 3 brands per screen
**When to use:** Index page brand list
**Example:**
```xml
<!-- index.wxml -->
<swiper class="brand-swiper" indicator-dots="{{true}}" autoplay="{{false}}" circular="{{false}}" previous-margin="30rpx" next-margin="30rpx">
  <block wx:for="{{brandPages}}">
    <swiper-item class="brand-page">
      <view wx:for="{{item}}" class="brand-card-wrapper" bindtap="onBrandTap" data-brand="{{item}}">
        <!-- milk tea cup card -->
      </view>
    </swiper-item>
  </block>
</swiper>
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Horizontal scrolling | Custom touch gesture handlers | WeChat swiper component | Swiper handles momentum, indicators, and edge cases correctly |
| Brand picker dropdown | Custom modal/popup | WeChat picker-view | Native component, better UX, no z-index issues |
| Page navigation with params | Event channels | wx.navigateTo URL params | Simpler, Phase 1 established pattern |

**Key insight:** WeChat provides high-quality native components for carousel and selection. Custom implementations cause performance and compatibility issues on low-end devices.

## Common Pitfalls

### Pitfall 1: Swiper indicator dots styling
**What goes wrong:** Indicator dots don't match macaron pastel theme, look like default WeChat blue
**Why it happens:** WeChat swiper indicator-dots are styled by the system, limited CSS control
**How to avoid:** Hide default dots (`indicator-dots="{{false}}"`), implement custom dot indicators using `swiper-change` event
**Warning signs:** Indicator dots look "default" or "out of place"

### Pitfall 2: Brand card colors too similar
**What goes wrong:** Cards hard to distinguish at a glance, brand identity lost
**Why it happens:** Macaron palette is inherently soft, some brand colors may clash
**How to avoid:** Ensure each brand color has sufficient saturation contrast. Test with colorblind simulation.
**Warning signs:** User cannot quickly identify brands by color alone

### Pitfall 3: Large brand logos causing layout shift
**What goes wrong:** Images load asynchronously, card sizes jump around
**Why it happens:** No explicit image dimensions, aspect ratio varies by logo
**How to avoid:** Set fixed width/height on logo images or use `mode="aspectFit"` with fixed container
**Warning signs:** Layout visibly shifts when images finish loading

### Pitfall 4: Gashapon page brand selector not updating
**What goes wrong:** After switching brand on gashapon page, navigation back to index shows wrong brand selected
**Why it happens:** No state synchronization between pages
**How to avoid:** Use `wx.navigateBack` with `events` to notify previous page of brand change, or use global app data
**Warning signs:** Index page shows previously selected brand after switching

## Brand Color Palette

Based on D-10 (each brand uses its main color):

| Brand | Primary Color | Hex Approximation | Notes |
|-------|--------------|-------------------|-------|
| 一点点 | Green | #4CAF50 | Green tea brand identity |
| 喜茶 | Pink | #E91E63 | Pink tea culture |
| 霸王茶姬 | Brown | #8D6E63 | Tea brown, premium feel |
| 古茗 | Dark Green | #2E7D32 | Forest green, fresh |
| 茶百道 | Blue | #2196F3 | Clean, modern blue |
| CoCo都可 | Orange | #FF9800 | Warm, energetic |
| KOI | Gold | #FFC107 | Premium, coffee undertones |
| 瑞幸 | Blue | #007AFF | Corporate blue, coffee chain |
| 沪上阿姨 | Purple | #9C27B0 | Fashionable, trendy |

**Source:** [ASSUMED] Brand colors based on known brand identities. Actual brand guidelines may vary — verification recommended before Phase 3.

## Code Examples

### Brand Data Structure
```javascript
// data/brands.js
const brands = [
  { id: 'yidiandian', name: '一点点', color: '#4CAF50', logo: '/assets/brands/yidiandian.png' },
  { id: 'xichaha', name: '喜茶', color: '#E91E63', logo: '/assets/brands/xichaha.png' },
  { id: 'bawangchaji', name: '霸王茶姬', color: '#8D6E63', logo: '/assets/brands/bawangchaji.png' },
  { id: 'guming', name: '古茗', color: '#2E7D32', logo: '/assets/brands/guming.png' },
  { id: 'chabaidao', name: '茶百道', color: '#2196F3', logo: '/assets/brands/chabaidao.png' },
  { id: 'coco', name: 'CoCo都可', color: '#FF9800', logo: '/assets/brands/coco.png' },
  { id: 'koi', name: 'KOI', color: '#FFC107', logo: '/assets/brands/koi.png' },
  { id: 'ruixing', name: '瑞幸', color: '#007AFF', logo: '/assets/brands/ruixing.png' },
  { id: 'hushangayi', name: '沪上阿姨', color: '#9C27B0', logo: '/assets/brands/hushangayi.png' }
];
module.exports = { brands };
```

### Navigation to Gashapon
```javascript
// index.js
const { brands } = require('../../data/brands.js');

Page({
  data: {
    brands: brands,
    brandPages: [] // split into pages of 3 for swiper
  },

  onLoad() {
    // Split brands into pages of 3 for swiper
    const pages = [];
    for (let i = 0; i < brands.length; i += 3) {
      pages.push(brands.slice(i, i + 3));
    }
    this.setData({ brandPages: pages });
  },

  onBrandTap(e) {
    const brand = e.currentTarget.dataset.brand;
    wx.navigateTo({
      url: `/pages/gashapon/gashapon?brandId=${brand.id}&brandName=${encodeURIComponent(brand.name)}`
    });
  }
});
```

### Gashapon Page Brand Switching
```javascript
// gashapon.js
const { brands } = require('../../data/brands.js');

Page({
  data: {
    brands: brands,
    currentBrand: null,
    showBrandPicker: false
  },

  onLoad(options) {
    if (options.brandId) {
      const brand = brands.find(b => b.id === options.brandId);
      this.setData({ currentBrand: brand });
      wx.setNavigationBarTitle({ title: brand.name });
    }
  },

  toggleBrandPicker() {
    this.setData({ showBrandPicker: !this.data.showBrandPicker });
  },

  onBrandChange(e) {
    const index = e.detail.value[0];
    const brand = this.data.brands[index];
    this.setData({ currentBrand: brand, showBrandPicker: false });
    wx.setNavigationBarTitle({ title: brand.name });
  }
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Vertical scroll list | Horizontal swiper carousel | D-08 (2026-04-26) | Better mobile UX for browsing multiple items |
| Image-based milk tea cup | CSS-styled milk tea cup | D-09 (2026-04-26) | Lighter assets, easier to theme per brand |
| Modal brand selector | Native picker dropdown | D-11 (2026-04-26) | Native feel, better performance |

**Deprecated/outdated:**
- None relevant to Phase 2

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Brand colors (#4CAF50 for 一点点, #E91E63 for 喜茶, etc.) are approximately correct | Brand Color Palette | Brand may have updated their color identity; not critical for Phase 2 as colors are for visual differentiation, not brand compliance |
| A2 | Brand logos will be provided as assets by Phase 2 execution | Brand Data Structure | If logos not available, can use text-only fallback or placeholder images |
| A3 | Milk tea cup card proportions (280rpx × 360rpx) work well on common phone sizes | Pattern 1 | May need adjustment based on real device testing |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed.

## Open Questions

1. **Brand logos source**
   - What we know: Brand data needs logo images, no assets directory exists yet
   - What's unclear: Where will brand logos come from (user upload, placeholder, external URL)?
   - Recommendation: Use placeholder colored circles with brand initials for Phase 2 MVP

2. **Swiper pagination style**
   - What we know: D-08 mandates swiper, pagination style is Claude's discretion
   - What's unclear: Circle dots vs number indicators (1/3, 2/3, 3/3)?
   - Recommendation: Circle dots with current dot highlighted — more mobile-native feel

3. **Dropdown animation**
   - What we know: D-11 requires brand picker on gashapon page
   - What's unclear: Smooth expand animation vs instant show?
   - Recommendation: Instant show for MVP, animation as enhancement

## Environment Availability

> Step 2.6: SKIPPED (no external dependencies identified)

Phase 2 uses only WeChat native components. No external tools, services, or CLI utilities required beyond the existing WeChat developer tools.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | WeChat Mini Program (built-in testing) |
| Config file | None — use native WeChat developer tools |
| Quick run command | Build and preview in WeChat developer tools |
| Full suite command | N/A — manual testing required for UI/UX |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BRAND-01 | Index displays 9 brands in carousel | Manual | Preview in dev tools | ✅ index page exists |
| BRAND-01 | Each brand card looks like milk tea cup | Manual | Visual inspection | ✅ CSS patterns defined |
| BRAND-01 | Brand colors match brand identity | Manual | Visual comparison | ✅ colors documented |
| BRAND-02 | Gashapon page has brand switcher | Manual | Tap dropdown | ✅ gashapon page exists |
| BRAND-02 | Switching brand navigates correctly | Manual | Select different brand | ✅ navigation code defined |

### Wave 0 Gaps
- [ ] `data/brands.js` — brand data array with colors and placeholder logos
- [ ] `index.wxml` — swiper with brand cards
- [ ] `index.wxss` — milk tea cup CSS styling
- [ ] `gashapon.wxml` — brand dropdown picker
- [ ] `gashapon.js` — brand switching logic

*(Existing infrastructure: Phase 1 created pages/index and pages/gashapon with placeholder content)*

## Security Domain

> OMITTED — Phase 2 is UI/display only, no authentication, data processing, or user data handling beyond URL parameters.

Applicable ASVS categories do not apply:
- V2 Authentication: Not in scope (Phase 1 covers auth)
- V3 Session Management: Not in scope
- V4 Access Control: Not applicable
- V5 Input Validation: URL parameters (brandId) are validated against known brand list — no security risk
- V6 Cryptography: Not applicable

## Sources

### Primary (HIGH confidence)
- WeChat Mini Program swiper component documentation — indicator-dots, display-multiple-items configuration
- WeChat Mini Program picker-view documentation — dropdown implementation

### Secondary (MEDIUM confidence)
- WeChat developer experience (general knowledge)
- Existing Phase 1 code patterns in project

### Tertiary (LOW confidence)
- Brand color approximations — [ASSUMED] based on general knowledge, not verified against current brand guidelines

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — WeChat native components are well-documented
- Architecture: HIGH — patterns are straightforward mobile UX
- Pitfalls: MEDIUM — brand color assumptions untested

**Research date:** 2026-04-26
**Valid until:** 2026-05-26 (30 days, stable domain)
