import ListLayoutPage from '@/page-objects/layout/listLayoutPage';
import { SpiderFormPage } from '@/page-objects/views/spider/spiderFormPage';

export class SpiderListPage extends ListLayoutPage<Spider> {
  protected path = '/#/spiders';

  getFormPage() {
    return new SpiderFormPage(this.page);
  }

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
  private viewTasksButton = '.view-tasks-btn';
  private viewSchedulesButton = '.view-schedules-btn';
  private viewDataButton = '.view-data-btn';
  private projectFilterSelector = '#filter-select-project';

  async filterByProject(projectName: string, wait = 1000) {
    await this.selectOptionByText(this.projectFilterSelector, projectName);
    if (wait) {
      await this.page.waitForTimeout(wait);
    }
  }

  async isUploadSpiderFilesDialogVisible() {
    return await this.page.isVisible('[custom-class*="upload-files-dialog"]');
  }

  async clickRunSpider(rowIndex: number) {
    await this.page.locator(this.tableRows).nth(rowIndex).locator(this.runButton).click();
  }

  async runSpider(rowIndex: number) {
    await this.clickRunSpider(rowIndex);
    await this.page.waitForSelector(this.confirmButton);
    await this.confirm();
  }

  async clickUploadFiles(rowIndex: number) {
    await this.clickShowMore(rowIndex);
    await this.clickContextMenuItem(this.uploadFilesButton);
  }

  async clickViewTasks(rowIndex: number) {
    await this.clickShowMore(rowIndex);
    await this.clickContextMenuItem(this.viewTasksButton);
    await this.waitForDetailPageLoad();
  }

  async clickViewSchedules(rowIndex: number) {
    await this.clickShowMore(rowIndex);
    await this.clickContextMenuItem(this.viewSchedulesButton);
    await this.waitForDetailPageLoad();
  }

  async clickViewData(rowIndex: number) {
    await this.clickShowMore(rowIndex);
    await this.clickContextMenuItem(this.viewDataButton);
    await this.waitForDetailPageLoad();
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

