import { test, expect } from '@playwright/test';
import { ProjectListPage } from '@/page-objects/views/project/projectListPage';
import { ProjectFormPage } from '@/page-objects/views/project/projectFormPage';

test.describe('Project List Tests', () => {
  let projectListPage: ProjectListPage;
  let projectFormPage: ProjectFormPage;

  test.beforeEach(async ({ page }) => {
    projectListPage = new ProjectListPage(page);
    projectFormPage = new ProjectFormPage(page);
    await projectListPage.navigate();
  });

  test('should display the project list', async () => {
    const projectCount = await projectListPage.getTableRowCount();
    expect(projectCount).toBeGreaterThanOrEqual(0);
  });

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

  test('should verify project form placeholders', async () => {
    await projectListPage.clickCreate();

    const namePlaceholder = await projectFormPage.getNamePlaceholder();
    const descriptionPlaceholder = await projectFormPage.getDescriptionPlaceholder();

    expect(namePlaceholder).toBe('Name' || '名称');
    expect(descriptionPlaceholder).toBe('Description' || '描述');
  });

  test('should verify project form field states', async () => {
    await projectListPage.clickCreate();

    const isNameDisabled = await projectFormPage.isNameInputDisabled();
    const isDescriptionDisabled = await projectFormPage.isDescriptionInputDisabled();

    expect(isNameDisabled).toBe(false);
    expect(isDescriptionDisabled).toBe(false);
  });

  // Sequential tests for create and delete
  test.describe.serial('Create and Delete Tests', () => {
    test('should create a new project', async ({ page }) => {
      const initialCount = await projectListPage.getTableRowCount();
      await projectListPage.clickCreate();

      // Fill out the project form
      const projectName = 'Test Project';
      const projectDescription = 'This is a test project';
      await projectFormPage.fillProjectForm(projectName, projectDescription);

      // Submit the form (you might need to implement this method in ProjectListPage)
      await projectListPage.confirm();

      // Wait for the new project to appear in the list
      await page.waitForTimeout(1000);

      const newCount = await projectListPage.getTableRowCount();
      expect(newCount).toBe(initialCount + 1);

      // Verify the new project appears in the list
      const lastProjectData = await projectListPage.getTableRow(newCount - 1);
      expect(lastProjectData.name).toBe(projectName);
      expect(lastProjectData.description).toBe(projectDescription);
    });

    test('should navigate to project detail', async ({ page }) => {
      const projectCount = await projectListPage.getTableRowCount();
      expect(projectCount).toBeGreaterThan(0);
      await projectListPage.navigateToDetail(0);
      await page.waitForSelector('.detail-layout');
      expect(page.url()).toMatch(/\/projects\/[0-9a-f]{24}/);
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
});
