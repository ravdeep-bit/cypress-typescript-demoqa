// Adds the `tags` field to Cypress.TestConfigOverrides for @cypress/grep compatibility.
declare namespace Cypress {
  interface TestConfigOverrides {
    tags?: string | string[];
  }
}
