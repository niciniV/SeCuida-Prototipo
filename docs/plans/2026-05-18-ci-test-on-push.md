# CI Tests on Push — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add automated test execution on every push and PR, and gate deployment on tests passing.

**Architecture:** Two GitHub Actions workflows — a new `ci.yml` runs tests on all branches/PRs, and the existing `deploy.yml` is modified to require the CI job to pass before deploying to GitHub Pages.

**Tech Stack:** GitHub Actions, pnpm, Vitest

---

## How It Works (Background)

GitHub Actions workflows are YAML files in `.github/workflows/`. Each workflow:
- **Triggers** on events (push, pull_request, etc.)
- **Runs jobs** — independent units of work on a runner (Ubuntu VM)
- **Jobs have steps** — sequential commands or reusable actions
- **Jobs can depend on other jobs** via `needs:` — this is how we gate deploy on tests

### Two workflows, two purposes

```
ci.yml (NEW)                    deploy.yml (MODIFIED)
├── triggers: push, PR          ├── triggers: push to main only
├── job: test                   ├── needs: test (waits for ci.yml)
│   ├── checkout                ├── job: build-and-deploy
│   ├── setup node              │   ├── checkout
│   ├── setup pnpm              │   ├── setup node
│   ├── install deps            │   ├── setup pnpm
│   └── run tests               │   ├── install deps
│                               │   ├── build
│                               │   └── deploy to pages
```

### Why two workflows?

- **Separation of concerns** — tests are a quality check, deploy is a release action
- **Reusability** — `ci.yml` can be referenced by other workflows via `workflow_call`
- **Clarity** — each workflow has one job, easy to read and debug

---

## Task 1: Create `.github/workflows/ci.yml`

**Files:**
- Create: `.github/workflows/ci.yml`

**What this does:** Runs `pnpm test` on every push (all branches) and on every pull request.

**Step 1: Create the file**

```yaml
name: CI

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - uses: pnpm/action-setup@v4
        with:
          run_install: false

      - run: pnpm install --frozen-lockfile

      - run: pnpm test
```

**Key details:**
- `on: push:` with no branches filter = triggers on ALL branches
- `on: pull_request:` = triggers when a PR is opened or updated
- `pnpm install --frozen-lockfile` = installs deps without modifying lockfile (CI-safe)
- `pnpm test` = runs `vitest run` (from package.json)

**Step 2: Verify locally**

- Run `pnpm test` — confirm all tests pass
- Run `pnpm build` — confirm the build succeeds
- If you have [`actionlint`](https://github.com/rhysd/actionlint) installed, run `actionlint .github/workflows/ci.yml` to validate the workflow YAML
- Otherwise, push and check the GitHub Actions tab for errors

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add test workflow on push and PR"
```

---

## Task 2: Modify `deploy.yml` to gate on tests passing

**Files:**
- Modify: `.github/workflows/deploy.yml`

**What this does:** Makes the deploy job wait for the CI tests to pass before running. If tests fail, deploy is skipped entirely.

**Step 1: Edit `deploy.yml`**

Add a reusable workflow job and `needs:` dependency:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  test:
    uses: ./.github/workflows/ci.yml
    permissions:
      contents: read

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - uses: pnpm/action-setup@v4
        with:
          run_install: false
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Key changes:**
- Added `test` job that calls `ci.yml` via `uses: ./.github/workflows/ci.yml`
- Added `needs: test` to `build-and-deploy` — this job won't start until tests pass
- The `test` job uses `workflow_call` trigger (implicit when called from another workflow)
- **Duplication note:** On `main` pushes, `ci.yml` runs standalone AND is called by `deploy.yml`. This is expected — see "What This Looks Like in Practice" below.
- **Least-privilege permissions:** Moved from workflow scope to job scope. `test` gets only `contents: read`. `build-and-deploy` gets `contents: read`, `pages: write`, `id-token: write`.

**Step 2: Update `ci.yml` to support `workflow_call`**

The `ci.yml` needs a small addition so it can be called by `deploy.yml`:

```yaml
name: CI

on:
  push:
  pull_request:
  workflow_call:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - uses: pnpm/action-setup@v4
        with:
          run_install: false

      - run: pnpm install --frozen-lockfile

      - run: pnpm test
```

The only change is adding `workflow_call:` to the `on:` block.

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml .github/workflows/deploy.yml
git commit -m "ci: gate deploy on tests passing"
```

---

## Summary of Changes

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/ci.yml` | Create | Run tests on every push and PR |
| `.github/workflows/deploy.yml` | Modify | Add `needs: test` to gate deploy |

**Total lines changed:** ~25 lines of YAML across 2 files.

---

## What This Looks Like in Practice

```
Developer pushes to feature branch
  → ci.yml triggers → tests run → ✅ pass or ❌ fail

Developer opens PR to main
  → ci.yml triggers → tests run → shows status check on PR

Developer merges PR to main
  → ci.yml triggers (standalone) → tests run
  → deploy.yml triggers → runs tests again (via reusable workflow) → builds → deploys
```

**Note:** On pushes to `main`, tests run **twice** — once from `ci.yml` (triggered by `on: push:`) and once from `deploy.yml` (which calls `ci.yml` as a reusable workflow). This is intentional: `ci.yml` provides the branch-level status check, while `deploy.yml` independently gates deployment. The duplication is minimal (tests take ~5s) and ensures deploy never proceeds on stale assumptions.

If tests fail on main, deploy is **skipped entirely** — your site stays on the last good version.
