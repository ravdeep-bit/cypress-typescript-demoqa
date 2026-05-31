# Cypress Tech Assignment

![CI](https://github.com/ravdeep-bit/cypress-typescript-demoqa/actions/workflows/ci.yml/badge.svg)

UX test suite for [demoqa.com](https://demoqa.com) using Cypress 15 + TypeScript.

## Suites

| Spec | What it covers |
|---|---|
| `anonymous/login.cy.ts` | Valid login, invalid password, empty-field submit |
| `anonymous/search.cy.ts` | Data-driven search (5 scenarios from JSON) |
| `anonymous/bookDetails.cy.ts` | Detail page metadata + Add-button hidden when anonymous |
| `anonymous/formSubmission.cy.ts` | Form fill → submit → modal echoes input |
| `authenticated/manageBookCollection.cy.ts` | Login → add → re-add (dupe) → /profile → API delete |
| `authenticated/logout.cy.ts` | `cy.session`-cached login → logout → verify redirect |

## Running

```bash
npm install
export CYPRESS_DEMOQA_USERNAME=your_demoqa_username
export CYPRESS_DEMOQA_PASSWORD=your_demoqa_password

npm test               # full suite, headless
npm run cy:open        # interactive
npm run typecheck      # tsc --noEmit
```

### HTML report

`npm test` writes a Mochawesome report at `cypress/reports/index.html` (suite breakdown, durations, embedded failure screenshots).

Reporter chosen for scope. Alternatives: **Monocart** if you also want video playback; **Allure** or **Cypress Cloud** if you want video + run history + trends.

- **Local:** `open cypress/reports/index.html` (macOS) / `xdg-open` (Linux) / `start` (Windows)
- **Live (latest main):** [ravdeep-bit.github.io/cypress-typescript-demoqa](https://ravdeep-bit.github.io/cypress-typescript-demoqa/)
- **Per-run download:** Actions tab → pick a run → Artifacts → `cypress-report`

## Project structure

| Folder | What lives here |
|---|---|
| `pages/` | 6 page objects — `LoginPage`, `BookStorePage`, `BookDetailsPage`, `FormPage`, `ProfilePage`, `Header`. Each owns module-scoped `const` selectors + action methods (no assertions). |
| `helpers/` | `apiLogin` (shared auth dance), `cleanCollection` (pre-test API wipe), `getUserBooks` (post-add API verify), `step` (Playwright-style log markers). |
| `fixtures/` | `testCredentials.ts` — `validCredentials` (getter-based fail-fast on env vars) + `invalidCredentials` (hard-coded fake for the negative login test). |
| `testdata/` | `searchScenarios.json` (5 search cases), `knownBook.json` (the Git Pocket Guide used in book details + E2E), `formData.json` (one full practice-form fill). |
| `support/` | `e2e.ts` registers the Mochawesome reporter; `grep-types.d.ts` adds the `tags` field to Cypress types. |
| `e2e/` | Specs split by auth state — `anonymous/` (4 specs, no creds) and `authenticated/` (2 specs, env vars required). |

## Design decisions

| Decision | Project example |
|---|---|
| **POM — selectors + actions, no assertions** | Selectors at top of each page object; specs own `.should()` |
| **Data-driven via JSON** | `searchScenarios.json` → 5 `it()`s in `search.cy.ts` |
| **Fail-fast on missing creds** | `validCredentials` getters throw if env vars unset |
| **API + UI hybrid verification** | `manageBookCollection.cy.ts`: UI adds, `getUserBooks()` API-verifies |
| **API cleanup — fast and robust** | `cleanCollection()` + `deleteBook()` — bypasses broken UI trash icon |
| **`cy.intercept` for an *absence* assertion** | `formSubmission.cy.ts` asserts no POST/PUT fires |
| **`cy.stub` to capture `window.alert`** | `BookDetailsPage.addToCollection()` — Cypress auto-dismisses native dialogs |
| **`cy.session` for cached login** | `logout.cy.ts` demos session stored + restored |
| **`step()` helper for long E2E** | 6 markers inside single `it()` of `manageBookCollection.cy.ts` |
| **Single source for credentials** | `apiLogin` + specs both read `validCredentials` |

## Tags

Specs are annotated with `{ tags: ['@smoke'] }` (8 of 14 tests). The tags are **documentation-only** today — `@cypress/grep` isn't installed, so `npm test` runs everything. Left out for now because the full suite finishes in ~60 s — filtering doesn't earn the extra dependency yet.

## Selector strategy

demoqa is a third-party app, so `data-cy` attributes aren't an option. The suite uses, in order of preference:

1. **Stable IDs** — `#userName`, `#searchBox`, `#ISBN-wrapper` (covers most form + container elements)
2. **Visible text** — `cy.contains('button', 'Add To Your Collection')` (used when an id is reused for two different buttons)
3. **Library-specific classes** — `.react-datepicker__day--001`, `[id*="react-select"][id*="-option"]` (only where the library generates runtime ids/classes)
4. **`CSS.escape`** — guards interpolated values in attribute selectors against quotes / special chars (`BOOK_TITLE_LINK` in `BookStorePage`)

Brittle selectors are documented inline with comments explaining the constraint. If we owned the app, `@testing-library/cypress` (role + accessible name queries) would be the upgrade path.
