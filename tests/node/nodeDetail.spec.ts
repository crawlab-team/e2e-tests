import { test, expect } from '@playwright/test';
import { NodeDetailPage } from '@/page-objects/views/node/nodeDetailPage';

test.describe('Node Detail Page', () => {
  let nodeDetailPage: NodeDetailPage;

  test.beforeEach(async ({ page }) => {
    nodeDetailPage = new NodeDetailPage(page);
    await nodeDetailPage.navigate();
    await page.waitForTimeout(1000); // Add a 1-second wait
  });

  test('should display node details correctly', async () => {
    const nodeName = await nodeDetailPage.getNodeName();
    expect(nodeName).toBeTruthy();

    const nodeType = await nodeDetailPage.getNodeType();
    expect(nodeType).toBe('Master' || '主节点' || 'Worker' || '工作节点');

    const isNodeEnabled = await nodeDetailPage.isNodeEnabled();
    expect(typeof isNodeEnabled).toBe('boolean');

    const nodeMaxRunners = await nodeDetailPage.getNodeMaxRunners();
    expect(nodeMaxRunners).toBeTruthy();

    const nodeDescription = await nodeDetailPage.getNodeDescription();
    expect(nodeDescription).not.toBeUndefined();
  });

  test('should have correct tabs', async () => {
    const activeTabName = await nodeDetailPage.getActiveTabName();
    expect(activeTabName).toBe('Overview' || '概览');

    await nodeDetailPage.switchToTab('tasks');
    const tasksTabName = await nodeDetailPage.getActiveTabName();
    expect(tasksTabName).toBe('Tasks' || '任务');
  });

  test('should disable monitoring tab for non-pro version', async () => {
    const isPro = await nodeDetailPage.isPro();
    const isMonitoringTabDisabled = await nodeDetailPage.isMonitoringTabDisabled();
    expect(isMonitoringTabDisabled).toBe(!isPro);
  });

  test('should display current metrics for pro version', async () => {
    const isPro = await nodeDetailPage.isPro();
    const currentMetrics = await nodeDetailPage.getCurrentMetrics();
    if (isPro) {
      expect(currentMetrics).toBeTruthy();
    } else {
      expect(currentMetrics).toBeNull();
    }
  });
});

