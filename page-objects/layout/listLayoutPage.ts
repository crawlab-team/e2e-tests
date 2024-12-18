import NormalLayoutPage from '@/page-objects/layout/normalLayoutPage';
import { FormPage } from '@/page-objects/components/form/formPage';
import { Page } from '@playwright/test';

export default abstract class ListLayoutPage<T extends BaseModel> extends NormalLayoutPage {
  protected abstract path: string;
  protected formPage: FormPage<T>;

  constructor(page: Page) {
    super(page);
    this.formPage = this.getFormPage();
  }

  abstract getFormPage(): FormPage<T>;

  protected listContainer = '.list-layout';
  protected createButton = '#add-btn';
  protected searchInput = '#filter-search .el-input input';
  protected tableRows = '.list-layout table tbody tr';
  protected viewButton = '.view-btn';
  protected showMoreButton = '.show-more';
  protected deleteButton = '.delete-btn';
  protected deleteConfirmButton = '.delete-confirm-btn';

  async navigate() {
    await super.navigate();
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForSelector(this.listContainer);
  }

  async waitForDetailPageLoad() {
    await this.page.waitForSelector('.detail-layout');
  }

  async navigateToDetail(rowIndex: number) {
    const row = this.page.locator(this.tableRows).nth(rowIndex);
    await row.locator(this.viewButton).click();
    await this.waitForDetailPageLoad();
  }

  async clearSearch() {
    await this.page.fill(this.searchInput, '');
  }

  async searchRows(searchTerm: string, wait = 1000) {
    await this.page.fill(this.searchInput, searchTerm);
    if (wait) {
      await this.page.waitForTimeout(wait);
    }
  }

  async clickCreate() {
    await this.page.click(this.createButton);
  }

  async clickShowMore(rowIndex: number) {
    const row = this.page.locator(this.tableRows).nth(rowIndex);
    await row.locator(this.showMoreButton).click();
  }

  async deleteRow(rowIndex: number, wait = 1000) {
    await this.clickShowMore(rowIndex);
    await this.clickContextMenuItem(this.deleteButton);
    await this.page.click(this.deleteConfirmButton);
    if (wait) {
      await this.page.waitForTimeout(wait);
    }
  }

  async createRow(form: T, wait = 1000) {
    await this.clickCreate();
    await this.formPage.fillForm(form);
    await this.confirm();
    if (wait) {
      await this.page.waitForTimeout(wait);
    }
  }

  async createRowWithRandomName(form: T, wait = 1000) {
    const randomName = `${form.name} ${Date.now()}`;
    const formWithRandomName: T = { ...form, name: randomName };
    await this.createRow(formWithRandomName);
    if (wait) {
      await this.page.waitForTimeout(wait);
    }
    return formWithRandomName;
  }

  async getTableRowCount(): Promise<number> {
    return await this.page.locator(this.tableRows).count();
  }

  async getTotalCount(): Promise<number> {
    const totalElement = this.page.locator(this.listContainer);
    const totalText = await totalElement.getAttribute('data-test-total');
    return totalText ? parseInt(totalText, 10) : 0;
  }

  abstract getTableRow(rowIndex: number): Promise<T>;
}