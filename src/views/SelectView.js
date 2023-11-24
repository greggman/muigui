import { createElem } from '../libs/elem.js';
import EditView from './EditView.js';

export default class SelectView extends EditView {
  #values;

  constructor(setter, keyValues) {
    const values = [];
    super(createElem('select', {
      onChange: () => {
        setter.setFinalValue(this.#values[this.domElement.selectedIndex]);
      },
    }, keyValues.map(([key, value]) => {
      values.push(value);
      return createElem('option', {textContent: key});
    })));
    this.#values = values;
  }
  updateDisplay(v) {
    const ndx = this.#values.indexOf(v);
    this.domElement.selectedIndex = ndx;
  }
}
