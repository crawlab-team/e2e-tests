import { FormPage } from '@/page-objects/components/form/formPage';

export class NodeFormPage extends FormPage<Node> {
  protected path = '/#/nodes';

  async fillForm(_: Node) {
    console.warn('No need to fill form for Node');
  }
}