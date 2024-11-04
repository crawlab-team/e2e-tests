import { test, expect } from '@playwright/test';
import { TAG_PRIORITY_CRITICAL, TAG_PRIORITY_HIGH, TAG_PRIORITY_MEDIUM } from '@/constants/priority';
import { CATEGORY_CREATE_DELETE_ROW, CATEGORY_FILTER_ROWS, CATEGORY_ROW_ACTIONS } from '@/constants/category';
import spiderData from '@/fixtures/spiderData.json';
import { SpiderListPage } from '@/page-objects/views/spider/spiderListPage';
import { FileUploadPage } from '@/page-objects/components/file/fileUploadPage';
import path from 'path';
import projectData from '@/fixtures/projectData.json';
import { ProjectListPage } from '@/page-objects/views/project/projectListPage';

let spider: Spider;
let project: Project;

test.beforeAll(async ({ browser }) => {
  test.slow();

  const page = await browser.newPage();

  // Create a project to associate with the spider
  const projectListPage = new ProjectListPage(page);
  await projectListPage.navigate();
  project = await projectListPage.createRowWithRandomName(projectData.single as Project);

  // Create a spider
  const spiderListPage = new SpiderListPage(page);
  await spiderListPage.navigate();
  spider = await spiderListPage.createRowWithRandomName({
    ...spiderData.single as Spider,
    project: project.name,
  });

  // Close the browser
  await page.close();
});

test.afterAll(async ({ browser }) => {
  test.slow();

  // Open a new page
  const page = await browser.newPage();

  // Delete the spider
  const spiderListPage = new SpiderListPage(page);
  await spiderListPage.navigate();
  await spiderListPage.searchRows(spider.name);
  if (await spiderListPage.getTableRowCount() > 0) {
    await spiderListPage.deleteRow(0);
  }

  // Delete the project
  const projectListPage = new ProjectListPage(page);
  await projectListPage.navigate();
  await projectListPage.searchRows(project.name);
  if (await projectListPage.getTableRowCount() > 0) {
    await projectListPage.deleteRow(0);
  }

  // Close the browser
  await page.close();
});

