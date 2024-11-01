import { Page } from '@playwright/test';

export default abstract class BaseLayoutPage {
  protected page: Page;
  protected confirmButton = '[custom-class~="visible"] #confirm-btn';

  constructor(page: Page) {
    this.page = page;
  }

  async confirm() {
    await this.page.click(this.confirmButton);
  }

  async selectOption(selector: string, value: string, dropdownSelector = '.el-select-dropdown') {
    await this.page.click(selector);
    await this.page.click(`${dropdownSelector} [data-test="${value}"]`);
  }

  async selectOptionByText(selector: string, text: string, dropdownSelector = '.el-select-dropdown') {
    await this.page.click(selector);
    await this.page.click(`${dropdownSelector} [data-test-text="${text}"]`);
  }

  async clickContextMenuItem(selector: string) {
    await this.page.click(`.context-menu[aria-hidden="false"] ${selector}`);
  }
}
