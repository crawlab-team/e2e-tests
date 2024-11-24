import { expect } from '@playwright/test';
import { LoginPage } from '@/page-objects/views/login/loginPage';
import { test as base } from '@/test-utils/base-fixtures';
import userData from '@/fixtures/userData.json';
import { TAG_PRIORITY_CRITICAL } from '@/constants/priority';

// Define a new test fixture with a blank storage state
const test = base.extend({
  context: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: undefined });
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
  },
});

test.describe('Login Tests', { tag: TAG_PRIORITY_CRITICAL }, () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should login with valid credentials', async ({ page }) => {
    const { username, password } = userData.adminUser;
    await loginPage.login(username, password);

    // Verify successful login by checking for a URL change or presence of an element
    await expect(page).toHaveURL(/.*home/);
  });

  test('should fail to login with invalid credentials', async ({ page }) => {
    const { username, password } = userData.invalidUser;
    await loginPage.login(username, password);

    // Verify failure by checking for an error message
    await expect(page.locator(loginPage.errorMessage)).toBeVisible();
  });
});
