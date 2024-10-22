import NormalLayoutPage from '@/page-objects/layout/normalLayoutPage';

export default abstract class ListLayoutPage extends NormalLayoutPage {
  protected abstract path: string;

  protected listContainer = '.list-layout';
  protected createButton = '#add-btn';
  protected searchInput = '#filter-search .el-input input';
  protected tableRows = '.list-layout table tbody tr';
  protected viewButton = '.view-btn';

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
}