import NormalLayoutPage from '@/page-objects/layout/normalLayoutPage';
import { FormPage } from '@/page-objects/components/form/formPage';
import { Page } from '@playwright/test';

export default abstract class ListLayoutPage<T> extends NormalLayoutPage {
  protected abstract path: string;
  protected formPage: FormPage<T>;

  constructor(page: Page) {
    super(page);
    this.formPage = this.getFormPage();
  }

  abstract getFormPage(): FormPage<T>;

  protected listContainer = '.list-layout';
  protected createButton = '#add-btn';
  protected confirmButton = '#confirm-btn';
  protected searchInput = '#filter-search .el-input input';
  protected tableRows = '.list-layout table tbody tr';
  protected viewButton = '.view-btn';
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

  async navigateToDetail(rowIndex: number) {
    const row = this.page.locator(this.tableRows).nth(rowIndex);
    await row.locator(this.viewButton).click();
  }

  async clearSearch() {
    await this.page.fill(this.searchInput, '');
  }

  async searchRows(searchTerm: string) {
    await this.page.fill(this.searchInput, searchTerm);
  }

  async clickCreate() {
    await this.page.click(this.createButton);
  }

  async confirm() {
    await this.page.click(this.confirmButton);
  }

  async deleteRow(rowIndex: number) {
    const row = this.page.locator(this.tableRows).nth(rowIndex);
    await row.locator(this.deleteButton).click();
    await this.page.click(this.deleteConfirmButton);
  }

  async createRow(form: T) {
    await this.clickCreate();
    await this.formPage.fillForm(form);
    await this.confirm();
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