import ListLayoutPage from '@/page-objects/layout/listLayoutPage';

export class ProjectListPage extends ListLayoutPage<Project> {
  protected path = '/#/projects';

  // Locators
  private projectNameColumn = 'td:nth-child(2)';
  private projectSpidersColumn = 'td:nth-child(3)';
  private projectDescriptionColumn = 'td:nth-child(4)';

  async getTableRow(rowIndex: number) {
    const row = this.page.locator(this.tableRows).nth(rowIndex);
    return {
      name: await row.locator(this.projectNameColumn).innerText(),
      spiders: await row.locator(this.projectSpidersColumn).innerText(),
      description: await row.locator(this.projectDescriptionColumn).innerText(),
    } as Project;
  }
}

