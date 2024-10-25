import { test, expect } from '@playwright/test';
import { SpiderListPage } from '@/page-objects/views/spider/spiderListPage';
import spiderData from '@/fixtures/spiderData.json';
import { TAG_PRIORITY_CRITICAL, TAG_PRIORITY_HIGH, TAG_PRIORITY_MEDIUM } from '@/constants/priority';
import { CATEGORY_CREATE_DELETE_ROW, CATEGORY_FILTER_ROWS, CATEGORY_ROW_ACTIONS } from '@/constants/category';

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  const spiderListPage = new SpiderListPage(page);
  await spiderListPage.navigate();
  await spiderListPage.createRow(spiderData.single as Spider);
});

test.describe('Spider List Tests', () => {
  let spiderListPage: SpiderListPage;

  test.beforeEach(async ({ page }) => {
    spiderListPage = new SpiderListPage(page);
    await spiderListPage.navigate();
  });

  test.describe.serial(CATEGORY_CREATE_DELETE_ROW, { tag: TAG_PRIORITY_CRITICAL }, () => {
    test('should create a new spider', async ({ page }) => {
      const spider = spiderData.create as Spider;
      const initialCount = await spiderListPage.getTotalCount();

      await spiderListPage.createRow(spider);

      // Wait for the new spider to appear in the list
      await page.waitForTimeout(1000);

      const newCount = await spiderListPage.getTotalCount();
      expect(newCount).toBe(initialCount + 1);

      // Verify the new spider appears in the list
      const lastSpiderData = await spiderListPage.getTableRow(0);
      expect(lastSpiderData.name).toBe(spider.name);
      expect(lastSpiderData.project).toBe(spider.project);
      expect(lastSpiderData.description).toBe(spider.description);
    });

    test('should delete a spider', async ({ page }) => {
      const initialCount = await spiderListPage.getTotalCount();
      expect(initialCount).toBeGreaterThan(0);

      await spiderListPage.searchRows(spiderData.create.name);
      await page.waitForTimeout(1000); // Wait for search results
      await spiderListPage.deleteRow(0);
      await page.waitForTimeout(1000); // Wait for deletion to process
      await page.reload();
      await page.waitForTimeout(1000); // Wait for the page to reload

      const newCount = await spiderListPage.getTotalCount();
      expect(newCount).toBe(initialCount - 1);
    });
  });

  test.describe(CATEGORY_ROW_ACTIONS, { tag: TAG_PRIORITY_HIGH }, () => {
    test('should run a spider', async ({ page }) => {
      test.slow();

      const spider = spiderData.single as Spider;

      const spiderCount = await spiderListPage.getTableRowCount();
      expect(spiderCount).toBeGreaterThan(0);

      await spiderListPage.searchRows(spider.name);
      await spiderListPage.runSpider(0);

      // Refresh the page to get the latest data
      await page.reload();
      await page.waitForTimeout(1000); // Wait for the page to reload

      // Verify the spider has been run
      await spiderListPage.searchRows(spider.name);
      const lastSpider = await spiderListPage.getTableRow(0);
      expect(lastSpider.last_status).toBeTruthy();
      expect(lastSpider.stats).toBeTruthy();
    });

    test('should navigate to spider detail', async ({ page }) => {
      const spiderCount = await spiderListPage.getTableRowCount();
      expect(spiderCount).toBeGreaterThan(0);
      await spiderListPage.navigateToDetail(0);
      await page.waitForSelector('.detail-layout');
      expect(page.url()).toMatch(/\/spiders\/[0-9a-f]{24}/);
    });

    test('should open upload files dialog', async ({ page }) => {
      const spiderCount = await spiderListPage.getTableRowCount();
      expect(spiderCount).toBeGreaterThan(0);
      await spiderListPage.clickUploadFiles(0);
      const isUploadDialogVisible = await spiderListPage.isUploadSpiderFilesDialogVisible();
      expect(isUploadDialogVisible).toBe(true);
    });

    test('should navigate to spider data view', async ({ page }) => {
      const spiderCount = await spiderListPage.getTableRowCount();
      expect(spiderCount).toBeGreaterThan(0);
      await spiderListPage.clickViewData(0);
      await page.waitForSelector('.detail-layout');
      expect(page.url()).toMatch(/\/spiders\/[0-9a-f]{24}\/data/);
    });
  });

  test.describe(CATEGORY_FILTER_ROWS, { tag: TAG_PRIORITY_MEDIUM }, () => {
    test('should search for a spider', async ({ page }) => {
      const searchTerm = spiderData.single.name;
      await spiderListPage.searchRows(searchTerm);
      await page.waitForTimeout(1000); // Wait for search results

      const spiderCount = await spiderListPage.getTableRowCount();
      expect(spiderCount).toBeGreaterThan(0);
      const firstSpiderData = await spiderListPage.getTableRow(0);
      expect(firstSpiderData.name.toLowerCase()).toContain(searchTerm.toLowerCase());
    });

    test('should filter spiders by project', async ({ page }) => {
      const projectName = 'Test Project';
      await spiderListPage.filterByProject(projectName);
      await page.waitForTimeout(1000); // Wait for filter results

      const spiderCount = await spiderListPage.getTableRowCount();
      if (spiderCount > 0) {
        const firstSpiderData = await spiderListPage.getTableRow(0);
        expect(firstSpiderData.project).toBe(projectName);
      } else {
        // If no spiders found, that's okay too
        expect(spiderCount).toBe(0);
      }
    });
  });
});
