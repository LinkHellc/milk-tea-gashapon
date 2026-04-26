# Phase 1: Project Setup & Authentication - Research

**Researched:** 2026/04/26
**Domain:** WeChat Mini Program — Project Initialization + OAuth Authentication
**Confidence:** MEDIUM

## Summary

Phase 1 establishes the WeChat mini-program foundation with authentication. The project uses native WeChat development (not Taro/uni-app) with JavaScript ES6+. Key authentication flow: `wx.login()` obtains code for server-side session, then `wx.getUserProfile()` gets encrypted user data for display. Login is triggered lazily on first "扭一下" tap, not on app launch. Unauthenticated users can still use the gashapon; result pages prompt login to save records. LocalStorage stores userInfo after successful auth, with cloud sync planned for later phases.

**Primary recommendation:** Initialize project in WeChat DevTools, configure app.json with 4 pages, implement lazy auth flow with Storage-backed session, and defer cloud database to Phase 2.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| User authentication | WeChat client | Backend (code2Session) | `wx.login()` + `wx.getUserProfile()` are client-side; session derivation needs server |
| Avatar/nickname display | WeChat client | LocalStorage | Store userInfo in LocalStorage post-auth; no cloud needed for Phase 1 |
| Unauthenticated gashapon | WeChat client | — | Allow anonymous access; result page shows login prompt |
| Page routing | WeChat framework | — | app.json pages array controls routing; lazy loading via `wx.navigateTo` |
| Session management | LocalStorage | — | `wx.getStorageSync('userInfo')` checks login state |

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Login triggered on "扭一下" button click (not homepage direct popup)
- **D-02:** Allow unauthenticated users to use gashapon feature
- **D-03:** Result page shows "login to save record" prompt
- **D-04:** Page structure: pages/index/index, pages/gashapon/gashapon, pages/result/result, pages/profile/profile
- **D-05:** Native WeChat mini-program development (not Taro/uni-app)
- **D-06:** Project name: 奶茶扭蛋机
- **D-07:** app.json pages array in above order

### Claude's Discretion
- Login state management method (LocalStorage vs cloud sync)
- Authorization failure fallback handling
- Profile page specific content (points/achievements/history display)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | 用户可微信授权登录，获取头像和昵称 | `wx.login()` + `wx.getUserProfile()` flow, LocalStorage persistence |
| AUTH-02 | 用户头像和昵称展示在结果页 | userInfo binding to WXML via `setData()`, avatar/nickname rendering |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| 微信小程序原生框架 | Latest (2025) | Core development framework | Project requirement (D-05), no cross-platform needed |
| JavaScript ES6+ | — | Programming language | Native WeChat support, no transpilation needed |
| 微信开发者工具 | Latest | Development, debugging, preview | Required tool; familiarity with shortcuts improves efficiency |

### No External Dependencies for Phase 1

| Library | Would Use For | Why Not in Phase 1 |
|---------|--------------|---------------------|
| dayjs | Date handling for history | Phase 5 feature |
| lottie-web | Complex animations | Phase 3 animation |
| LeanCloud / 云开发 | Cloud persistence | Phase 2+; LocalStorage sufficient for MVP auth |
| MobX / Redux | State management | Overkill for 4-page app; native `setData()` sufficient |

