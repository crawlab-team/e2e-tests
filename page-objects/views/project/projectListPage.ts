import ListLayoutPage from '@/page-objects/layout/listLayoutPage';
import { ProjectFormPage } from '@/page-objects/views/project/projectFormPage';
import { FormPage } from '@/page-objects/components/form/formPage';

export class ProjectListPage extends ListLayoutPage<Project> {
  protected path = '/#/projects';

  getFormPage(): FormPage<Project> {
    return new ProjectFormPage(this.page);
  }

  // Locators
  private nameColumn = 'td:nth-child(2)';
  private spidersColumn = 'td:nth-child(3)';
  private descriptionColumn = 'td:nth-child(4)';

  async createRow(form: Project) {
    await this.clickCreate();
    await this.formPage.fillForm(form);
  }

  async getTableRow(rowIndex: number) {
    const row = this.page.locator(this.tableRows).nth(rowIndex);
    return {
      name: await row.locator(this.nameColumn).innerText(),
      spiders: await row.locator(this.spidersColumn).innerText(),
      description: await row.locator(this.descriptionColumn).innerText(),
    } as Project;
  }
}

