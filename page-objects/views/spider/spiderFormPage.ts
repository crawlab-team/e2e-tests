import { FormPage } from '@/page-objects/components/form/formPage';

export class SpiderFormPage extends FormPage<Spider> {
  // Locators
  private nameInput = '[data-test="name"] input';
  private projectSelect = '[data-test="project_id"] .el-select';
  private projectSelectDropdown = '.spider-form-project';
  private cmdInput = '[data-test="cmd"] input';
  private paramInput = '[data-test="param"] input';
  private prioritySelect = '[data-test="priority"] .el-select';
  private modeSelect = '[data-test="mode"] .el-select';
  private colNameInput = '[data-test="col_name"] input';
  private nodeCheckTagGroup = '[data-test="nodes"] .cl-check-tag-group';
  private descriptionTextarea = '[data-test="description"] textarea';

  async fillForm({ name, project, cmd, description }: Spider) {
    await this.setName(name);
    await this.setProject(project);
    await this.setCommand(cmd);
    await this.setDescription(description);
  }

  async setName(name: string) {
    await this.page.fill(this.nameInput, name);
  }

  async setProject(project: string) {
    if (project) {
      await this.selectOptionByText(this.projectSelect, project, this.projectSelectDropdown);
    }
  }

  async setCommand(cmd: string) {
    await this.page.fill(this.cmdInput, cmd);
  }

  async setParam(param: string) {
    await this.page.fill(this.paramInput, param);
  }

  async setPriority(priority: string) {
    await this.selectOption(this.prioritySelect, priority);
  }

  async setMode(mode: string) {
    await this.selectOption(this.modeSelect, mode);
  }

  async setColName(colName: string) {
    await this.page.fill(this.colNameInput, colName);
  }

  async setNodes(nodes: string[]) {
    for (const node of nodes) {
      await this.page.locator(this.nodeCheckTagGroup).getByText(node).first().click({ force: true });
    }
  }

  async setDescription(description: string) {
    await this.page.fill(this.descriptionTextarea, description);
  }

  async getName(): Promise<string> {
    return await this.page.inputValue(this.nameInput);
  }

  async getProject(): Promise<string> {
    return await this.page.inputValue(this.projectSelect);
  }

  async getCommand(): Promise<string> {
    return await this.page.inputValue(this.cmdInput);
  }

  async getParam(): Promise<string> {
    return await this.page.inputValue(this.paramInput);
  }

  async getPriority(): Promise<string> {
    return await this.page.inputValue(this.prioritySelect);
  }

  async getMode(): Promise<string> {
    return await this.page.inputValue(this.modeSelect);
  }

  async getColName(): Promise<string> {
    return await this.page.inputValue(this.colNameInput);
  }

  async getDescription(): Promise<string> {
    return await this.page.inputValue(this.descriptionTextarea);
  }

  async isNameInputDisabled(): Promise<boolean> {
    return await this.page.isDisabled(this.nameInput);
  }

  async isProjectSelectDisabled(): Promise<boolean> {
    return await this.page.isDisabled(this.projectSelect);
  }

  async isCommandInputDisabled(): Promise<boolean> {
    return await this.page.isDisabled(this.cmdInput);
  }

  async isParamInputDisabled(): Promise<boolean> {
    return await this.page.isDisabled(this.paramInput);
  }

  async isPrioritySelectDisabled(): Promise<boolean> {
    return await this.page.isDisabled(this.prioritySelect);
  }

  async isModeSelectDisabled(): Promise<boolean> {
    return await this.page.isDisabled(this.modeSelect);
  }

  async isColNameInputDisabled(): Promise<boolean> {
    return await this.page.isDisabled(this.colNameInput);
  }

  async isDescriptionInputDisabled(): Promise<boolean> {
    return await this.page.isDisabled(this.descriptionTextarea);
  }

  async getNamePlaceholder(): Promise<string | null> {
    return await this.page.getAttribute(this.nameInput, 'placeholder');
  }

  async getCommandPlaceholder(): Promise<string | null> {
    return await this.page.getAttribute(this.cmdInput, 'placeholder');
  }

  async getParamPlaceholder(): Promise<string | null> {
    return await this.page.getAttribute(this.paramInput, 'placeholder');
  }

  async getPriorityPlaceholder(): Promise<string | null> {
    return await this.page.getAttribute(this.prioritySelect, 'placeholder');
  }

  async getColNamePlaceholder(): Promise<string | null> {
    return await this.page.getAttribute(this.colNameInput, 'placeholder');
  }

  async getDescriptionPlaceholder(): Promise<string | null> {
    return await this.page.getAttribute(this.descriptionTextarea, 'placeholder');
  }
}
