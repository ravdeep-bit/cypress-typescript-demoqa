import { FormPage } from '../../pages/FormPage';
import formData from '../../testdata/formData.json';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: 'Male' | 'Female' | 'Other';
  subject: string;
  hobby: 'Sports' | 'Reading' | 'Music';
  address: string;
  state: string;
  city: string;
  dob: { day: number; month: string; year: number };
}

const data = formData as FormData;
const formPage = new FormPage();

describe('Practice Form — lets a user submit personal details', () => {
  beforeEach(() => {
    formPage.goto();
  });

  it(
    'submits all fields and the confirmation modal echoes the input',
    { tags: ['@smoke'] },
    () => {
      // Form should be client-side only — assert no demoqa POST/PUT fires.
      const baseUrl = Cypress.config('baseUrl');
      cy.intercept('POST', `${baseUrl}/**`).as('appPost');
      cy.intercept('PUT', `${baseUrl}/**`).as('appPut');

      formPage.fillName(data.firstName, data.lastName);
      formPage.fillEmail(data.email);
      formPage.selectGender(data.gender);
      formPage.fillMobile(data.mobile);
      formPage.fillDateOfBirth(data.dob.day, data.dob.month, data.dob.year);
      formPage.addSubject(data.subject);
      formPage.selectHobby(data.hobby);
      formPage.fillAddress(data.address);
      formPage.selectState(data.state);
      formPage.selectCity(data.city);
      formPage.submit();

      formPage.getModalTitle().should('eq', 'Thanks for submitting the form');
      formPage.getModalField('Student Name').should('eq', `${data.firstName} ${data.lastName}`);
      formPage.getModalField('Student Email').should('eq', data.email);
      formPage.getModalField('Mobile').should('eq', data.mobile);
      formPage.getModalField('Address').should('eq', data.address);
      formPage.getModalField('State and City').should('eq', `${data.state} ${data.city}`);

      cy.get('@appPost.all').should('have.length', 0);
      cy.get('@appPut.all').should('have.length', 0);
    },
  );
});
