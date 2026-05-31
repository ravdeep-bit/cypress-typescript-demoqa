// Each labelled field on the detail page lives in #<id>-wrapper, label in .col-md-3, value in .col-md-9.
const FIELD_WRAPPERS = {
  isbn: '#ISBN-wrapper',
  title: '#title-wrapper',
  subtitle: '#subtitle-wrapper',
  author: '#author-wrapper',
  publisher: '#publisher-wrapper',
  pages: '#pages-wrapper',
  description: '#description-wrapper',
  website: '#website-wrapper',
} as const;
type FieldName = keyof typeof FIELD_WRAPPERS;

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

  // Returns the trimmed value text (right column) of a labelled field.
  getField(name: FieldName): Cypress.Chainable<string> {
    return cy.get(`${FIELD_WRAPPERS[name]} .col-md-9`).invoke('text').then((text) => text.trim());
  }

  // Returns the trimmed label text (left column) of a labelled field.
  getLabel(name: FieldName): Cypress.Chainable<string> {
    return cy.get(`${FIELD_WRAPPERS[name]} .col-md-3`).invoke('text').then((text) => text.trim());
  }
}
