import { LoginPage } from '../../pages/LoginPage';
import { BookStorePage } from '../../pages/BookStorePage';
import { BookDetailsPage } from '../../pages/BookDetailsPage';
import { ProfilePage } from '../../pages/ProfilePage';
import { validCredentials } from '../../fixtures/testCredentials';
import { cleanCollection } from '../../helpers/cleanCollection';
import { getUserBooks } from '../../helpers/getUserBooks';
import { step } from '../../helpers/step';
import knownBook from '../../testdata/knownBook.json';

const loginPage = new LoginPage();
const bookStorePage = new BookStorePage();
const bookDetailsPage = new BookDetailsPage();
const profilePage = new ProfilePage();

describe('Book Collection — authenticated user journey', () => {
  it(
    'lets a user add a book, detects a duplicate add, lists it on /profile, and deletes it',
    { tags: ['@smoke'] },
    () => {
      step('Clean collection and log in', () => {
        // cleanCollection first — its API login invalidates other tokens (single-session).
        cleanCollection();
        loginPage.goto();
        loginPage.login(validCredentials.username, validCredentials.password);
        loginPage.waitForLoginSuccess();
      });

      step('Open the book detail page', () => {
        bookStorePage.goto();
        bookStorePage.search(knownBook.title);
        bookStorePage.openBookByTitle(knownBook.title);
      });

      step('Add to collection (UI) and verify persistence (API)', () => {
        bookDetailsPage.addToCollection().then((message) => {
          expect(message.toLowerCase(), `alert was "${message}"`).to.contain('added');
        });
        // API verify — confirms the book actually persisted server-side
        // (UI alert can lie if the request silently failed).
        getUserBooks().then((books) => {
          expect(books.map((b) => b.title)).to.include(knownBook.title);
        });
      });

      step('Re-add the same book surfaces the "already present" alert', () => {
        // demoqa auto-redirects to /profile after a successful add — re-navigate.
        bookStorePage.goto();
        bookStorePage.search(knownBook.title);
        bookStorePage.openBookByTitle(knownBook.title);
        bookDetailsPage.addToCollection().then((message) => {
          expect(message.toLowerCase(), `alert was "${message}"`).to.contain('already present');
        });
      });

      step('Verify the book appears on /profile', () => {
        profilePage.goto();
        cy.contains(ProfilePage.ROW, knownBook.title).should('be.visible');
      });

      step('Delete the book and verify it is gone', () => {
        profilePage.deleteBook(knownBook.isbn);
        cy.contains(ProfilePage.ROW, knownBook.title).should('not.exist');
      });
    },
  );
});
