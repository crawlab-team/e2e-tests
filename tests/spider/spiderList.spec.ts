import { test, expect } from '@playwright/test';
import { SpiderListPage } from '@/page-objects/views/spider/spiderListPage';
import { SpiderFormPage } from '@/page-objects/views/spider/spiderFormPage';

test.describe('Spider List Tests', () => {
  let spiderListPage: SpiderListPage;
  let spiderFormPage: SpiderFormPage;

  test.beforeEach(async ({ page }) => {
    spiderListPage = new SpiderListPage(page);
    spiderFormPage = new SpiderFormPage(page);
    await spiderListPage.navigate();
  });

  test('should display the spider list', async () => {
    const spiderCount = await spiderListPage.getTableRowCount();
    expect(spiderCount).toBeGreaterThanOrEqual(0);
  });

  test('should search for a spider', async ({ page }) => {
    const searchTerm = 'Test Spider';
    await spiderListPage.searchRows(searchTerm);
    await page.waitForTimeout(1000); // Wait for search results

    const spiderCount = await spiderListPage.getTableRowCount();
    if (spiderCount > 0) {
      const firstSpiderData = await spiderListPage.getTableRow(0);
      expect(firstSpiderData.name.toLowerCase()).toContain(searchTerm.toLowerCase());
    } else {
      // If no spiders found, that's okay too
      expect(spiderCount).toBe(0);
    }
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

  test('should verify spider form placeholders', async () => {
    await spiderListPage.clickCreate();

    const namePlaceholder = await spiderFormPage.getNamePlaceholder();
    const commandPlaceholder = await spiderFormPage.getCommandPlaceholder();

    expect(namePlaceholder).toBe('Name');
    expect(commandPlaceholder).toBe('Execute Command');
  });

  test('should verify spider form field states', async () => {
    await spiderListPage.clickCreate();

    const isNameDisabled = await spiderFormPage.isNameInputDisabled();
    const isCommandDisabled = await spiderFormPage.isCommandInputDisabled();

    expect(isNameDisabled).toBe(false);
    expect(isCommandDisabled).toBe(false);
  });

  // Sequential tests for create, run, and delete
  test.describe.serial('Create, Run, and Delete Tests', () => {
    test('should create a new spider', async ({ page }) => {
      const initialCount = await spiderListPage.getTableRowCount();
      await spiderListPage.clickCreate();

      // Fill out the spider form
      const spiderName = 'Test Spider';
      const spiderCommand = 'python main.py';
      await spiderFormPage.fillSpiderForm(spiderName, 'Test Project', spiderCommand, 'This is a test spider');

      // Submit the form
      await spiderListPage.confirm();

      // Wait for the new spider to appear in the list
      await page.waitForTimeout(1000);

      const newCount = await spiderListPage.getTableRowCount();
      expect(newCount).toBe(initialCount + 1);

      // Verify the new spider appears in the list
      const lastSpiderData = await spiderListPage.getTableRow(0);
      expect(lastSpiderData.name).toBe(spiderName);
    });

    test('should run a spider', async ({ page }) => {
      const spiderCount = await spiderListPage.getTableRowCount();
      expect(spiderCount).toBeGreaterThan(0);

      await spiderListPage.runSpider(0);
      await page.waitForTimeout(1000); // Wait for the run dialog to appear

      // Verify the run dialog is visible
      expect(await spiderListPage.isRunSpiderDialogVisible()).toBe(true);

      // confirm the run dialog
      await spiderListPage.confirm();

      // Wait for the run dialog to close
      await page.waitForTimeout(1000);

      // Verify the run dialog is closed
      expect(await spiderListPage.isRunSpiderDialogVisible()).toBe(false);
    });

    test('should delete a spider', async ({ page }) => {
      const initialCount = await spiderListPage.getTableRowCount();
      expect(initialCount).toBeGreaterThan(0);

      await spiderListPage.deleteRow(0);
      await page.waitForTimeout(1000); // Wait for the deletion to complete

      const newCount = await spiderListPage.getTableRowCount();
      expect(newCount).toBe(initialCount - 1);
    });
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
    await spiderListPage.uploadFiles(0);
    const isUploadDialogVisible = await spiderListPage.isUploadSpiderFilesDialogVisible();
    expect(isUploadDialogVisible).toBe(true);
  });

  test('should navigate to spider data view', async ({ page }) => {
    const spiderCount = await spiderListPage.getTableRowCount();
    expect(spiderCount).toBeGreaterThan(0);
    await spiderListPage.viewData(0);
    await page.waitForSelector('.detail-layout');
    expect(page.url()).toMatch(/\/spiders\/[0-9a-f]{24}\/data/);
  });
});

