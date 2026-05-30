// Throws with a clear message if env vars aren't set, so any test that
// needs valid credentials fails fast
function requireEnv(name: string): string {
  const value = Cypress.env(name) as string | undefined;
  if (!value) {
    throw new Error(
      `Set CYPRESS_${name} before running authenticated tests`,
    );
  }
  return value;
}

export const validCredentials = {
  get username(): string {
    return requireEnv('DEMOQA_USERNAME');
  },
  get password(): string {
    return requireEnv('DEMOQA_PASSWORD');
  },
};

export const invalidCredentials = {
  username: 'definitely_not_a_real_user_zzz',
  password: 'Wrong_Password_123!',
};
