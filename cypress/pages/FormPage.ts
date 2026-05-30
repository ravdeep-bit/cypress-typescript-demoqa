// Form fields
const FIRST_NAME = '#firstName';
const LAST_NAME = '#lastName';
const EMAIL = '#userEmail';
const MOBILE = '#userNumber';
const ADDRESS = '#currentAddress';
const SUBJECTS_INPUT = '#subjectsInput';

// Date picker
const DOB_INPUT = '#dateOfBirthInput';
const DOB_MONTH = '.react-datepicker__month-select';
const DOB_YEAR = '.react-datepicker__year-select';
const DATE_PICKER_DAY_PREFIX = '.react-datepicker__day--';
const DATE_PICKER_OUTSIDE_MONTH = '.react-datepicker__day--outside-month';

// Dropdowns (react-select)
const STATE = '#state';
const CITY = '#city';
const SELECT_DROPDOWN_OPTION = '[id*="react-select"][id*="-option"]';

// Autocomplete
const SUBJECT_OPTION = '.subjects-auto-complete__option';

// Submission + confirmation modal
const SUBMIT = '#submit';
const RESULT_MODAL_TITLE = '#example-modal-sizes-title-lg';
const RESULT_MODAL_ROW = '.modal-body table tr';

export class FormPage {
  goto(): void {
    cy.visit('/automation-practice-form');
    cy.get(FIRST_NAME).should('be.visible');
  }

  fillName(first: string, last: string): void {
    cy.get(FIRST_NAME).clear().type(first);
    cy.get(LAST_NAME).clear().type(last);
  }

  fillEmail(email: string): void {
    cy.get(EMAIL).clear().type(email);
  }

  selectGender(gender: 'Male' | 'Female' | 'Other'): void {
    cy.contains('label', new RegExp(`^${gender}$`)).click();
  }

  fillMobile(number: string): void {
    cy.get(MOBILE).clear().type(number);
  }

  // DOB via month/year selects — typing into react-datepicker is fussy.
  fillDateOfBirth(day: number, month: string, year: number): void {
    cy.get(DOB_INPUT).click();
    cy.get(DOB_MONTH).select(month);
    cy.get(DOB_YEAR).select(String(year));
    // demoqa's day cells use a zero-padded 3-digit class — day 1 → "--001".
    const dayClass = `${DATE_PICKER_DAY_PREFIX}${String(day).padStart(3, '0')}`;
    // Exclude neighbouring-month days that pad the calendar edges — clicking
    // those leaves the picker open and blocks subsequent interactions.
    cy.get(dayClass).not(DATE_PICKER_OUTSIDE_MONTH).first().click();
  }

  addSubject(subject: string): void {
    cy.get(SUBJECTS_INPUT).type(subject);
    cy.contains(SUBJECT_OPTION, subject).click();
  }

  selectHobby(hobby: 'Sports' | 'Reading' | 'Music'): void {
    cy.contains('label', hobby).click();
  }

  fillAddress(text: string): void {
    cy.get(ADDRESS).clear().type(text);
  }

  selectState(state: string): void {
    cy.get(STATE).click();
    cy.contains(SELECT_DROPDOWN_OPTION, state).click();
  }

  selectCity(city: string): void {
    cy.get(CITY).click();
    cy.contains(SELECT_DROPDOWN_OPTION, city).click();
  }

  // force:true bypasses the ad banner that overlays the submit button.
  submit(): void {
    cy.get(SUBMIT).scrollIntoView().click({ force: true });
  }

  getModalTitle(): Cypress.Chainable<string> {
    return cy.get(RESULT_MODAL_TITLE).invoke('text');
  }

  getModalField(label: string): Cypress.Chainable<string> {
    return cy.contains(RESULT_MODAL_ROW, label).find('td').last().invoke('text');
  }
}