test.describe('Spider List Tests', () => {
  let spiderListPage: SpiderListPage;

  test.beforeEach(async ({ page }) => {
    spiderListPage = new SpiderListPage(page);
    await spiderListPage.navigate();
  });

  test.describe.serial(CATEGORY_CREATE_DELETE_ROW, { tag: TAG_PRIORITY_CRITICAL }, () => {
    let spider: Spider;

    test('should create a new spider', async ({ page }) => {
      // Create a new spider
      spider = await spiderListPage.createRowWithRandomName(spiderData.single as Spider);

      // Wait for the new spider to appear in the list
      await page.reload();
      await page.waitForTimeout(1000);

      // Search for the new spider
      await spiderListPage.searchRows(spider.name);
      await page.waitForTimeout(1000); // Wait for search results

      // Verify the new spider appears in the list
      const lastSpiderData = await spiderListPage.getTableRow(0);
      expect(lastSpiderData.name).toBe(spider.name);
      expect(lastSpiderData.project).toBe(spider.project);
      expect(lastSpiderData.description).toBe(spider.description);
    });

    test('should delete a spider', async ({ page }) => {
      // Search for the spider to delete
      await spiderListPage.searchRows(spider.name);
      await page.waitForTimeout(1000); // Wait for search results

      // Delete the spider
      await spiderListPage.deleteRow(0);
      await page.waitForTimeout(1000); // Wait for deletion to process

      // Verify the spider has been deleted
      expect(await spiderListPage.getTableRowCount()).toBe(0);
    });
  });

  test.describe(CATEGORY_ROW_ACTIONS, { tag: TAG_PRIORITY_HIGH }, () => {
    test.beforeEach(async () => {
      await spiderListPage.searchRows(spider.name);
    });

    test('should run a spider', async ({ page }) => {
      test.slow();

      // Run the spider
      await spiderListPage.runSpider(0);

      // Reload the page and verify the spider has been run
      await page.reload();
      await page.waitForTimeout(1000); // Wait for the page to reload
      await spiderListPage.searchRows(spider.name);

      // Verify the spider has been run
      const lastSpider = await spiderListPage.getTableRow(0);
      expect(lastSpider.last_status).toBeTruthy();
      expect(lastSpider.stats).toBeTruthy();
    });

    test('should navigate to spider detail', async ({ page }) => {
      await spiderListPage.navigateToDetail(0);
      expect(page.url()).toMatch(/\/spiders\/[0-9a-f]{24}/);
    });

    test('should navigate to spider tasks view', async ({ page }) => {
      await spiderListPage.clickViewTasks(0);
      expect(page.url()).toMatch(/\/spiders\/[0-9a-f]{24}\/tasks/);
    });

    test('should navigate to spider schedules view', async ({ page }) => {
      await spiderListPage.clickViewSchedules(0);
      expect(page.url()).toMatch(/\/spiders\/[0-9a-f]{24}\/schedules/);
    });

    test('should navigate to spider data view', async ({ page }) => {
      await spiderListPage.clickViewData(0);
      expect(page.url()).toMatch(/\/spiders\/[0-9a-f]{24}\/data/);
    });

    test.describe('Upload Files Dialog', () => {
      test('should open upload files dialog and interact with upload component', async ({ page }) => {
        const fileUploadPage = new FileUploadPage(page);

        // Open the upload dialog
        await spiderListPage.clickUploadFiles(0);
        const isUploadDialogVisible = await spiderListPage.isUploadSpiderFilesDialogVisible();
        expect(isUploadDialogVisible).toBe(true);

        // Test file upload component functionality
        await fileUploadPage.selectMode('folder');
        await fileUploadPage.expectModeToBeSelected('folder');
      });

      test('should upload folders correctly', async ({ page }) => {
        const fileUploadPage = new FileUploadPage(page);

        // Search for the spider
        await spiderListPage.searchRows(spider.name);

        // Open the upload dialog
        await spiderListPage.clickUploadFiles(0);

        // Upload an entire folder
        const testFolder = path.join(__dirname, '../../fixtures/test-files/config');
        await fileUploadPage.selectMode('folder');
        await fileUploadPage.uploadFolder(testFolder);
        // Verify folder contents appear in the tree
        await fileUploadPage.expectUploadedFilesToContain('project.json');
        await fileUploadPage.expectUploadedFilesToContain('config.json');

        // Confirm the upload
        await spiderListPage.confirm();
      });

      test('should upload files correctly', async ({ page }) => {
        const fileUploadPage = new FileUploadPage(page);

        // Search for the spider
        await spiderListPage.searchRows(spider.name);

        // Open the upload dialog
        await spiderListPage.clickUploadFiles(0);

        // Upload individual files
        const testFiles = [
          path.join(__dirname, '../../fixtures/test-files/main.py'),
          path.join(__dirname, '../../fixtures/test-files/requirements.txt'),
        ];
        await fileUploadPage.selectMode('files');
        await fileUploadPage.uploadFiles(testFiles);

        // Verify files appear in the tree
        await fileUploadPage.expectUploadedFilesToContain('main.py');
        await fileUploadPage.expectUploadedFilesToContain('requirements.txt');
      });
    });
  });

  test.describe(CATEGORY_FILTER_ROWS, { tag: TAG_PRIORITY_MEDIUM }, () => {
    test('should search for a spider', async () => {
      await spiderListPage.searchRows(spider.name);

      // Verify the spider appears in the list
      const spiderCount = await spiderListPage.getTableRowCount();
      expect(spiderCount).toBeGreaterThan(0);
      const firstSpiderData = await spiderListPage.getTableRow(0);
      expect(firstSpiderData.name).toContain(spider.name);
    });

    test('should filter spiders by project', async () => {
      await spiderListPage.filterByProject(spider.project);

      // Verify the spiders are filtered by project
      const spiderCount = await spiderListPage.getTableRowCount();
      expect(spiderCount).toBeGreaterThan(0);
      const firstSpiderData = await spiderListPage.getTableRow(0);
      expect(firstSpiderData.project).toBe(spider.project);
    });
  });
});
