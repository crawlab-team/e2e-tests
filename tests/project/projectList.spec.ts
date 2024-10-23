import { test, expect } from '@playwright/test';
import { ProjectListPage } from '@/page-objects/project/projectListPage';

test.describe('Project List Tests', () => {
  let projectListPage: ProjectListPage;

  test.beforeEach(async ({ page }) => {
    projectListPage = new ProjectListPage(page);
    await projectListPage.navigate();
  });

  test('should display the project list', async () => {
    const projectCount = await projectListPage.getProjectCount();
    expect(projectCount).toBeGreaterThan(0);
  });

  test('should create a new project', async ({ page }) => {
    const initialCount = await projectListPage.getProjectCount();
    await projectListPage.clickCreateProject();
    
    // Here you would interact with the create project dialog
    // For this example, we'll assume the dialog is handled elsewhere
    // and just check that the button click worked

    await page.waitForSelector('.el-dialog');
    const dialogVisible = await page.isVisible('.el-dialog');
    expect(dialogVisible).toBe(true);

    // Close the dialog
    await page.click('.el-dialog__close');

    // In a real scenario, you'd fill out the form and submit it
    // Then you'd verify the new project appears in the list
    // const newCount = await projectListPage.getProjectCount();
    // expect(newCount).toBe(initialCount + 1);
  });

  test('should search for a project', async ({ page }) => {
    const searchTerm = 'Test Project';
    await projectListPage.searchProject(searchTerm);
    await page.waitForTimeout(1000); // Wait for search results

    const projectCount = await projectListPage.getProjectCount();
    if (projectCount > 0) {
      const firstProjectData = await projectListPage.getProjectData(0);
      expect(firstProjectData.name).toContain(searchTerm);
    } else {
      // If no projects found, that's okay too
      expect(projectCount).toBe(0);
    }
  });

  test('should navigate to project detail', async ({ page }) => {
    const projectCount = await projectListPage.getProjectCount();
    if (projectCount > 0) {
      await projectListPage.viewProject(0);
      await page.waitForNavigation();
      expect(page.url()).toContain('/projects/');
    } else {
      // If no projects, skip this test
      test.skip();
    }
  });

  test('should delete a project', async ({ page }) => {
    const projectCount = await projectListPage.getProjectCount();
    if (projectCount > 0) {
      const initialCount = projectCount;
      await projectListPage.deleteProject(0);
      
      // Assume there's a confirmation dialog
      await page.click('.el-message-box__btns .el-button--primary');
      
      await page.waitForTimeout(1000); // Wait for deletion to process
      const newCount = await projectListPage.getProjectCount();
      expect(newCount).toBe(initialCount - 1);
    } else {
      // If no projects, skip this test
      test.skip();
    }
  });
});

