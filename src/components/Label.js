import View from '../base-components/view.js';
import { createElem } from '../libs/elem.js';

export default class Label extends View {
  constructor(label) {
    super(createElem('div', {
      className: 'muigui-label',
    }));
    this.label(label);
  }
  label(label) {
    this.domElement.textContent = label;
  }
}

