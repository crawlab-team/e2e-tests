import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { TestDependencyManager } from '@/test-utils/dependency-manager';

export default class DependencyReporter implements Reporter {
  private manager = TestDependencyManager.getInstance();
  private skippedTests: Map<string, string> = new Map();

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'skipped') {
      this.skippedTests.set(
        test.title,
        this.manager.getDependencyFailureReason(test.title),
      );
    }
  }

  onEnd() {
    console.log('\nDependency Failure Report:');
    this.skippedTests.forEach((reason, test) => {
      console.log(`${test}: Skipped due to: ${reason}`);
    });
  }
}