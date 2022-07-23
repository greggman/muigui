import { createElem } from '../libs/elem.js';
import View from './View.js';

export default class GridView extends View {
  constructor(cols) {
    super(createElem('div', {
      className: 'muigui-grid',
    }));
    this.cols(cols);
  }
  cols(cols) {
    this.domElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  }
}