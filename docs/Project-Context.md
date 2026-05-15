# SeCuida-Prototipo — AI Agent Repository Context

> Purpose: Give an AI coding/review agent enough current repository context to work safely, recognize architectural drift, and evaluate code changes without relying on tribal knowledge.
>
> Scope: This guide describes the repository as it exists now. It is descriptive, not a refactor plan.

---

## 1. Product Frame

**SeCuida** is a small front-end prototype for educator mental-health support in Portuguese. The experience presents itself as:

- a safe, anonymous, confidential space;
- a fast path for immediate distress support;
- a guided “orientation” flow;
- a local support network view for Canoas, RS.

The current app is best understood as a static interactive prototype rather than a production service. There is no repository-visible backend, persistence layer, API integration, authentication, analytics, or routing system.

---

## 2. Runtime and Tooling

| Concern | Current shape |
|---|---|
| App framework | React with Vite |
| Language | TypeScript/TSX, with `allowJs` enabled |
| Styling | Tailwind CSS v4 through `@tailwindcss/vite`, plus custom design tokens in `src/index.css` |
| Animation | `motion/react` |
| Icons | `lucide-react` |
| Entry command | `npm run dev` |
| Build command | `npm run build` |
| Type/lint command | `npm run lint`, implemented as `tsc --noEmit` |
| Deployment hint | Vite `base` is `/SeCuida-Prototipo/`, suggesting GitHub Pages/subpath deployment |

The package is private, named `react-example`, and includes only a small front-end dependency set. There is no separate test script, formatter script, ESLint config, or CI workflow evident from the inspected files.

---

## 3. Top-Level Structure

```txt
.
├── README.md
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    └── views
        ├── HomeView.tsx
        ├── EmergencyView.tsx
        ├── AssessmentView.tsx
        └── NetworkView.tsx
```

### Root files

| File | Role |
|---|---|
| `README.md` | Minimal product description and local run instructions. |
| `package.json` | Scripts and dependency surface. |
| `vite.config.ts` | Vite config, React plugin, Tailwind plugin, root alias, and subpath base. |
| `tsconfig.json` | TypeScript compiler behavior. Uses bundler resolution, JSX React transform, no emit, and root alias mapping. |
| `index.html` | Root HTML shell with `#root`; current document language is `en`. |

### Source files

| File | Role |
|---|---|
| `src/main.tsx` | React root bootstrap. Imports `App` and global CSS, renders inside `StrictMode`. |
| `src/App.tsx` | Global navigation shell and in-memory view selection. |
| `src/index.css` | Tailwind import, font import, design tokens, typography utility classes, and range input styling. |
| `src/views/HomeView.tsx` | Landing view and first-level user choices. |
| `src/views/EmergencyView.tsx` | Immediate support contacts and emergency phone CTAs. |
| `src/views/AssessmentView.tsx` | Multi-step orientation flow, chat-like prompt, slider prompt, resource card, and handoff to network. |
| `src/views/NetworkView.tsx` | Static local support cards for Canoas. |

---

## 4. Navigation and State Model

The app does not use a router. Navigation is a local union state inside `App.tsx`:

```ts
'HOME' | 'EMERGENCY' | 'ASSESSMENT' | 'NETWORK'
```

`App` owns the selected view and conditionally renders one view at a time. It also renders:

- a sticky desktop header;
- desktop nav buttons;
- a fixed mobile bottom nav.

Only some views receive the view setter:

- `HomeView` receives `setView` with the full view union type.
- `AssessmentView` receives `setView`, but its prop accepts `(v: string) => void`.
- `EmergencyView` and `NetworkView` are currently self-contained.

When adding new top-level screens, update the union, header/mobile nav, conditional rendering, and any child props that can switch screens.

---

## 5. View Responsibilities

### `HomeView`

Primary role: introduction and triage. It presents the confidentiality message and three main actions:

1. “Não estou bem agora” → `EMERGENCY`
2. “Preciso de orientação” → `ASSESSMENT`
3. “Ver rede de apoio local” → `NETWORK`

Pattern: mostly static JSX, motion-wrapped page transition, utility classes, inline icons, and callback-driven navigation.

### `EmergencyView`

Primary role: crisis/support contact cards.

