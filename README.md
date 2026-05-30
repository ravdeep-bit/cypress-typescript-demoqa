# Cypress Tech Assignment — demoqa Book Store

End-to-end test suite for [demoqa.com](https://demoqa.com) using Cypress 15 with TypeScript.

## Suites

| Spec | What it covers |
|---|---|
| `cypress/e2e/anonymous/login.cy.ts` | Valid login, invalid password, empty-field submit |
| `cypress/e2e/anonymous/search.cy.ts` | Data-driven search — 5 scenarios from `testdata/searchScenarios.json` |
| `cypress/e2e/anonymous/bookDetails.cy.ts` | Catalogue → detail page → metadata + Add-button hidden for anonymous |
| `cypress/e2e/anonymous/formSubmission.cy.ts` | Practice form: fill all fields → submit → assert modal echoes input |
| `cypress/e2e/authenticated/manageBookCollection.cy.ts` | Login → add → re-add (dupe) → verify on /profile → API delete → verify |
| `cypress/e2e/authenticated/logout.cy.ts` | Login (cached via `cy.session`) → click logout in header → verify redirect to /login |

## Running

```bash
npm install

# Credentials for the authenticated suite (set in the same terminal that launches Cypress)
export CYPRESS_DEMOQA_USERNAME=your_demoqa_username
export CYPRESS_DEMOQA_PASSWORD=your_demoqa_password

npm run cy:open          # interactive
npm test                 # headless, full suite — generates cypress/reports/html/index.html
npm run typecheck        # tsc --noEmit
```

Run a single spec:

```bash
npx cypress run --spec "cypress/e2e/anonymous/bookDetails.cy.ts"
```

After `npm test`, open `cypress/reports/html/index.html` for the Mochawesome HTML report (suite breakdown, durations, embedded failure screenshots).

## Project structure

| Folder | Purpose |
|---|---|
| `pages/` | Page Object Models — selectors + DOM interactions for a single page |
| `support/` | Cypress-loaded code — custom `cy.*` commands, global hooks, type augmentations |
| `helpers/` | Pure utilities — API helpers, data builders, anything not page-scoped |
| `fixtures/` | Static data (Cypress can auto-load via `cy.fixture()`) |
| `testdata/` | Project-local test data files (JSON) consumed via `import` rather than `cy.fixture()` |
| `e2e/` | Specs, split by auth state (`anonymous/`, `authenticated/`) |

Cypress requires `e2e/`, `support/`, and `fixtures/`; the rest are organisational.

## Design decisions

| Decision | Why |
|---|---|
| **API cleanup, not UI** | demoqa's UI delete (both "Delete All Books" and per-row trash icons) is broken. The API path is faster, more reliable, and unaffected by future UI changes. |
| **Page Object Model — locators + actions only, no assertions** | Pages own *how* the page works (selectors, interactions). Specs own *what* we're verifying (`should()`, `expect()`). This separation makes both halves replaceable without touching the other. |
| **Module-scoped `const` selectors** instead of `private static readonly` | Same encapsulation (selectors aren't exported), less prefix noise inside methods. Idiomatic modern TypeScript. |
| **Data-driven via JSON in `testdata/`** | Adding a search scenario or changing form input means editing JSON — no spec changes, no recompile. TypeScript interfaces in the spec narrow the JSON to typed values at the consumer boundary. |
| **One test for the full E2E journey** (`manageBookCollection.cy.ts`) | Steps depend on each other (add → verify → delete). Splitting would either duplicate setup in every test or share state across tests — both fragile. |
| **Multiple short tests for independent observations** (`bookDetails.cy.ts`) | Each test verifies a distinct property of the detail page. Shared `beforeEach` navigation, independent assertions, independent failure attribution. |
| **Fail-fast on missing credentials** | `validCredentials.username/password` are property getters that throw immediately if env vars are missing. Saves ~100 s of vague UI timeouts (15 s × retries × affected tests) on misconfigured runs. |
| **`cy.intercept` for an *absence* assertion** | Form submission asserts no demoqa POST/PUT fires — proves the form really is client-side. Shows the inverse of the typical "assert 200" pattern; both directions use the same primitive. |
| **`cy.session` in `logout.cy.ts`** | Login state is cached between runs — re-runs restore cookies instead of re-typing credentials in the UI. Specs run alphabetically, so `logout.cy.ts` runs after `manageBookCollection.cy.ts` — the logout invalidates the cache on the way out, no leakage. |
| **API + UI hybrid verification** | In `manageBookCollection.cy.ts`, the UI adds the book (real user flow), then a `cy.request` to `/Account/v1/User/{id}` confirms it actually persisted server-side. UI alerts can lie — the API can't. |
| **`step()` helper for long E2E flows** | The authenticated journey runs as a single `it()` (six dependent steps). `step('Add to collection (UI) and verify (API)', () => {...})` wraps `cy.log` to print labelled section markers in the runner timeline, so failures are easy to attribute without splitting into multiple tests. |
