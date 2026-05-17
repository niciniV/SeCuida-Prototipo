# Hide Suggestions on Exact Match

**Date:** 2026-05-16
**Status:** Approved
**Scope:** `src/features/orientation/OrientationScreen.tsx`

## Problem

On the orientação page, when the user selects a suggestion pill or types text that exactly matches an option, the suggestion list remains visible. This creates redundant UI — the user already found their answer, but the pills still show.

Specific scenario:
1. User types a short answer like "Não" on SRQ-20 → exact match exists, but multiple "Não" pills still appear

Note: Clicking a pill now auto-sends (clearing the input), so the old "pill fills input, suggestions remain" scenario no longer applies.

## Solution

Add a strict exact-match check (no whitespace trim) that hides the suggestion list when the input perfectly matches an option label. Keep the existing trimmed check for the send button.

### Behavior

| User action | Suggestion list | Send button |
|---|---|---|
| Clicks a pill → "Não" in input | Hidden (strict exact match) | Green (trimmed match) |
| Types "Não" | Hidden (strict exact match) | Green (trimmed match) |
| Types "Não " (trailing space) | Shown (no strict match) | Green (trimmed match) |
| Types "Na" (partial) | Shown (substring filter) | Disabled |
| Types "abc" (no match) | Shown (falls back to node options) | Disabled |

### Implementation

In `OrientationScreen.tsx`:

1. **Add `strictExactOption`** — a new computed value using the same logic as `exactOption` but without `.trim()`:
   ```ts
   const strictExactOption = options.find(
     (option) => option.label.toLocaleLowerCase('pt-BR') === inputValue.toLocaleLowerCase('pt-BR')
   );
   ```

2. **Modify `visibleOptions`** — return `[]` when `strictExactOption` is truthy:
   ```ts
   const visibleOptions = useMemo(() => {
     if (strictExactOption) return [];
     const normalizedInput = inputValue.trim().toLocaleLowerCase('pt-BR');
     if (!normalizedInput) {
       return options.filter((option) => option.kind === 'node_option');
     }
     return options.filter((option) =>
       option.label.toLocaleLowerCase('pt-BR').includes(normalizedInput)
     );
   }, [inputValue, options, strictExactOption]);
   ```

3. **No change to `exactOption`** — the send button continues using the trimmed check.

### Files changed

- `src/features/orientation/OrientationScreen.tsx` — ~5 lines added/modified

### Out of scope

- No changes to the flow engine
- No changes to how messages are added to the transcript
- No changes to option resolution logic
