const SEARCH_BOX = '#searchBox';
// CSS.escape guards against titles containing quotes / special chars that would break the attribute selector.
const BOOK_TITLE_LINK = (title: string): string => `span[id="see-book-${CSS.escape(title)}"] a`;
// Visible label that only renders on the detail view (not the catalogue) —
// used as a proxy for "we successfully navigated to the detail page".
const DETAIL_VIEW_INDICATOR = 'ISBN';

export class BookStorePage {
  static readonly ROW = 'tbody tr';

  goto(): void {
    cy.visit('/books');
    cy.get(SEARCH_BOX).should('be.visible');
  }

  search(term: string): void {
    cy.get(SEARCH_BOX).clear();
    if (term) cy.get(SEARCH_BOX).type(term);
  }

  openBookByTitle(title: string): void {
    cy.get(BOOK_TITLE_LINK(title)).click();
    cy.url().should('include', '/books?search=');
    cy.contains(DETAIL_VIEW_INDICATOR).should('be.visible');
  }
}
