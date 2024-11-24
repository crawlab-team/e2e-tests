export class TestDependencyManager {
  private static instance: TestDependencyManager;
  private statusMap: Map<string, boolean> = new Map();
  private dependencyGraph: Map<string, string[]> = new Map();
  private errorMessages: Map<string, string> = new Map();

  private constructor() {
  }

  static getInstance(): TestDependencyManager {
    if (!TestDependencyManager.instance) {
      TestDependencyManager.instance = new TestDependencyManager();
    }
    return TestDependencyManager.instance;
  }

  registerTest(testId: string, dependencies: string[] = []) {
    this.dependencyGraph.set(testId, dependencies);
    this.statusMap.set(testId, false);
  }

  setTestStatus(testId: string, passed: boolean, errorMessage?: string) {
    this.statusMap.set(testId, passed);
    if (!passed && errorMessage) {
      this.errorMessages.set(testId, errorMessage);
    }
  }

  canRunTest(testId: string): boolean {
    const dependencies = this.dependencyGraph.get(testId) || [];
    return dependencies.every(depId => this.statusMap.get(depId));
  }

  getDependencyFailureReason(testId: string): string {
    const dependencies = this.dependencyGraph.get(testId) || [];
    const failedDeps = dependencies.filter(depId => !this.statusMap.get(depId));
    return failedDeps
      .map(depId => `${depId}: ${this.errorMessages.get(depId)}`)
      .join(', ');
  }
}