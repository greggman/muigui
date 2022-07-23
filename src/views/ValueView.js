import { createElem } from '../libs/elem.js';
import View from './View.js';

export default class ValueView extends View {
  constructor(className = '') {
    super(createElem('div', {className: 'muigui-value'}));
    if (className) {
      this.domElement.classList.add(className);
    }
  }
}