Current cards:

- CVV — `188`
- SAMU — `192`
- Bombeiros — `193`

Pattern: static cards with `tel:` links, repeated card layout, remote image URL, motion wrapper.

Content sensitivity: this view contains urgent mental-health and emergency guidance. Any copy changes should preserve clarity, nonjudgmental tone, and direct call-to-action behavior.

### `AssessmentView`

Primary role: simulated guidance/orientation flow.

Internal state:

- `step`, starting at `1`
- selected concern in `Step1`
- slider value in `Step2`

Flow:

```txt
Step1 concern choice
  → StepChat chat-like prompt
  → Step2 slider prompt
  → Step3 resource recommendation
  → NETWORK
```

Current mismatch to notice when modifying flow: UI copy includes “Pergunta 2 de 5”, but the implemented flow has four rendered steps and no stored aggregate assessment result.

Pattern: one file containing parent view plus local step components. Step components are private to the file.

### `NetworkView`

Primary role: local support directory for Canoas.

Current cards:

- CAPS II Praça Brasil
- UBS Centro de Saúde
- Clínica Escola de Psicologia - Ulbra

Pattern: static card grid, repeated article markup, `tel:` links, no filtering/search/geolocation/maps.

Content sensitivity: the directory contains addresses, hours, labels, and phone numbers. Treat these as content data even though they are currently embedded directly in JSX.

---

## 6. Styling and Design System

Styling is centralized only partially.

### Token source

`src/index.css` defines Tailwind v4 `@theme` tokens for:

- colors;
- spacing;
- container padding;
- stack spacing;
- typography utility classes;
- range input track/thumb styling.

Examples of semantic token categories:

- `background`, `surface`, `surface-container-*`
- `primary`, `secondary`, `tertiary`
- `on-*` colors
- `outline`, `error`
- `stack-*`, `gutter`, `container-padding-*`

### Typography pattern

The app uses custom utility classes instead of default Tailwind text utilities:

- `font-display-lg`
- `font-headline-lg`
- `font-headline-lg-mobile`
- `font-headline-md`
- `font-headline-sm`
- `font-body-lg`
- `font-body-md`
- `font-label-md`

These utilities include font family, size, line height, and weight.

### Layout pattern

Common layout idioms:

- mobile-first `px-container-padding-mobile`;
- `md:px-container-padding-desktop`;
- `max-w-3xl` for focused flows;
- `max-w-7xl` for app shell/wider content;
- `gap-stack-*` and `mt/mb/py-stack-*`;
- rounded cards and pill buttons.

### Styling surfaces to compare before adding classes

Many colors use semantic tokens, but some components also use raw hex colors or arbitrary shadow utilities. When adding UI, first check whether the intended color/elevation already exists as a token or repeated convention.

---

## 7. Data and Content Model

There is no separate data model. Current content lives directly inside components:

| Content type | Current location |
|---|---|
| Emergency services | `EmergencyView.tsx` |
| Local support services | `NetworkView.tsx` |
| Assessment questions/options | `AssessmentView.tsx` |
| Recommendation/resource copy | `AssessmentView.tsx` |
| Confidentiality/welcome text | `HomeView.tsx` |
| Remote image URLs | `EmergencyView.tsx`, `AssessmentView.tsx` |

There are no repository-visible JSON files, API clients, services, schemas, validators, localization files, or CMS hooks.

A change that adds “just one more item” to a repeated card/list should be evaluated against the current lack of separation between content, rendering, and behavior.

---

## 8. External Resources

The app currently relies on external URLs for some images, including long `lh3.googleusercontent.com/aida-public/...` URLs. The repository does not show local image assets or an asset-loading abstraction.

Phone links use the `tel:` protocol.

There is no map link, geocoding, or browser location access in the current implementation.

---

## 9. TypeScript Boundaries

TypeScript is configured, but the type boundary is light:

- `App.tsx` uses a string-literal union for `currentView`.
- `HomeView` mirrors the full view union in its props.
- `AssessmentView` accepts `(v: string) => void`.
- Most content objects are not typed because they are not represented as data objects.
- `tsconfig.json` enables `allowJs`.
- Linting is equivalent to type-checking only.

For agent work, treat type consistency around view names and component props as the main currently visible type contract.

