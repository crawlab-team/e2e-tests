import NormalLayoutPage from '@/page-objects/layout/normalLayoutPage';

export default abstract class ListLayoutPage<T> extends NormalLayoutPage {
  protected abstract path: string;

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
    await this.page.goto(this.path);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForSelector(this.listContainer);
  }

  async navigateToDetail(rowIndex: number) {
    const row = this.page.locator(this.tableRows).nth(rowIndex);
    await row.locator(this.viewButton).click();
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

  async getTableRowCount(): Promise<number> {
    return await this.page.locator(this.tableRows).count();
  }

  abstract getTableRow(rowIndex: number): Promise<T>;
}