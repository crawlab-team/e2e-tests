import ListLayoutPage from '@/page-objects/layout/listLayoutPage';

export class ProjectListPage extends ListLayoutPage<Project> {
  protected path = '/#/projects';

  // Locators
  private nameColumn = 'td:nth-child(2)';
  private spidersColumn = 'td:nth-child(3)';
  private descriptionColumn = 'td:nth-child(4)';

  async getTableRow(rowIndex: number) {
    const row = this.page.locator(this.tableRows).nth(rowIndex);
    return {
      name: await row.locator(this.nameColumn).innerText(),
      spiders: await row.locator(this.spidersColumn).innerText(),
      description: await row.locator(this.descriptionColumn).innerText(),
    } as Project;
  }
}