---

## 10. Animation Pattern

Page-level views are commonly wrapped in `motion.main` with small opacity/position transitions.

`AssessmentView` uses `AnimatePresence mode="wait"` for its internal steps.

There is no route-level animation abstraction. Animation props are colocated with each view or step component.

---

## 11. Accessibility and Semantics Inventory

Current semantic anchors:

- top-level content often uses `main`;
- repeated support entries use `article` in `NetworkView`;
- phone CTAs are anchors with `tel:`;
- radio options in `Step1` use hidden native radio inputs inside labels;
- the range slider is a native `input[type=range]`.

Current areas to inspect carefully when changing related code:

- text language and document language;
- icon-only or image-heavy sections;
- hidden inputs and visual selection states;
- keyboard behavior for custom-looking controls;
- repeated nav buttons and active states;
- crisis-contact call-to-action clarity;
- remote image alt text specificity;
- range slider labeling and screen-reader context.

---

## 12. Deployment and Path Assumptions

`vite.config.ts` sets:

```ts
base: '/SeCuida-Prototipo/'
```

This matters for static deployment under a repository subpath. Avoid assuming root-hosted `/` deployment unless the base path is intentionally changed.

The alias `@` points to the repository root, and `tsconfig.json` maps `@/*` to `./*`, not `./src/*`.

---

## 13. Validation Surface

Available repository-visible validation:

```bash
npm run lint
npm run build
```

`npm run lint` runs TypeScript without emitting output. It is not an ESLint rule set.

No repository-visible tests, Storybook, visual regression setup, accessibility test script, or CI workflow were identified from the inspected files.

---

## 14. Agent Change Heuristics

Before editing, classify the change by layer:

| Change type | First files to inspect |
|---|---|
| New screen/top-level view | `src/App.tsx`, `src/views/*` |
| Navigation wording or routes | `src/App.tsx`, `src/views/HomeView.tsx`, `src/views/AssessmentView.tsx` |
| Emergency contact or crisis copy | `src/views/EmergencyView.tsx` |
| Assessment flow or questionnaire | `src/views/AssessmentView.tsx` |
| Local directory data | `src/views/NetworkView.tsx` |
| Color/spacing/type changes | `src/index.css`, then affected JSX |
| Build/deploy path | `vite.config.ts` |
| Type/import behavior | `tsconfig.json`, `vite.config.ts` |

Before merging a change, compare it against these existing contracts:

1. Can the change run without a backend?
2. Does it preserve the subpath deployment assumption?
3. Does it keep the app Portuguese-first?
4. Does it respect the safety tone around mental-health support?
5. Does it duplicate an existing card/list pattern or introduce a new one?
6. Does it add content that would be easier to verify, type, or reuse as data?
7. Does it introduce a new state transition outside the visible view/step model?
8. Does it rely on a remote resource with unknown lifetime?
9. Does `npm run lint` still pass?
10. Does `npm run build` still pass?

---

## 15. Mental Model for Review

Read the repository as four concentric layers:

```txt
Vite/React bootstrap
  → App shell and currentView state
    → View-local flows and static content
      → Tailwind theme tokens plus inline utility composition
```

Code that crosses several of these layers at once deserves extra attention. Code that adds more static domain content inside JSX should be reviewed with the same care as logic, because the product’s trustworthiness depends heavily on the accuracy and tone of that embedded content.

---

## 16. Current Known Non-Goals Implied by the Code

The current codebase does not yet model:

- authenticated users;
- saved answers;
- personal data handling;
- server communication;
- search/filtering;
- geolocation;
- internationalization;
- dynamic emergency/local service lookup;
- offline strategy;
- automated tests;
- design-system components as reusable primitives.

These are not necessarily required for the prototype. They are boundaries to keep visible when an agent proposes or reviews future changes.

---

## 17. Recommended Agent Output Style for This Repo

When responding about code changes in this repository:

- name the layer being changed;
- mention affected files explicitly;
- keep Portuguese user-facing copy consistent with existing tone;
- prefer small changes that preserve the prototype’s simple state model;
- avoid introducing infrastructure unless the requested behavior requires it;
- verify build/type-check commands when possible;
- distinguish source-observed facts from assumptions.
