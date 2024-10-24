import { Page } from '@playwright/test';
import ListLayoutPage from '@/page-objects/layout/listLayoutPage';
import NormalLayoutPage from '@/page-objects/layout/normalLayoutPage';

export default abstract class DetailLayoutPage<T, L extends ListLayoutPage<T>> extends NormalLayoutPage {
  private listPage: L;

  protected abstract getListPage(): L;

  constructor(page: Page) {
    super(page);
    this.listPage = this.getListPage();
  }

  protected detailContainer = '.detail-layout';
  protected backButton = '[data-test="back-btn"]';
  protected saveButton = '[data-test="save-btn"]';
  protected activeTabSelector = '.nav-tabs .el-menu-item.is-active';

  async navigate(rowIndex?: number) {
    await super.navigate();
    await this.listPage.navigate();
    await this.listPage.navigateToDetail(rowIndex || 0);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForSelector(this.detailContainer);
  }

  async getActiveTabName() {
    const activeTab = this.page.locator(this.activeTabSelector);
    return activeTab.textContent();
  }

  async switchToTab(tabName: string) {
    await this.page.click(`.nav-tabs [data-test="${tabName}"]`);
  }

  async save() {
    await this.page.click(this.saveButton);
  }

  async goBack() {
    await this.page.click(this.backButton);
  }
}
