import ListLayoutPage from '@/page-objects/layout/listLayoutPage';

export class ProjectListPage extends ListLayoutPage {
  protected path = '/#/projects';

  // Locators
  private createProjectButton = '#add-btn';
  private projectNameColumn = 'td.name';
  private projectSpidersColumn = 'td.spiders';
  private projectDescriptionColumn = 'td:nth-child(3)';
  private deleteButton = '.delete-btn';

  async navigate() {
    await super.navigate();
    await this.page.goto(this.path);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForSelector(this.listContainer);
  }

  async clickCreateProject() {
    await this.page.click(this.createProjectButton);
  }

  async searchProject(searchTerm: string) {
    await this.page.fill(this.searchInput, searchTerm);
  }

  async getProjectCount(): Promise<number> {
    return await this.page.locator(this.tableRows).count();
  }

  async getProjectData(rowIndex: number): Promise<{ name: string; spiders: string; description: string }> {
    const row = this.page.locator(this.tableRows).nth(rowIndex);
    return {
      name: await row.locator(this.projectNameColumn).innerText(),
      spiders: await row.locator(this.projectSpidersColumn).innerText(),
      description: await row.locator(this.projectDescriptionColumn).innerText(),
    };
  }

  async viewProject(rowIndex: number) {
    const row = this.page.locator(this.tableRows).nth(rowIndex);
    await row.locator(this.viewButton).click();
  }

  async deleteProject(rowIndex: number) {
    const row = this.page.locator(this.tableRows).nth(rowIndex);
    await row.locator(this.deleteButton).click();
  }
}

