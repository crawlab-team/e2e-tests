import { test, expect } from '@playwright/test';
import { LoginPage } from '@/page-objects/login/loginPage';
import userData from '@/fixtures/userData.json';

test.describe('Login Tests', () => {
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
