# Roadmap — 奶茶扭蛋机 v1

> 日期：2026-04-26

## Phases

- [ ] **Phase 1: Project Setup & Authentication** — WeChat OAuth login and user identity
- [x] **Phase 2: Brand Display & Selection** — 9 brand gashapon machines with switching
- [ ] **Phase 3: Core Gashapon Experience** — Capsule animation, cloud probability, result reveal
- [ ] **Phase 4: Result Display & Sharing** — Retry, share image generation, WeChat sharing
- [ ] **Phase 5: User Retention Systems** — Points, achievements, history, custom capsules

---

## Phase Details

### Phase 1: Project Setup & Authentication
**Goal**: Users can access the mini-program via WeChat login
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02
**Success Criteria** (what must be TRUE):
  1. User can authorize login via WeChat OAuth and obtain their identity
  2. User avatar and nickname display correctly on result pages
  3. Unauthorized users are prompted to login before using gashapon
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Project scaffold: app entry, 4 pages, auth utilities
- [x] 01-02-PLAN.md — Auth flow implementation: lazy auth on "扭一下" tap

---

### Phase 2: Brand Display & Selection (Complete)
**Goal**: Users can browse 9 milk tea brands and switch between them
**Depends on**: Phase 1
**Requirements**: BRAND-01, BRAND-02
**Success Criteria** (what must be TRUE):
  1. Home screen displays all 9 brands (一点点、喜茶、霸王茶姬、古茗、茶百道、CoCo、KOI、瑞幸、沪上阿姨) with logo and name
  2. Each brand appears as a milk tea cup-shaped gashapon machine
  3. Users can switch brands at any time and see visual feedback on selection
**Plans**: 3 plans
**UI hint**: yes

Plans:
- [x] 02-01-PLAN.md — Brand data foundation: data/brands.js with 9 brand definitions
- [x] 02-02-PLAN.md — Index page: swiper carousel with milk tea cup cards
- [x] 02-03-PLAN.md — Gashapon page: brand dropdown selector + machine display

---

### Phase 3: Core Gashapon Experience
**Goal**: Users can trigger capsule animation and receive random milk tea recommendation
**Depends on**: Phase 2
**Requirements**: GASH-01, GASH-02, GASH-03
**Success Criteria** (what must be TRUE):
  1. Clicking "扭一下" button triggers transparent spherical capsule pop animation
  2. Cloud-side probability algorithm determines result (not front-end exposed)
  3. Result page displays milk tea name plus one-sentence description
**Plans**: TBD
**UI hint**: yes

---

### Phase 4: Result Display & Sharing
**Goal**: Users can view results, retry不满意, or share their draw
**Depends on**: Phase 3
**Requirements**: GASH-04, SHARE-01, SHARE-02
**Success Criteria** (what must be TRUE):
  1. Users can tap "重新抽取" to draw again for current brand
  2. Share image generates showing milk tea name, brand, and mini-program code
  3. Users can share to WeChat friends or朋友圈 via system share menu
**Plans**: TBD
**UI hint**: yes

---

### Phase 5: User Retention Systems
**Goal**: Users have reasons to return and track their collection progress
**Depends on**: Phase 4
**Requirements**: POINTS-01, ACHIEVE-01, HISTORY-01, GASH-05
**Success Criteria** (what must be TRUE):
  1. Each draw awards points that accumulate and can be viewed in profile
  2. Achievement badges display when earned (hidden item, brand collection, etc.)
  3. Users can view their draw history with timestamps and results
  4. Users can add custom milk tea types to current brand gashapon
**Plans**: TBD

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Setup & Auth | 2/2 | Complete | 2026-04-26 |
| 2. Brand Display & Selection | 3/3 | Complete | 2026-04-27 |
| 3. Core Gashapon Experience | 0/2 | Not started | - |
| 4. Result Display & Sharing | 0/2 | Not started | - |
| 5. User Retention Systems | 0/3 | Not started | - |

---

## Coverage

| Phase | Requirements |
|-------|--------------|
| 1 - Project Setup & Auth | AUTH-01, AUTH-02 |
| 2 - Brand Display & Selection | BRAND-01, BRAND-02 |
| 3 - Core Gashapon Experience | GASH-01, GASH-02, GASH-03 |
| 4 - Result Display & Sharing | GASH-04, SHARE-01, SHARE-02 |
| 5 - User Retention Systems | POINTS-01, ACHIEVE-01, HISTORY-01, GASH-05 |

**Total: 14/14 requirements mapped**
