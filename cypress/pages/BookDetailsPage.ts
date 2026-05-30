// Each labelled field on the detail page lives in #<id>-wrapper > .col-md-9.
const FIELD_VALUE = (id: string): string => `#${id}-wrapper .col-md-9`;

export class BookDetailsPage {
  // id="addNewRecordButton" is reused for "Add To Your Collection" (logged in)
  // and "Back To Book Store" (anonymous) — match by visible text instead.
  static readonly ADD_BUTTON_TEXT = 'Add To Your Collection';

  getIsbnFromUrl(): Cypress.Chainable<string> {
    return cy.url().then((url) => new URL(url).searchParams.get('search') ?? '');
  }

  // Stubs window.alert as @alert, clicks Add, then returns the captured message.
  addToCollection(): Cypress.Chainable<string> {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });
    cy.contains('button', BookDetailsPage.ADD_BUTTON_TEXT).should('be.visible').click();
    return cy
      .get('@alert')
      .should('have.been.called')
      .then((stub) => (stub as unknown as sinon.SinonStub).firstCall.args[0] as string);
  }

  // Returns the trimmed text of a labelled field on the detail page.
  getField(id: string): Cypress.Chainable<string> {
    return cy.get(FIELD_VALUE(id)).invoke('text').then((text) => text.trim());
  }
}
