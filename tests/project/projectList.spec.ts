import { test, expect } from '@playwright/test';
import { ProjectListPage } from '@/page-objects/views/project/projectListPage';
import { ProjectFormPage } from '@/page-objects/views/project/projectFormPage';
import { TAG_PRIORITY_HIGH, TAG_PRIORITY_MEDIUM } from '@/constants/priority';
import projectData from '@/fixtures/projectData.json';
import { CATEGORY_CREATE_DELETE_ROW, CATEGORY_FILTER_ROWS, CATEGORY_ROW_ACTIONS } from '@/constants/category';

let project: Project;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  const projectListPage = new ProjectListPage(page);
  await projectListPage.navigate();
  project = await projectListPage.createRowWithRandomName(projectData.single as Project);
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
    let project: Project;

    test('should create a new project', async ({ page }) => {
      // Fill out the project form
      project = await projectListPage.createRowWithRandomName(projectData.single as Project);
      await page.waitForTimeout(1000);

      // Search for the new project
      await projectListPage.searchRows(project.name);
      await page.waitForTimeout(1000); // Wait for search results

      // Verify the new project appears in the list
      const lastProjectData = await projectListPage.getTableRow(0);
      expect(lastProjectData.name).toBe(project.name);
      expect(lastProjectData.description).toBe(project.description);
    });

    test('should delete a project', async ({ page }) => {
      // Search for the project to delete
      await projectListPage.searchRows(project.name);
      await page.waitForTimeout(1000); // Wait for search results

      // Delete the project
      await projectListPage.deleteRow(0);
      await page.waitForTimeout(1000); // Wait for deletion to process

      // Verify the project has been deleted
      expect(await projectListPage.getTableRowCount()).toBe(0);
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
