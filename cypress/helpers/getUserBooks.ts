import { apiLogin } from './apiLogin';

// Returns the user's current book collection via the demoqa REST API.
export function getUserBooks(): Cypress.Chainable<Array<{ isbn: string; title: string }>> {
  return apiLogin()
    .then(({ userId, token }) =>
      cy.request({
        method: 'GET',
        url: `/Account/v1/User/${userId}`,
        headers: { Authorization: `Bearer ${token}` },
      }),
    )
    .then((userRes) => userRes.body.books as Array<{ isbn: string; title: string }>);
}
