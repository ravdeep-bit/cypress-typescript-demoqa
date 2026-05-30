import { LoginPage } from '../../pages/LoginPage';
import { Header } from '../../pages/Header';
import { validCredentials } from '../../fixtures/testCredentials';

const loginPage = new LoginPage();
const header = new Header();

describe('Logout — lets an authenticated user sign out', () => {
  it('logs out from the header and the session is cleared', { tags: ['@smoke'] }, () => {
    // cy.session caches the login — re-runs restore cookies, no UI login.
    cy.session('demoqa-user', () => {
      loginPage.goto();
      loginPage.login(validCredentials.username, validCredentials.password);
      loginPage.waitForLoginSuccess();
    });
    cy.visit('/profile');

    header.logout();
    cy.url().should('include', '/login');

    // Session check: /profile must not reveal the username after logout.
    cy.visit('/profile');
    cy.get(Header.USER_NAME_VALUE).should('not.exist');
  });
});
