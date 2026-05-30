import { apiLogin } from '../helpers/apiLogin';

export class ProfilePage {
  static readonly ROW = 'tbody tr';

  goto(): void {
    cy.visit('/profile');
    cy.url().should('include', '/profile');
  }

  // Uses the REST API — UI trash icon is broken on demoqa.
  deleteBook(isbn: string): void {
    apiLogin().then(({ userId, token }) => {
      cy.request({
        method: 'DELETE',
        url: '/BookStore/v1/Book',
        headers: { Authorization: `Bearer ${token}` },
        body: { isbn, userId },
      });
    });
    cy.visit('/profile');
  }
}
