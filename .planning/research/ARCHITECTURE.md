# Architecture Research

**Domain:** 微信小程序 - 奶茶选择工具（扭蛋机）
**Researched:** 2026-04-23
**Confidence:** MEDIUM

*Note: Official WeChat documentation and Context7 were inaccessible due to network restrictions. Architecture recommendations are based on WeChat mini-program standard patterns documented in 2024-2025.*

## Standard Architecture

### System Overview

WeChat mini-programs follow a **Page + Component** architecture with a built-in data binding system.

```
┌─────────────────────────────────────────────────────────────┐
│                       View Layer (WXML)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  Page   │  │  Page   │  │  Page   │  │  Page   │        │
│  │首页/品牌│  │扭蛋机页 │  │结果页  │  │个人中心 │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
├───────┴────────────┴────────────┴────────────┴──────────────┤
│                    Component Layer (JS)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │  GashaponMachine  │  CapsuleView  │  BrandCard      │    │
│  │  ShareCard        │  ScoreDisplay │  AnimationLayer │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                      Service Layer (JS)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Gashapon │  │  Brand   │  │  Score   │                   │
│  │ Service  │  │ Service  │  │ Service  │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
├─────────────────────────────────────────────────────────────┤
│                      Data Layer                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  LocalStorage  │  InMemory State  │  WeChat API     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Page** | Page-level UI orchestration, lifecycle management, data binding to view | `Page({ data: {}, onLoad() {} })` |
| **GashaponMachine** | Core animation and selection logic | Custom Component with `slot` for capsule |
| **BrandCard** | Brand display with logo and name | `Component({ properties: {} })` |
| **CapsuleView** | Individual capsule rendering, flip animation | CSS animation + `Component` |
| **ShareCard** | Canvas-based share image generation | `wx.createCanvasContext` + `canvasToTempFilePath` |
| **ScoreDisplay** | Points and achievements UI | Data binding to global state |
| **AnimationLayer** | WebGL/Canvas animation for gashapon effect | `wx.createAnimation` or CSS keyframes |

## Recommended Project Structure

```
src/
├── pages/                    # Page directory
│   ├── index/                # Home page (brand selection)
│   │   ├── index.wxml
│   │   ├── index.wxss
│   │   ├── index.js
│   │   └── index.json
│   ├── gashapon/             # Gashapon machine page
│   │   ├── gashapon.wxml
│   │   ├── gashapon.wxss
│   │   ├── gashapon.js
│   │   └── gashapon.json
│   ├── result/               # Result display page
│   │   ├── result.wxml
│   │   ├── result.wxss
│   │   ├── result.js
│   │   └── result.json
│   └── profile/              # User profile / points
│       ├── profile.wxml
│       ├── profile.wxss
│       ├── profile.js
│       └── profile.json
├── components/               # Shared components
│   ├── gashapon-machine/     # Gashapon machine component
│   │   ├── gashapon-machine.wxml
│   │   ├── gashapon-machine.wxss
│   │   ├── gashapon-machine.js
│   │   ├── gashapon-machine.json
│   │   └── animation.wxml    # Inner animation template
│   ├── capsule/              # Capsule component
│   │   ├── capsule.wxml
│   │   ├── capsule.wxss
│   │   ├── capsule.js
│   │   └── capsule.json
│   ├── brand-card/           # Brand display card
│   │   ├── brand-card.wxml
│   │   ├── brand-card.wxss
│   │   ├── brand-card.js
│   │   └── brand-card.json
│   ├── share-card/           # Share image generator
│   │   ├── share-card.wxml   # Hidden canvas component
│   │   └── share-card.js
│   └── score-panel/          # Points display panel
│       ├── score-panel.wxml
│       └── score-panel.js
├── services/                 # Business logic layer
│   ├── gashapon.service.js   # Gashapon logic (random selection)
│   ├── brand.service.js      # Brand data management
│   ├── score.service.js      # Points/achievement logic
│   └── share.service.js      # Share image generation
├── utils/                    # Utilities
│   ├── storage.js            # LocalStorage wrapper
│   ├── random.js             # Random selection algorithm
│   └── canvas.js             # Canvas helper functions
├── constants/                # Constants
│   ├── brands.js             # Brand data (logos, names)
│   ├── milkteas.js           # Milk tea varieties per brand
│   └── config.js             # App configuration
├── state/                    # State management
│   └── store.js              # Simple pub/sub state (or MobX bindings)
└── app.js                    # App entry
```

### Structure Rationale

- **pages/:** Each page is a standalone unit with WXML +WXSS + JS + JSON. WeChat requires this co-location.
- **components/:** Reusable UI components that are not full pages. Used via `usingComponents` in JSON.
- **services/:** Business logic separated from UI. Enables testability and reuse.
- **state/:** Centralized state management. WeChat mini-programs do not have built-in state management; use simple pub/sub or MobX bindings.
- **utils/:** Pure functions with no dependencies.
- **constants/:** Static data (brand list, milk tea varieties).

## Architectural Patterns

### Pattern 1: Page-Component Communication

**What:** Pages communicate with child components via `selectComponent` and properties; components emit events to pages via `triggerEvent`.

**When to use:** Always — this is the primary composition model.

**Trade-offs:** Verbose but explicit; works well with WeChat's built-in data binding.

**Example:**
```javascript
// In page's JSON (to register component)
{
  "usingComponents": {
    "gashapon-machine": "/components/gashapon-machine/index"
  }
}

