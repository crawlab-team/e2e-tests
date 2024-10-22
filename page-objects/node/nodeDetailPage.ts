import { NodeListPage } from '@/page-objects/node/nodeListPage';
import DetailLayoutPage from '@/page-objects/layout/detailLayoutPage';

export class NodeDetailPage extends DetailLayoutPage<NodeListPage> {
  private nameField = '.form-item[data-test="name"] input';
  private typeSelector = '.form-item[data-test="type"] .el-tag';
  private enabledSwitch = '.form-item[data-test="enabled"] .el-switch__input';
  private maxRunnersField = '.form-item[data-test="max_runners"] input';
  private descriptionField = '.form-item[data-test="description"] textarea';
  private currentMetricsSelector = '.current-metrics';
  private monitoringTabSelector = '.nav-tabs [data-test="monitoring"]';

  getListPage(): NodeListPage {
    return new NodeListPage(this.page);
  }

  async isMonitoringTabDisabled() {
    const monitoringTab = this.page.locator(this.monitoringTabSelector);
    if (!monitoringTab) return null;
    return await monitoringTab.getAttribute('class').then(cls => cls?.includes('is-disabled'));
  }

  async getNodeName() {
    return this.page.inputValue(this.nameField);
  }

  async getNodeType() {
    return this.page.locator(this.typeSelector)?.textContent();
  }

  async isNodeEnabled() {
    const ariaChecked = await this.page.locator(this.enabledSwitch)?.getAttribute('aria-checked');
    return ariaChecked === 'true';
  }

  async getNodeMaxRunners() {
    return this.page.inputValue(this.maxRunnersField);
  }

  async getNodeDescription() {
    return this.page.inputValue(this.descriptionField);
  }

  async getCurrentMetrics() {
    return this.page.locator(this.currentMetricsSelector)?.textContent();
  }
}
