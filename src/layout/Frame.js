import Layout from './Layout.js';

export default class Frame extends Layout {
  static css = 'foo';
  constructor() {
    super('div', 'muigui-frame');
  }
  static get foo() {
    return 'boo';
  }
}
