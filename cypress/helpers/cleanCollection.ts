import { apiLogin } from './apiLogin';

// Wipes the user's book collection via the REST API.
// Must run BEFORE UI login — its API login invalidates other tokens (single-session).
export function cleanCollection(): void {
  apiLogin().then(({ userId, token }) => {
    cy.request({
      method: 'DELETE',
      url: `/BookStore/v1/Books?UserId=${userId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
  });
}
