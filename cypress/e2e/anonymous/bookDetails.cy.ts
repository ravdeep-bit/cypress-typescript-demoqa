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
      bookDetailsPage.getField('isbn').should('equal', urlIsbn);
    });
  });

  it('displays non empty metadata fields for a known book', () => {
    bookDetailsPage.getField('isbn').should('not.be.empty');
    bookDetailsPage.getField('title').should('equal', knownBook.title);
    bookDetailsPage.getField('author').should('not.be.empty');
    bookDetailsPage.getField('publisher').should('not.be.empty');
    bookDetailsPage.getField('pages').should('not.be.empty');
    bookDetailsPage.getField('description').should('not.be.empty');
    bookDetailsPage.getField('website').should('match', /^https?:\/\/.+/);
  });

  it('renders the expected field labels', () => {
    bookDetailsPage.getLabel('isbn').should('contain', 'ISBN');
    bookDetailsPage.getLabel('title').should('contain', 'Title');
    bookDetailsPage.getLabel('subtitle').should('contain', 'Sub Title');
    bookDetailsPage.getLabel('author').should('contain', 'Author');
    bookDetailsPage.getLabel('publisher').should('contain', 'Publisher');
    bookDetailsPage.getLabel('pages').should('contain', 'Total Pages');
    bookDetailsPage.getLabel('description').should('contain', 'Description');
    bookDetailsPage.getLabel('website').should('contain', 'Website');
  });

  it('does not render "Add To Your Collection" button when not logged in', () => {
    cy.contains('button', BookDetailsPage.ADD_BUTTON_TEXT).should('not.exist');
  });
});