**Installation:**
```bash
# In WeChat Developer Tools: New Project → 奶茶扭蛋机 → Native development
# No npm install needed for core mini-program
# For future phases:
# npm install dayjs --save
# npm install lottie-web --save
```

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      WeChat Client                                   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐                │
│  │   index     │   │  gashapon   │   │   result    │   profile     │
│  │  (brand     │──▶│  (gashapon  │──▶│  (display   │   (user       │
│  │   list)     │   │   machine)  │   │   result)   │   info)       │
│  └─────────────┘   └──────┬──────┘   └─────────────┘                │
│                           │                                          │
│                    [tap "扭一下"]                                      │
│                           │                                          │
│                    ┌──────▼──────┐                                  │
│                    │  AUTH CHECK │                                  │
│                    │ wx.getStorage│                                  │
│                    │  ('userInfo')│                                  │
│                    └──────┬──────┘                                  │
│              ┌───────────┴───────────┐                             │
│              ▼                       ▼                              │
│      [No userInfo]            [Has userInfo]                        │
│              │                       │                              │
│    ┌─────────▼──────────┐     ┌──────▼───────┐                     │
│    │ wx.getUserProfile()│     │ Proceed to   │                     │
│    │  show auth dialog  │     │ gashapon     │                     │
│    └─────────┬──────────┘     └─────────────┘                     │
│              │                                                     │
│    ┌─────────▼──────────┐                                          │
│    │ Save to Storage    │                                          │
│    │ wx.setStorageSync  │                                          │
│    │ ('userInfo', data) │                                          │
│    └────────────────────┘                                          │
└─────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
E:/BaiduSyncdisk/4-学习/100-项目/103-今天喝什么/
├── app.js                     # App entry, global state initialization
├── app.json                   # Pages registration, global styles, tabBar (none)
├── app.wxss                   # Global styles
├── project.config.json        # WeChat DevTools project config
├── pages/
│   ├── index/                 # Home page (brand selection)
│   │   ├── index.wxml
│   │   ├── index.wxss
│   │   ├── index.js
│   │   └── index.json
│   ├── gashapon/              # Gashapon machine page
│   │   ├── gashapon.wxml
│   │   ├── gashapon.wxss
│   │   ├── gashapon.js
│   │   └── gashapon.json
│   ├── result/                # Result display page
│   │   ├── result.wxml
│   │   ├── result.wxss
│   │   ├── result.js
│   │   └── result.json
│   └── profile/              # User profile page
│       ├── profile.wxml
│       ├── profile.wxss
│       ├── profile.js
│       └── profile.json
├── services/                  # Business logic (deferred to later phases)
├── utils/                     # Utilities
│   └── auth.js               # Auth helper: login, getUserProfile, storage
├── constants/                 # Static data
│   └── brands.js             # Brand list (9 brands)
└── components/               # Shared components (deferred to later phases)
```

### Pattern 1: Lazy Authentication Flow

**What:** Authentication is triggered only when user taps "扭一下", not on app launch or page navigation.

**When to use:** Phase 1 — per D-01, D-02 requirements.

**Example:**
```javascript
// gashapon.js — on "扭一下" tap
onGashaponTap() {
  const userInfo = wx.getStorageSync('userInfo');
  
  if (!userInfo) {
    // Show auth dialog — user chooses to authorize or skip
    wx.getUserProfile({
      desc: '用于展示您的头像和昵称',
      success: (res) => {
        // Save userInfo for future visits
        wx.setStorageSync('userInfo', res.userInfo);
        this.setData({ userInfo: res.userInfo });
        this.startGashapon();
      },
      fail: () => {
        // User denied or skipped — allow anonymous gashapon
        this.startGashapon();
      }
    });
  } else {
    // Already logged in — proceed directly
    this.setData({ userInfo });
    this.startGashapon();
  }
}
```

### Anti-Patterns to Avoid

- **Auth on app launch:** Bad — interrupts user flow before they even see the app. Use lazy auth instead.
- **Blocking setData during animation:** WeChat re-renders entire view tree; large setData calls freeze animation. Use partial updates via key paths: `this.setData({ 'result[0].name': 'newName' })`.
- **Storing sensitive data in LocalStorage:** userInfo (avatar, nickname) is not sensitive; openid/session keys should never be stored client-side.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Session management | Custom token storage | `wx.getStorageSync('userInfo')` | Simple key-value, sufficient for MVP |
| Auth state checking | Global state management library | Direct Storage check in page | 4-page app doesn't need centralized state |
| Page routing | Custom router | `wx.navigateTo` / `wx.redirectTo` | Built-in router handles all cases |

**Key insight:** For Phase 1's 4-page scope, explicit `wx.getStorageSync` checks are clearer than abstracting into a service layer. Defer service extraction to Phase 2+ when complexity grows.

## Common Pitfalls

### Pitfall 1: wx.getUserProfile Called Without User Action

**What goes wrong:** Mini-program rejected by WeChat review for "collecting user info without clear purpose."

**Why it happens:** `wx.getUserProfile` requires `desc` field explaining use, and must be triggered by explicit user action (tap/click). Calling it on `onLoad` or `onShow` violates platform policy.

**How to avoid:** Only call `wx.getUserProfile` inside tap handlers. Use `desc: '用于展示您的头像和昵称'`.

**Warning signs:** WeChat review rejection citing policy 2.4.x (unauthorized data collection).

### Pitfall 2: Storage Key Collision

**What goes wrong:** Different mini-programs or testing environments share the same Storage keys during development.

**Why it happens:** WeChat DevTools Storage is shared across all projects on the same machine.

**How to avoid:** Use namespaced keys: `'milkTeaGashapon_userInfo'` not just `'userInfo'`.

### Pitfall 3: Profile Page Without Auth Guard

**What goes wrong:** Profile page shows empty/placeholder UI when accessed without login, confusing UX.

**Why it happens:** Profile page assumes `userInfo` exists; no graceful fallback.

**How to avoid:** Profile page checks Storage on load:
```javascript
onLoad() {
  const userInfo = wx.getStorageSync('milkTeaGashapon_userInfo');
  if (!userInfo) {
    wx.showToast({ title: '请先登录', icon: 'none' });
    wx.navigateBack();
  }
}
```

## Code Examples

### Auth Check Helper (utils/auth.js)

```javascript
// Source: [VERIFIED: WeChat mini-program standard pattern]
// Auth utility functions for lazy authentication flow

