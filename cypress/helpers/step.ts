// Playwright-style step grouping for Cypress. Logs the step name in the
// runner's command panel and runs the callback. Useful for breaking a long
// test into labelled sections without splitting it into multiple it()s.
export function step(name: string, fn: () => void): void {
  cy.log(`**${name}**`);
  fn();
}
