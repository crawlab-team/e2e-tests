import { Page } from '@playwright/test';

export class LoginPage {
  private page: Page;
  private usernameField = 'input[name="username"]';
  private passwordField = 'input[name="password"]';
  private submitButton = 'button[name="submit"]';
  public errorMessage = '.el-message--error';

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/#/login', { waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForSelector(this.usernameField);
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.submit();
  }

  async enterUsername(username: string) {
    await this.page.fill(this.usernameField, username);
  }

  async enterPassword(password: string) {
    await this.page.fill(this.passwordField, password);
  }

  async submit() {
    await this.page.click(this.submitButton);
  }
}
