import { test, expect } from '@playwright/test';
import { NodeListPage } from '@/page-objects/views/node/nodeListPage';
import { TAG_PRIORITY_HIGH, TAG_PRIORITY_MEDIUM } from '@/constants/priority';
import { CATEGORY_FILTER_ROWS, CATEGORY_ROW_ACTIONS } from '@/constants/category';

test.describe('Node List Tests', () => {
  let nodeListPage: NodeListPage;

  test.beforeEach(async ({ page }) => {
    nodeListPage = new NodeListPage(page);

    // Navigate to the Node List page
    await nodeListPage.navigate();
  });

  test.describe(CATEGORY_ROW_ACTIONS, { tag: TAG_PRIORITY_HIGH }, () => {
    test('should navigate to the node details page', async ({ page }) => {
      await nodeListPage.navigateToDetail(0);
      expect(page.url()).toMatch(/\/nodes\/[0-9a-f]{24}/);
    });
  });

  test.describe(CATEGORY_FILTER_ROWS, { tag: TAG_PRIORITY_MEDIUM }, () => {
    test('should filter nodes by type', async () => {
      // Update the test to filter by type 'true' (Master)
      await nodeListPage.filterByNodeType('true');
      expect(await nodeListPage.getNodeCount()).toBeGreaterThan(0);
      const masterNodeData = await nodeListPage.getTableRow(0);
      expect(masterNodeData.status).toBe('Master' || '主节点');

      // Update the test to filter by type 'false' (Worker)
      await nodeListPage.filterByNodeType('false');
      if (await nodeListPage.getNodeCount() > 0) {
        const workerNodeData = await nodeListPage.getTableRow(0);
        expect(workerNodeData.status).toBe('Worker' || '工作节点');
      }
    });

    test('should filter nodes by status', async () => {
      await nodeListPage.filterByNodeStatus('on');
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

    test('should search for a non-existent node', async () => {
      const searchTerm = 'Non-Existent Node';
      await nodeListPage.searchRows(searchTerm);

      const nodeCount = await nodeListPage.getNodeCount();
      expect(nodeCount).toBe(0);
    });
  });
});