// In page's JS
Page({
  onTapGashapon() {
    const machine = this.selectComponent('#machine');
    machine.startSpin();
  },
  onCapsuleSelected(e) {
    console.log('Selected:', e.detail.milkTea);
  }
});

// In component's JS
Component({
  methods: {
    startSpin() {
      // Animation logic
      this.triggerEvent('selected', { milkTea: this.data.current });
    }
  }
});
```

### Pattern 2: Animation with wx.createAnimation

**What:** Declarative animation API that outputs CSS keyframes.

**When to use:** Gashapon spin animation, capsule flip reveal.

**Trade-offs:** Limited compared to WebGL but sufficient for 2D animations; hardware accelerated.

**Example:**
```javascript
// In component's JS
const animation = wx.createAnimation({
  duration: 2000,
  timingFunction: 'ease-in-out',
});

animation.rotate3d(0, 1, 0, 720).step();
animation.rotate3d(0, 1, 0, 810).step({ duration: 300, timingFunction: 'ease-out' });

this.setData({ capsuleAnimation: animation.export() });
```

### Pattern 3: Canvas Share Image Generation

**What:** Off-screen canvas to compose share image, then export to temp file.

**When to use:** Generating promotional share images with brand logo, milk tea name, and mini-program QR code.

**Trade-offs:** Canvas API is limited; must use `createCanvasContext` with specific constraints (no foreign objects, fixed font stack).

**Example:**
```javascript
async generateShareImage(brand, milkTea) {
  const ctx = wx.createCanvasContext('share-canvas');
  
  // Background
  ctx.setFillStyle('#FFF8E7');
  ctx.fillRect(0, 0, 400, 500);
  
  // Brand logo
  ctx.drawImage(brand.logoPath, 140, 30, 120, 60);
  
  // Milk tea name
  ctx.setFontSize(24);
  ctx.setFillStyle('#333');
  ctx.fillText(milkTea.name, 200, 200, { textAlign: 'center' });
  
  ctx.draw(true); // Important: async draw
  
  return new Promise(resolve => {
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'share-canvas',
        success: res => resolve(res.tempFilePath)
      });
    }, 300);
  });
}
```

### Pattern 4: Local State with Pub/Sub

**What:** Simple reactive state management without external libraries.

**When to use:** MVP phase; avoid MobX/mini-program bindings complexity.

**Trade-offs:** Works well for small apps; becomes unwieldy at scale.

**Example:**
```javascript
// state/store.js
const listeners = {};
const state = { points: 0, achievements: [], history: [] };

function update(partial) {
  Object.assign(state, partial);
  Object.values(listeners).forEach(fn => fn(state));
}

function subscribe(key, fn) {
  listeners[key] = fn;
  fn(state); // Initial call
}

// In page
const store = require('../state/store.js');
Page({
  onLoad() {
    store.subscribe('user', this.updateUI.bind(this));
  },
  updateUI(state) {
    this.setData({ points: state.points });
  }
});
```

## Data Flow

### Request Flow

```
[User Tap "扭一下"]
    ↓
[Page: gashapon.js] → [GashaponService.selectRandom()]
    ↓
[GashaponService] → [Random Algorithm] → [Returns milkTea object]
    ↓
[Page: setData({ currentMilkTea: result })]
    ↓
[AnimationTrigger] → [wx.createAnimation] → [View updates]
    ↓
