import { defineConfig } from 'cypress';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mochawesomePlugin = require('cypress-mochawesome-reporter/plugin');

export default defineConfig({
  projectId: 'trp3q4',
  // Deletes screenshots/videos before each `cypress run` so failures only show the latest run.
  trashAssetsBeforeRuns: true,
  // HTML reports — see cypress/reports/html/index.html after `npm test`.
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  e2e: {
    baseUrl: 'https://demoqa.com',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 30000,
    viewportWidth: 1366,
    viewportHeight: 768,
    video: false,
    retries: { runMode: 2, openMode: 0 },
    setupNodeEvents(on) {
      mochawesomePlugin(on);
    },
  },
});
