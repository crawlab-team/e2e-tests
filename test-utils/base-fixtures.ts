import { test as base } from '@playwright/test';
import { TestDependencyManager } from '@/test-utils/dependency-manager';

type BaseFixtures = {
  dependencyManager: TestDependencyManager;
  testInfo: { id: string };
};

export const test = base.extend<BaseFixtures>({
  dependencyManager: async ({}, use) => {
    const manager = TestDependencyManager.getInstance();
    await use(manager);
  },

  testInfo: [async ({}, use, testInfo) => {
    const info = {
      id: testInfo.title,
    };
    await use(info);
  }, { auto: true }],
});