[Result Displayed]
    ↓
[ScoreService.addPoints(1)] → [Store.update({ points: +1 })]
    ↓
[ScorePanel re-renders]
```

### State Management

```
┌──────────────────────────────────────────────────────────────┐
│                      In-Memory State                          │
│  { brands[], currentBrand, currentMilkTea, points, history }│
└─────────────────────────────┬────────────────────────────────┘
                              │ setData() (re-render)
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                     WXML Data Binding                         │
│  {{currentMilkTea.name}}  {{points}}  {{history.length}}     │
└─────────────────────────────┬────────────────────────────────┘
                              │ User actions
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                        Event Handlers                         │
│  onGashaponTap() → Services → Store.update() → setData()     │
└──────────────────────────────────────────────────────────────┘
```

### Key Data Flows

1. **Brand Selection Flow:** User taps brand card → Page navigates to gashapon page with brand ID → GashaponService loads brand's milk teas → Machine renders capsules.

2. **Gashapon Spin Flow:** User taps "扭一下" → Animation starts (2-3 sec) → Random selection occurs → Capsule flip animation → Result displayed → Points updated.

3. **Share Generation Flow:** User taps "分享" → ShareCard component draws on hidden canvas → Exports to temp file → Opens share modal.

4. **Persistence Flow:** App onShow → Load from LocalStorage → Store.initialize() → Pages subscribe to state.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Single-instance, LocalStorage persistence, no backend |
| 1k-100k users | Add WeChat cloud database (云开发) for milk tea data, leaderboard |
| 100k+ users | Move to self-hosted backend, separate ranking API, CDN for images |

### Scaling Priorities

1. **First bottleneck: Data management** — LocalStorage becomes slow with history > 100 entries. Migrate to WeChat Cloud (`wx.cloud.database()`).

2. **Second bottleneck: Share image generation** — Canvas on low-end devices is slow. Pre-render brand templates as images.

## Anti-Patterns

### Anti-Pattern 1: Deep nesting with Component

**What people do:** Over-componentizing — making every small element a Component.

**Why it's wrong:** Each Component has overhead (`properties`, `data`, `observers`, `lifetimes`). Over-use causes performance issues and code fragmentation.

**Do this instead:** Start with WXML template blocks; extract to Component only when reuse is needed (≥2 usage).

### Anti-Pattern 2: Synchronous setData on large data

**What people do:** `this.setData({ largeArray: newArray })` with arrays > 50 items.

**Why it's wrong:** WeChat mini-programs re-render the entire view tree on setData. Large updates cause visible jank.

**Do this instead:** Use keys with indices: `this.setData({ 'array[0].name': 'newName' })` for partial updates.

### Anti-Pattern 3: Blocking UI during animation

**What people do:** Using `wx.showLoading` + synchronous sleep during gashapon animation.

**Why it's wrong:** The animation runs on the UI thread; blocking calls freeze the animation frame.

**Do this instead:** Use `wx.createAnimation` which runs independently; use `setTimeout` or `requestAnimationFrame` for timing.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| WeChat Open API | `wx.login()` for anonymous user ID | For future leaderboard, sharing |
| WeChat Cloud | `wx.cloud.database()` for persistence | 1GB free tier; good for MVP |
| WeChat Ad | `wx.createRewardedVideoAd()` for激励视频 | Requires WeChat Ad account |
| Mini Program Analytics | `wx.reportAnalytics()` | Built-in event tracking |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Page ↔ Component | `triggerEvent` / `selectComponent` | Parent-to-child via properties |
| Page ↔ Service | Direct function calls | Services are plain JS modules |
| Service ↔ Store | Pub/sub pattern | Services publish state changes |
| Store ↔ Persistence | LocalStorage wrapper | Auto-sync on state change |

## Sources

- [WeChat Mini Program Framework Documentation](https://developers.weixin.qq.com/miniprogram/dev/framework/) — Official framework overview
- [TDesign MiniProgram Component Library](https://github.com/Tencent/tdesign-miniprogram) — WeChat official UI pattern reference
- [MobX MiniProgram Bindings](https://github.com/wechat-miniprogram/mobx-miniprogram-bindings) — State management pattern
- [Glass-Easel](https://github.com/wechat-miniprogram/glass-easel) — Alternative component framework

---

*Architecture research for: 微信小程序奶茶选择工具*
*Researched: 2026-04-23*
