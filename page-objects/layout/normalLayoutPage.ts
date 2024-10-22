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
    return await this.page.evaluate(() => {
      const token = localStorage.getItem('jwt_token');
      return !!token;
    });
  }

  private async performLogin() {
    await this.loginPage.navigate();
    await this.loginPage.login(userData.adminUser.username, userData.adminUser.password);
    // After successful login, store the JWT token
    await this.storeJwtToken();
  }

  private async storeJwtToken() {
    // Assuming the JWT token is stored in localStorage after login
    // You may need to adjust this based on your actual implementation
    await this.page.evaluate(() => {
      const token = localStorage.getItem('your_jwt_token_key');
      if (token) {
        localStorage.setItem('jwt_token', token);
      }
    });
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
