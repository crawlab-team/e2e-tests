import ListLayoutPage from '@/page-objects/layout/listLayoutPage';
import { NodeFormPage } from '@/page-objects/views/node/nodeFormPage';

export class NodeListPage extends ListLayoutPage<Node> {
  protected path = '/#/nodes';

  getFormPage() {
    return new NodeFormPage(this.page);
  }

  // Updated Locators
  private nodeTypeFilter = '#filter-select-type .el-select';
  private nodeStatusFilter = '#filter-select-status .el-select';
  private nodeEnabledFilter = '#filter-select-enabled .el-select';

  async filterByNodeType(type: string, wait = 1000) {
    await this.selectOption(this.nodeTypeFilter, type);
    if (wait) {
      await this.page.waitForTimeout(wait);
    }
  }

  async filterByNodeStatus(status: string, wait = 1000) {
    await this.selectOption(this.nodeStatusFilter, status);
    if (wait) {
      await this.page.waitForTimeout(wait);
    }
  }

  async filterByNodeEnabled(enabled: string, wait = 1000) {
    await this.selectOption(this.nodeEnabledFilter, enabled);
    if (wait) {
      await this.page.waitForTimeout(wait);
    }
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
