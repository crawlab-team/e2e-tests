import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from '@/page-objects/views/login/loginPage';
import userData from './fixtures/userData.json';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const loginPage = new LoginPage(page);

  await page.goto(baseURL + '/#/login', { waitUntil: 'domcontentloaded' });
  await loginPage.login(userData.adminUser.username, userData.adminUser.password);
  
  await page.context().storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;
