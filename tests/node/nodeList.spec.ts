import { test, expect } from '@playwright/test';
import { NodeListPage } from '@/page-objects/node/nodeListPage';

test.describe('Node List Tests', () => {
  let nodeListPage: NodeListPage;

  test.beforeEach(async ({ page }) => {
    nodeListPage = new NodeListPage(page);

    // Navigate to the Node List page
    await nodeListPage.navigate();
  });

  test('should display the node list', async () => {
    const nodeCount = await nodeListPage.getNodeCount();
    expect(nodeCount).toBeGreaterThan(0);
  });

  test('should filter nodes by type', async ({ page }) => {
    await nodeListPage.filterByNodeType('true');
    await page.waitForTimeout(1000); // Add a 1-second wait
    const nodeCount = await nodeListPage.getNodeCount();
    expect(nodeCount).toBeGreaterThan(0);

    const firstNodeData = await nodeListPage.getTableRow(0);
    expect(firstNodeData.type).toContain('Master' || '主节点');
  });

  test('should filter nodes by status', async ({ page }) => {
    await nodeListPage.filterByNodeStatus('on');
    await page.waitForTimeout(1000); // Add a 1-second wait
    const nodeCount = await nodeListPage.getNodeCount();
    expect(nodeCount).toBeGreaterThan(0);

    const firstNodeData = await nodeListPage.getTableRow(0);
    expect(firstNodeData.status).toBe('Online' || '在线');
  });

  test('should search for a node by name', async ({ page }) => {
    const { name } = await nodeListPage.getTableRow(0);
    const searchTerm = name;
    await nodeListPage.searchRows(searchTerm);
    await page.waitForTimeout(1000); // Add a 1-second wait

    const nodeCount = await nodeListPage.getNodeCount();
    expect(nodeCount).toBe(1);

    const firstNodeData = await nodeListPage.getTableRow(0);
    expect(firstNodeData.name).toContain(searchTerm);
  });

  test('should search for a non-existent node', async ({ page }) => {
    const searchTerm = 'Non-Existent Node';
    await nodeListPage.searchRows(searchTerm);
    await page.waitForTimeout(1000); // Add a 1-second wait

    const nodeCount = await nodeListPage.getNodeCount();
    expect(nodeCount).toBe(0);
  });

});
