import ListLayoutPage from '@/page-objects/layout/listLayoutPage';

export class SpiderListPage extends ListLayoutPage<Spider> {
  protected path = '/#/spiders';

  // Locators
  private nameColumn = '.name';
  private projectColumn = '.project_id';
  private gitColumn = '.git_id';
  private lastStatusColumn = '.last_status';
  private lastRunAtColumn = '.last_run_ts';
  private statsColumn = '.status';
  private descriptionColumn = '.description';
  private runButton = '.run-btn';
  private uploadFilesButton = '.upload-files-btn';
  private viewDataButton = '.view-data-btn';
  private projectFilterSelector = '#filter-select-project';

  async filterByProject(projectName: string) {
    await this.selectOptionByText(this.projectFilterSelector, projectName);
  }

  async isCreateEditSpiderDialogVisible() {
    return await this.page.isVisible('.create-edit-spider-dialog');
  }

  async isRunSpiderDialogVisible() {
    return await this.page.isVisible('[custom-class*="run-spider-dialog"]');
  }

  async isUploadSpiderFilesDialogVisible() {
    return await this.page.isVisible('[custom-class*="upload-files-dialog"]');
  }

  async runSpider(rowIndex: number) {
    await this.page.locator(this.tableRows).nth(rowIndex).locator(this.runButton).click();
  }

  async uploadFiles(rowIndex: number) {
    await this.page.locator(this.tableRows).nth(rowIndex).locator(this.uploadFilesButton).click();
  }

  async viewData(rowIndex: number) {
    await this.page.locator(this.tableRows).nth(rowIndex).locator(this.viewDataButton).click();
  }

  async getTableRow(rowIndex: number) {
    const row = this.page.locator(this.tableRows).nth(rowIndex);
    return {
      name: await row.locator(this.nameColumn).innerText(),
      project: await row.locator(this.projectColumn).innerText(),
      git: (await this.isPro()) ? await row.locator(this.gitColumn).innerText() : undefined,
      last_status: await row.locator(this.lastStatusColumn).innerText(),
      last_run_ts: await row.locator(this.lastRunAtColumn).innerText(),
      stats: await row.locator(this.statsColumn).innerText(),
      description: await row.locator(this.descriptionColumn).innerText(),
    } as Spider;
  }
}

