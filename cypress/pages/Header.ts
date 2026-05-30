// Cross-page elements that appear in the persistent header on every page.
export class Header {
  static readonly LOGOUT_BUTTON = '#submit';
  static readonly USER_NAME_VALUE = '#userName-value';

  logout(): void {
    cy.get(Header.LOGOUT_BUTTON).click();
  }
}
