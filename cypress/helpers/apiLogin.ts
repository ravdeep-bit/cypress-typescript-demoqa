import { validCredentials } from '../fixtures/testCredentials';

// Logs in via the demoqa REST API and returns the auth credentials.
// validCredentials getters throw fail-fast if env vars are missing.
export function apiLogin(): Cypress.Chainable<{ userId: string; token: string }> {
  return cy
    .request({
      method: 'POST',
      url: '/Account/v1/Login',
      body: {
        userName: validCredentials.username,
        password: validCredentials.password,
      },
    })
    .then((res) => res.body as { userId: string; token: string });
}
