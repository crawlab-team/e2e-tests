import ListLayoutPage from '@/page-objects/layout/listLayoutPage';

export class NodeListPage extends ListLayoutPage<Node> {
  protected path = '/#/nodes';

  // Updated Locators
  private nodeTypeFilter = '#filter-select-type .el-select';
  private nodeStatusFilter = '#filter-select-status .el-select';
  private nodeEnabledFilter = '#filter-select-enabled .el-select';

  async filterByNodeType(type: string) {
    await this.selectOption(this.nodeTypeFilter, type);
  }

  async filterByNodeStatus(status: string) {
    await this.selectOption(this.nodeStatusFilter, status);
  }

  async filterByNodeEnabled(enabled: string) {
    await this.selectOption(this.nodeEnabledFilter, enabled);
  }

  private async selectOption(selector: string, value: string) {
    await this.page.click(selector);
    await this.page.click(`.el-select-dropdown [data-test="${value}"]`);
  }

  // Getters
  async getNodeCount(): Promise<number> {
    return await this.page.locator(this.tableRows).count();
  }

  async getTableRow(rowIndex: number) {
    const row = this.page.locator(this.tableRows).nth(rowIndex);
    return {
      name: await row.locator('td:nth-child(2)').innerText(),
      type: await row.locator('td:nth-child(3)').innerText(),
      status: await row.locator('td:nth-child(4)').innerText(),
      enabled: await row.locator('td:nth-child(6)').innerText(),
    } as Node;
  }
}
