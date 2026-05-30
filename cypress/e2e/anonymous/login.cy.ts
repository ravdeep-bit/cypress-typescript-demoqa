import { LoginPage } from '../../pages/LoginPage';
import { Header } from '../../pages/Header';
import { validCredentials, invalidCredentials } from '../../fixtures/testCredentials';

const loginPage = new LoginPage();
const header = new Header();

describe('Login — lets a user authenticate', () => {
  beforeEach(() => {
    loginPage.goto();
  });

  it('logs in successfully with valid credentials', { tags: ['@smoke'] }, () => {
    loginPage.login(validCredentials.username, validCredentials.password);
    loginPage.waitForLoginSuccess();
    cy.get(Header.USER_NAME_VALUE).should('have.text', validCredentials.username);
  });

  it('shows an error message when password is invalid', { tags: ['@smoke'] }, () => {
    loginPage.login(invalidCredentials.username, invalidCredentials.password);
    cy.get(LoginPage.ERROR_CONTAINER).should('be.visible').and('contain.text', 'Invalid');
  });

  it('does not navigate away when fields are submitted empty', () => {
    loginPage.login('', '');
    cy.url().should('include', '/login');
  });
});
