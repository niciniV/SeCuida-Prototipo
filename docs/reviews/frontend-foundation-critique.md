# Frontend Foundation Critique

Review of the state after commit `87234c9` (Fronts 01-04 implementation).

---

## 1. "Como funciona" section duplicated onboarding

**File:** `src/features/home/HomeScreen.tsx`

The "Como funciona" section duplicated the app-style starting screen. Now that onboarding exists as the first-run explanation layer, this section should stay out of Home. Home should focus on trust, the privacy reassurance, and the three main action paths.

---

## 2. Missing special characters across all Portuguese text

**Files:** `src/content/copy/home.ts`, `src/content/support/contacts.ts`, `src/content/services/canoas-services.ts`, `src/features/support/SupportScreen.tsx`, `src/features/orientation/OrientationScreen.tsx`, `src/features/education/EducationLibraryScreen.tsx`, `src/features/privacy/PrivacyScreen.tsx`

Every content file and screen component is missing Portuguese special characters (`é`, `ê`, `ç`, `á`, `ã`, `õ`, `ó`). Examples:

- `"e"` instead of `"é"` (e.g. `"esta"` → `"está"`, `"e"` → `"é"`)
- `"c"` instead of `"ç"` (e.g. `"praca"` → `"praça"`, `"prevencao"` → `"prevenção"`)
- `"a"` instead of `"á"` (e.g. `"saude"` → `"saúde"`)
- `"o"` instead of `"ó"` (e.g. `"orientacao"` → `"orientação"`)

This affects the entire app and should be fixed globally.

---

## 3. "Não estou bem agora" button uses an alarming icon

**File:** `src/features/home/HomeScreen.tsx` (line 26)

The immediate support button uses an `AlertCircle` icon (from `lucide-react`) colored amber `#F59E0B` with `fill="#F59E0B"`. The circle-with-exclamation-mark symbol conveys alert/danger rather than warmth or support. A friendlier icon and color would better match the app's calm, supportive tone.

The button's copy and label should also be reconsidered — `"Não estou bem agora"` can feel heavy and pressure-inducing. A softer, more inviting phrasing would better align with the supportive tone the app aims for.

---

## 4. "Respire por um momento" section lacks visual treatment

**File:** `src/features/support/SupportScreen.tsx` (lines 17-22)

The breathing exercise section in the Support screen is a plain card with `bg-surface-container-low`, a subtle border, and plain text. It has no icon, illustration, animation, or any visual element that would make it stand out as an interactive/soothing feature. The instructions also lack special characters (`"ate"` → `"até"`, `"voce"` → `"você"`).

---

## 5. Chat input floats in the middle of the screen

**File:** `src/features/orientation/OrientationScreen.tsx` (StepChat component)

The chat input uses `mt-auto` + `sticky bottom-0` to anchor to the bottom of the flex container. However, because the container uses `flex-grow` and `h-full`, on tall screens with little content the input appears to float somewhere in the middle vertically. It should be consistently pinned to the bottom of the viewport.

---

## 6. "Estudos" (Education) tab is missing from bottom navigation

**File:** `src/app/shell/BottomNav.tsx`

The BottomNav has only 4 items: Início, Orientação, Contatos, Apoio. The `/educacao` route exists in `src/app/routes.ts` and `EducationLibraryScreen` is rendered by the router, but there is no tab linking to it. Users can only access Education by typing the URL manually.

---

## Summary

| # | Issue | Severity | File(s) |
|---|---|---|---|
| 1 | "Como funciona" duplicates onboarding | Medium | `src/features/home/HomeScreen.tsx` |
| 2 | Missing special characters in PT-BR text | High | All content and screen files |
| 3 | Alarming icon on support button | Medium | `src/features/home/HomeScreen.tsx` |
| 4 | "Respire por um momento" lacks visual treatment | Low | `src/features/support/SupportScreen.tsx` |
| 5 | Chat input not pinned to bottom | Medium | `src/features/orientation/OrientationScreen.tsx` |
| 6 | Education tab missing from bottom nav | High | `src/app/shell/BottomNav.tsx` |
