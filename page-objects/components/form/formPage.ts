import BaseLayoutPage from '@/page-objects/layout/baseLayoutPage';

export abstract class FormPage<T> extends BaseLayoutPage {
  abstract fillForm(data: T): Promise<void>;
}