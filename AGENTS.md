# AGENTS.md

This file provides guidance to coding agents (Claude Code and others) when working with code in this repository. `CLAUDE.md` is a symlink to this file.

## What this is

A browser app for scoring the SRA (Sovellettu Reserviläisammunta / Applied Reservist
Shooting) shooting test (`ampumakoe`). It is a client-only Vue 3 PWA — all state lives in
the user's browser via `localStorage`; nothing is ever sent to a server. Deployed to GitHub
Pages at https://mpolla.github.io/sra-koe/ under the base path `/sra-koe/`.

The codebase, UI, and domain vocabulary are entirely in **Finnish**. Match this when naming
things, writing comments, and authoring user-facing strings. Key terms: `ampuja` = shooter,
`rasti` = stage/station (5 of them, indexed 0–4), `taulu` = target, `osuma` = hit,
`hylkays` = disqualification, `tuomari` = judge, `poytakirja` = official record (PDF).

## Commands

```bash
npm run dev            # Vite dev server (PWA enabled in dev)
npm run build          # production build to dist/
npm run type-check     # vue-tsc, no emit
npm run lint           # eslint --fix across the repo
npm run format         # prettier on src/

npm run test:unit              # vitest (watch). Add a path/-t to scope: npm run test:unit -- -t "name"
npm run test:e2e               # build + preview + headless Cypress (chromium)
npm run test:e2e:dev           # dev server + interactive Cypress runner
```

E2E note: the test server runs at `http://localhost:4173/sra-koe/` — the `/sra-koe/` base
path matters for both Cypress and any manual preview.

### Deploying

Update the changelog in `src/views/AboutView.vue`, then:

```bash
npm version minor
npm run predeploy    # = npm run build
npm run deploy       # gh-pages -d dist
```

The version string is injected at build time as `__APP_VERSION__` (see `vite.config.ts`).

## Architecture

**Single source of truth: the Pinia store `src/stores/pisteet.ts`** (`persist: true`, so it
auto-saves to localStorage). Almost all domain logic — scoring, completion state, totals,
disqualification — lives as actions here rather than in components. When changing scoring
behavior, start here.

The scoring data model is a deeply nested array per shooter:

- `pisteet[ampuja][rasti][osumaluokka][taulu]` = hit count.
  - `rasti`: 0–4 (5 stages)
  - `osumaluokka`: index into `SraAmpumakoe.osumaluokat` = `['A','C','D','Ohi','Rang']`
  - `taulu`: 0–1 (two targets per series)
- `ajat[ampuja][rasti]` = array of up to 3 series times (stages 0–1 use 3 times, stages 2–4 use 1).

**Scoring rules** are constants/static methods on `src/classes/SraAmpumakoe.ts` and applied
in the store's `getLuPi`: A=5, C=3, D=1, Ohi (miss)=−10, Rang (penalty)=−10 per hit. A stage's
score is floored at 0. The pass criterion is the **hit factor** (`osumakerroin` = total points
÷ total time) which must be ≥ `SraAmpumakoe.vaadittuOsumakerroin` (1.3); the store applies this
automatically in `getHylkaysperuste`. `getRastiSuorituksenTila` derives whether a stage is
Suorittamatta / Kesken / Suoritettu from how many shots and times have been entered — totals
only count fully-completed stages.

Stage 5 (`rasti` index 4) has a pistol vs. rifle variant per shooter
(`rastin5suoritustavat[ampuja]` = `'pist'` | `'kiv'`), which changes shot counts
(`laukausMaaratPistoolilla` vs `laukausMaaratKivaarilla`).

**Two outputs** (no backend involved in either):

- **PDF record** — `src/classes/PdfPoytakirja.ts` loads `public/sra-ampumakoe.pdf` (the
  official ResUL template) with `pdf-lib` and stamps results at hardcoded coordinates, then
  triggers a download.
- **Shareable result link / QR** — `src/classes/Util.ts` `koodaaTiedot` serializes one
  shooter's card to JSON, deflates with `pako`, and URL-safe base64-encodes it into a
  `./tulos?d=...` link. `src/views/Tuloskortti.vue` reverses this (`pako.inflate`) and also
  renders it as a QR code. This is how results move between devices offline.

**Routing** (`src/router/index.ts`, `createWebHistory` with base `/sra-koe/`): most views use
`OletusLayout`; the printable result card (`/tulos` → `Tuloskortti`) uses `KokoSivuLayout`. The
core flow is `TulosLista` (shooter list) → `LaskuriView` (`/kirjaus/:rasti/:ampuja`, the scoring
keypad) → `Ampuja` (per-shooter detail/PDF). `LaskuriView` contains the next/previous navigation
logic that rotates through shooters and stages.

**GitHub Pages SPA hack:** because Pages has no server-side routing, `public/404.html`
captures the requested path into `sessionStorage` and redirects to `index.html`; `src/main.ts`
reads `redirectPath` back and replays it through the router before mounting. Preserve this when
touching routing or the entry point.

## Testing conventions

Cypress E2E specs in `cypress/e2e/` are numbered and run in order to simulate a full test
session (`00_*` sets up shooters + safety acknowledgment, `01`–`05` score each stage,
`06_ampumakoe` checks results). They rely on custom commands in `cypress/support/commands.ts`
— notably `cy.alustaKoe()` (full setup), `cy.ammu(taulu, n)` (registers n random hits via the
`T<taulu><class>plus` buttons), and `cy.aika1/2/3()`. If you add or rename scoring UI elements,
keep these element IDs (e.g. `T0Aplus`, `aika1`, `uusinimi`, `turvallisuuskuittaus`) stable or
update the commands.
