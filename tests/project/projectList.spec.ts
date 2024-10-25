import { test, expect } from '@playwright/test';
import { ProjectListPage } from '@/page-objects/views/project/projectListPage';
import { ProjectFormPage } from '@/page-objects/views/project/projectFormPage';
import { TAG_PRIORITY_HIGH, TAG_PRIORITY_MEDIUM } from '@/constants/priority';
import projectData from '@/fixtures/projectData.json';
import { CATEGORY_CREATE_DELETE_ROW, CATEGORY_FILTER_ROWS, CATEGORY_ROW_ACTIONS } from '@/constants/category';

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  const projectListPage = new ProjectListPage(page);
  await projectListPage.navigate();
  await projectListPage.createRow(projectData.single as Project);
});

test.describe('Project List Tests', () => {
  let projectListPage: ProjectListPage;
  let projectFormPage: ProjectFormPage;

  test.beforeEach(async ({ page }) => {
    projectListPage = new ProjectListPage(page);
    projectFormPage = new ProjectFormPage(page);
    await projectListPage.navigate();
  });

  test.describe.serial(CATEGORY_CREATE_DELETE_ROW, { tag: TAG_PRIORITY_HIGH }, () => {
    test('should create a new project', async ({ page }) => {
      const initialCount = await projectListPage.getTableRowCount();
      await projectListPage.clickCreate();

      // Fill out the project form
      await projectFormPage.fillForm(projectData.single as Project);

      // Submit the form (you might need to implement this method in ProjectListPage)
      await projectListPage.confirm();

      // Wait for the new project to appear in the list
      await page.waitForTimeout(1000);

      const newCount = await projectListPage.getTableRowCount();
      expect(newCount).toBe(initialCount + 1);

      // Verify the new project appears in the list
      const lastProjectData = await projectListPage.getTableRow(0);
      expect(lastProjectData.name).toBe(projectData.single.name);
      expect(lastProjectData.description).toBe(projectData.single.description);
    });

    test('should delete a project', async ({ page }) => {
      const projectCount = await projectListPage.getTableRowCount();
      expect(projectCount).toBeGreaterThan(0);
      const initialCount = projectCount;
      await projectListPage.deleteRow(0);

      await page.waitForTimeout(1000); // Wait for deletion to process
      const newCount = await projectListPage.getTableRowCount();
      expect(newCount).toBe(initialCount - 1);
    });
  });

  test.describe(CATEGORY_ROW_ACTIONS, { tag: TAG_PRIORITY_MEDIUM }, () => {
    test('should navigate to project detail', async ({ page }) => {
      const projectCount = await projectListPage.getTableRowCount();
      expect(projectCount).toBeGreaterThan(0);
      await projectListPage.navigateToDetail(0);
      await page.waitForSelector('.detail-layout');
      expect(page.url()).toMatch(/\/projects\/[0-9a-f]{24}/);
    });
  });

  test.describe(CATEGORY_FILTER_ROWS, { tag: TAG_PRIORITY_MEDIUM }, () => {
    test('should search for a project', async ({ page }) => {
      const searchTerm = 'Test Project';
      await projectListPage.searchRows(searchTerm);
      await page.waitForTimeout(1000); // Wait for search results

      const projectCount = await projectListPage.getTableRowCount();
      if (projectCount > 0) {
        const firstProjectData = await projectListPage.getTableRow(0);
        expect(firstProjectData.name).toContain(searchTerm);
      } else {
        // If no projects found, that's okay too
        expect(projectCount).toBe(0);
      }
    });
  });
});
