import { Page } from '@playwright/test';
import { LoginPage } from '@/page-objects/login/loginPage';
import userData from '@/fixtures/userData.json';

export default abstract class NormalLayoutPage {
  protected page: Page;
  protected loginPage: LoginPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
  }

  protected edition = '.sidebar .logo-sub-title .logo-sub-title-block:nth-child(1)';

  async navigate() {
    await this.page.goto('/'); // Navigate to the base URL
    const isLoggedIn = await this.checkLoginStatus();
    if (!isLoggedIn) {
      await this.performLogin();
    }
  }

  private async checkLoginStatus(): Promise<boolean> {
    if (this.page.url().includes('login')) {
      return false;
    }
    return await this.page.evaluate(() => {
      const token = localStorage.getItem('token');
      return !!token;
    });
  }

  private async performLogin() {
    await this.loginPage.navigate();
    await this.loginPage.login(userData.adminUser.username, userData.adminUser.password);

    // Save the storage state to avoid logging in for each test
    await this.page.context().storageState({ path: process.env.STORAGE_STATE || '.auth/state.json' });
  }

  abstract waitForPageLoad(): Promise<void>;

  async getEdition() {
    return (await this.page.locator(this.edition).textContent())?.trim();
  }

  async isPro(): Promise<boolean> {
    const edition = await this.getEdition();
    if (!edition) return false;
    return ['Pro', '专业版'].some(value => value.includes(edition));
  }
}
