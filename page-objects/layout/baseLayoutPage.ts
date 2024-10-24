import { Page } from '@playwright/test';

export default abstract class BaseLayoutPage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectOption(selector: string, value: string, dropdownSelector = '.el-select-dropdown') {
    await this.page.click(selector);
    await this.page.click(`${dropdownSelector} [data-test="${value}"]`);
  }

  async selectOptionByText(selector: string, text: string, dropdownSelector = '.el-select-dropdown') {
    await this.page.click(selector);
    await this.page.click(`${dropdownSelector} [data-test-text="${text}"]`);
  }
}
