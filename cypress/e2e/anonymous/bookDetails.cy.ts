import { BookStorePage } from '../../pages/BookStorePage';
import { BookDetailsPage } from '../../pages/BookDetailsPage';
import knownBook from '../../testdata/knownBook.json';

const bookStorePage = new BookStorePage();
const bookDetailsPage = new BookDetailsPage();

describe('Book Details — lets a user view a book\'s metadata', () => {
  beforeEach(() => {
    bookStorePage.goto();
    bookStorePage.search(knownBook.title);
    bookStorePage.openBookByTitle(knownBook.title);
  });

  it('navigates to detail page with ISBN in the URL that matches the page', { tags: ['@smoke'] }, () => {
    cy.url().should('include', '/books?search=');
    bookDetailsPage.getIsbnFromUrl().then((urlIsbn) => {
      expect(urlIsbn).to.not.be.empty;
      bookDetailsPage.getField('ISBN').should('equal', urlIsbn);
    });
  });

  it('displays the expected metadata fields for a known book', () => {
    bookDetailsPage.getField('ISBN').should('not.be.empty');
    bookDetailsPage.getField('title').should('equal', knownBook.title);
    bookDetailsPage.getField('author').should('not.be.empty');
    bookDetailsPage.getField('publisher').should('not.be.empty');
    bookDetailsPage.getField('pages').should('not.be.empty');
    bookDetailsPage.getField('description').should('not.be.empty');
    bookDetailsPage.getField('website').should('match', /^https?:\/\/.+/);
  });

  it('does not render "Add To Your Collection" button when not logged in', () => {
    cy.contains('button', BookDetailsPage.ADD_BUTTON_TEXT).should('not.exist');
  });
});