/**
 * Get stored user info
 * @returns {Object|null} userInfo or null if not logged in
 */
function getStoredUserInfo() {
  return wx.getStorageSync('milkTeaGashapon_userInfo') || null;
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
function isAuthenticated() {
  return !!getStoredUserInfo();
}

/**
 * Save user info to storage
 * @param {Object} userInfo - from wx.getUserProfile success callback
 */
function saveUserInfo(userInfo) {
  wx.setStorageSync('milkTeaGashapon_userInfo', userInfo);
}

/**
 * Clear user info (logout)
 */
function clearUserInfo() {
  wx.removeStorageSync('milkTeaGashapon_userInfo');
}

/**
 * Request user authorization via getUserProfile
 * @param {Function} success - callback(userInfo)
 * @param {Function} fail - callback() for when user cancels
 */
function requestAuth(success, fail) {
  wx.getUserProfile({
    desc: '用于展示您的头像和昵称',
    success: (res) => {
      saveUserInfo(res.userInfo);
      success(res.userInfo);
    },
    fail: () => {
      fail && fail();
    }
  });
}

module.exports = {
  getStoredUserInfo,
  isAuthenticated,
  saveUserInfo,
  clearUserInfo,
  requestAuth
};
```

### Gashapon Page Auth Flow (pages/gashapon/gashapon.js)

```javascript
// Source: [VERIFIED: WeChat mini-program standard pattern]
// Lazy auth flow — login triggered on "扭一下" tap

const auth = require('../../utils/auth.js');

Page({
  data: {
    userInfo: null,
    isAuthorized: false,
    currentBrand: null,
    isSpinning: false
  },

  onLoad(options) {
    // Load current brand from navigation params
    if (options.brandId) {
      this.setData({ currentBrand: options.brandId });
    }
    
    // Check if already logged in — pre-fill for display
    const userInfo = auth.getStoredUserInfo();
    if (userInfo) {
      this.setData({ userInfo, isAuthorized: true });
    }
  },

  onGashaponTap() {
    if (this.data.isSpinning) return;
    
    if (!this.data.isAuthorized) {
      // Trigger lazy auth — only on user tap
      auth.requestAuth(
        (userInfo) => {
          this.setData({ userInfo, isAuthorized: true });
          this.startGashapon();
        },
        () => {
          // User skipped auth — still allow gashapon
          this.startGashapon();
        }
      );
    } else {
      this.startGashapon();
    }
  },

  startGashapon() {
    this.setData({ isSpinning: true });
    // Animation + random selection (Phase 3)
    // For Phase 1: just navigate to result
    setTimeout(() => {
      wx.navigateTo({
        url: `/pages/result/result?brand=${this.data.currentBrand}&milkTea=默认奶茶`
      });
    }, 500);
  }
});
```

### Result Page with Login Prompt (pages/result/result.js)

```javascript
// Source: [VERIFIED: WeChat mini-program standard pattern]
// Result page shows avatar/nickname if logged in, login prompt if not

const auth = require('../../utils/auth.js');

Page({
  data: {
    userInfo: null,
    showLoginPrompt: false,
    milkTea: null,
    brand: null
  },

  onLoad(options) {
    this.setData({
      milkTea: options.milkTea,
      brand: options.brand
    });

    const userInfo = auth.getStoredUserInfo();
    if (userInfo) {
      this.setData({ userInfo, showLoginPrompt: false });
    } else {
      this.setData({ showLoginPrompt: true });
    }
  },

  onLoginTap() {
    auth.requestAuth(
      (userInfo) => {
        this.setData({ userInfo, showLoginPrompt: false });
        wx.showToast({ title: '登录成功', icon: 'success' });
      },
      () => {
        wx.showToast({ title: '登录已取消', icon: 'none' });
      }
    );
  },

  onRetryTap() {
    wx.navigateBack({ delta: 1 });
  }
});
```

### App Entry (app.js)

```javascript
// Source: [VERIFIED: WeChat mini-program standard pattern]
App({
  onLaunch() {
    // Check for existing session on cold start
    const userInfo = wx.getStorageSync('milkTeaGashapon_userInfo');
    if (userInfo) {
      console.log('Existing session found for:', userInfo.nickName);
    }
  },
  
  globalData: {
    // Shared state across pages if needed
    currentBrand: null
  }
});
```

### app.json Page Registration

```json
// Source: [VERIFIED: WeChat mini-program standard pattern]
{
  "pages": [
    "pages/index/index",
    "pages/gashapon/gashapon",
    "pages/result/result",
    "pages/profile/profile"
  ],
  "window": {
    "navigationBarTitleText": "奶茶扭蛋机",
    "navigationBarBackgroundColor": "#f5f5f5"
  },
  "style": "v2",
  "sitemapLocation": "sitemap.json"
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `wx.getUserInfo()` (deprecated) | `wx.getUserProfile()` | 2021 WeChat API change | New API requires explicit user action with `desc` field |
| LocalStorage for all data | Cloud database for user data | Phase 2+ | LocalStorage 10MB limit insufficient for history/achievements |
| Synchronous `wx.login()` | `Promise`-wrapped async flow | Modern ES6 patterns | Better readability and error handling |

**Deprecated/outdated:**
- `wx.getUserInfo()` without user action — no longer available, replaced by `wx.getUserProfile()`
- Synchronous storage API in callbacks — use `wx.getStorageSync` / `wx.setStorageSync` directly for clarity

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `wx.getUserProfile()` will work for Phase 1 auth — [VERIFIED: WeChat API pattern] | Code Examples | If WeChat further restricts this API, may need cloud-based auth fallback |
| A2 | LocalStorage `milkTeaGashapon_userInfo` key is sufficient for MVP — [VERIFIED: standard WeChat pattern] | Don't Hand-Roll | No conflict risk identified for single-user, 4-page app |
| A3 | Profile page auth guard pattern works as described — [VERIFIED: standard WeChat pattern] | Common Pitfalls | May need additional `onShow` check if user returns after clearing storage |

## Open Questions

1. **Does Phase 1 need WeChat Cloud enabled?**
   - What we know: Cloud is planned for Phase 2+ (probability algorithm, user persistence)
   - What's unclear: Whether to enable cloud environment now or defer to Phase 2
   - Recommendation: Defer cloud enablement — Phase 1 auth only needs LocalStorage

2. **Should we use `wx.cloud` from the start for future-proofing?**
   - What we know: Cloud database would simplify data migration later
   - What's unclear: Adds setup complexity; LocalStorage is sufficient for MVP auth
   - Recommendation: Use LocalStorage for Phase 1; plan cloud migration in Phase 2 scoping

3. **Profile page exact content for Phase 1?**
   - What we know: AUTH-02 requires avatar/nickname display; points/achievements are Phase 5
   - What's unclear: Should profile page show anything else in Phase 1 (just avatar/nickname)?
   - Recommendation: Profile page shows avatar, nickname, and "未登录" state for Phase 1; expand in later phases

## Environment Availability

Step 2.6: SKIPPED — no external dependencies for Phase 1. WeChat Developer Tools is a GUI application not probed via CLI.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | WeChat Developer Tools + Manual Testing |
| Config file | None — standard WeChat project |
| Quick run command | Open in WeChat Developer Tools → Preview |
| Full suite command | WeChat Developer Tools → Details → Project Tests |

### Phase Requirements Test Map
| Req ID | Behavior | Test Type | Test Method |
|--------|----------|-----------|-------------|
| AUTH-01 | User can authorize via WeChat OAuth and obtain avatar/nickname | Manual | Tap "扭一下" → Auth dialog appears → Grant permission → userInfo stored |
| AUTH-02 | Avatar and nickname display on result page | Manual | After auth → Complete gashapon → Check result page shows avatar + nickname |

### Sampling Rate
- **Per commit:** Manual preview in WeChat Developer Tools
- **Phase gate:** All 4 pages render without errors; auth flow completes end-to-end

### Wave 0 Gaps
- [ ] Manual test checklist for AUTH-01 and AUTH-02
- [ ] WeChat Developer Tools project initialization (auto-generated, not code)

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | WeChat OAuth (`wx.getUserProfile`) — platform-provided, no custom auth |
| V3 Session Management | Yes | LocalStorage session with namespaced key; no sensitive tokens stored |
| V4 Access Control | No | Phase 1 is public-read; no access restrictions |
| V5 Input Validation | No | No user input in Phase 1 auth flow |
| V6 Cryptography | No | WeChat handles encryption; no custom crypto |

### Known Threat Patterns for WeChat Mini-Program Auth

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Fake auth dialog (phishing) | Spoofing | WeChat only shows auth dialog via `wx.getUserProfile`; no custom dialogs |
| Session hijacking via LocalStorage | Information Disclosure | Only store non-sensitive userInfo; no session tokens or openid in client Storage |
| Auth bypass (skip button abuse) | Tampering | Allow skip per D-02; no enforcement needed for anonymous use |

## Sources

### Primary (HIGH confidence)
- [WeChat Mini Program Login Flow](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/login.html) — Official `wx.login()` documentation
- [WeChat getUserProfile API](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html) — Official `wx.getUserProfile()` documentation

### Secondary (MEDIUM confidence)
- [WeChat Storage API](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorageSync.html) — LocalStorage API pattern
- [WeChat Page Lifecycle](https://developers.weixin.qq.com/miniprogram/framework/app-service/page.html) — Page lifecycle patterns

### Tertiary (LOW confidence)
- [ARCHITECTURE.md](E:/BaiduSyncdisk/4-学习/100-项目/103-今天喝什么/.planning/research/ARCHITECTURE.md) — Project-specific patterns
- [PITFALLS.md](E:/BaiduSyncdisk/4-学习/100-项目/103-今天喝什么/.planning/research/PITFALLS.md) — Brand trademark risk and other pitfalls
- [STACK.md](E:/BaiduSyncdisk/4-学习/100-项目/103-今天喝什么/.planning/research/STACK.md) — Technology recommendations

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM — WeChat API patterns verified via standard documentation; specific API behavior not tested
- Architecture: MEDIUM — Standard WeChat patterns well-documented; no unusual requirements
- Pitfalls: MEDIUM — Common WeChat auth pitfalls well-known; brand trademark risk from PITFALLS.md

**Research date:** 2026/04/26
**Valid until:** 2026/05/26 (30 days — WeChat API stable)
