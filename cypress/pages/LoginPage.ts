const USERNAME = '#userName';
const PASSWORD = '#password';
const LOGIN_BUTTON = '#login';

export class LoginPage {
  static readonly ERROR_CONTAINER = '#name';

  goto(): void {
    cy.visit('/login');
    cy.get(LOGIN_BUTTON).should('be.visible');
  }

  login(username: string, password: string): void {
    cy.get(USERNAME).clear();
    if (username) cy.get(USERNAME).type(username);
    cy.get(PASSWORD).clear();
    if (password) cy.get(PASSWORD).type(password, { log: false });
    cy.get(LOGIN_BUTTON).click();
  }

  waitForLoginSuccess(): void {
    cy.url().should('include', '/profile');
  }
}
