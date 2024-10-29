import { expect } from '@playwright/test';
import BaseLayoutPage from '@/page-objects/layout/baseLayoutPage';

export class FileUploadPage extends BaseLayoutPage {
  // Selectors
  private readonly folderModeRadio = '.file-upload .el-radio-group .dir';
  private readonly filesModeRadio = '.file-upload .el-radio-group .files';
  private readonly fileUploadDropzone = '.el-upload';
  private readonly hiddenFolderInput = 'input[type="file"][webkitdirectory]';
  private readonly uploadedFilesTree = '.file-upload-tree .el-tree';

  // Actions
  async selectMode(mode: 'folder' | 'files') {
    const selector = mode === 'folder' ? this.folderModeRadio : this.filesModeRadio;
    await this.page.click(selector);
  }

  async uploadFiles(files: string[]) {
    await this.page.setInputFiles(this.fileUploadDropzone + ' input[type="file"]', files);
  }

  async uploadFolder(folderPath: string) {
    await this.page.setInputFiles(this.hiddenFolderInput, folderPath);
  }

  // Assertions
  async expectModeToBeSelected(mode: 'folder' | 'files') {
    const selector = mode === 'folder' ? this.folderModeRadio : this.filesModeRadio;
    await expect(this.page.locator(selector + ' input')).toBeChecked();
  }

  async expectUploadedFilesToContain(fileName: string) {
    await this.page.locator(this.uploadedFilesTree).getByText(fileName).waitFor();
  }
}