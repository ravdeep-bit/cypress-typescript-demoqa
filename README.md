# Cypress Tech Assignment — demoqa Book Store

End-to-end test suite for [demoqa.com](https://demoqa.com) using Cypress 15 + TypeScript.

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

`npm test` writes a Mochawesome report at `cypress/reports/html/index.html` (suite breakdown, durations, embedded failure screenshots).

```bash
open cypress/reports/html/index.html       # macOS
xdg-open cypress/reports/html/index.html   # Linux
start cypress/reports/html/index.html      # Windows
```

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
| **`cy.session` for cached login** | `logout.cy.ts` runs alphabetically last so cache invalidates on exit |
| **`step()` helper for long E2E** | 6 markers inside single `it()` of `manageBookCollection.cy.ts` |
| **Single source for credentials** | `apiLogin` + specs both read `validCredentials` |
