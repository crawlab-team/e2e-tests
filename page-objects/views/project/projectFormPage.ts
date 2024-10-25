import BaseLayoutPage from '@/page-objects/layout/baseLayoutPage';
import { FormPage } from '@/page-objects/components/form/formPage';

export class ProjectFormPage extends FormPage<Project> {
  // Locators
  private nameInput = '[data-test="name"] input';
  private descriptionTextarea = '[data-test="description"] textarea';

  async fillForm({name, description}: Project) {
    await this.setName(name);
    await this.setDescription(description);
  }

  async setName(name: string) {
    await this.page.fill(this.nameInput, name);
  }

  async setDescription(description: string) {
    await this.page.fill(this.descriptionTextarea, description);
  }

  async getName(): Promise<string> {
    return await this.page.inputValue(this.nameInput);
  }

  async getDescription(): Promise<string> {
    return await this.page.inputValue(this.descriptionTextarea);
  }

  async isNameInputDisabled(): Promise<boolean> {
    const nameInput = this.page.locator(this.nameInput);
    return await nameInput.isDisabled();
  }

  async isDescriptionInputDisabled(): Promise<boolean> {
    const descriptionTextarea = this.page.locator(this.descriptionTextarea);
    return await descriptionTextarea.isDisabled();
  }

  async getNamePlaceholder(): Promise<string | null> {
    const nameInput = this.page.locator(this.nameInput);
    return await nameInput.getAttribute('placeholder');
  }

  async getDescriptionPlaceholder(): Promise<string | null> {
    const descriptionTextarea = this.page.locator(this.descriptionTextarea);
    return await descriptionTextarea.getAttribute('placeholder');
  }
}

