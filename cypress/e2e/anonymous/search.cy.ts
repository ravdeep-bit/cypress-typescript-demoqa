import { BookStorePage } from '../../pages/BookStorePage';
import searchScenarios from '../../testdata/searchScenarios.json';

interface SearchScenario {
  description: string;
  searchTerm: string;
  expectEmpty: boolean;
  expectedTitleContains: string | null;
  smoke?: boolean;
}

const bookStorePage = new BookStorePage();

describe('Book Search — lets a user find a book in the catalogue', () => {
  beforeEach(() => {
    bookStorePage.goto();
  });

  (searchScenarios as SearchScenario[]).forEach((scenario) => {
    it(
      `returns the expected result when ${scenario.description}`,
      { tags: scenario.smoke ? ['@smoke'] : [] },
      () => {
        bookStorePage.search(scenario.searchTerm);
        if (scenario.expectEmpty) {
          cy.get(BookStorePage.ROW).should('have.length', 0);
        } else {
          cy.contains(BookStorePage.ROW, new RegExp(scenario.expectedTitleContains!, 'i')).should(
            'be.visible',
          );
        }
      },
    );
  });
});
