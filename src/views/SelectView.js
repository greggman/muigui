import { createElem } from '../libs/elem.js';
import View from './View.js';

export default class SelectView extends View {
  constructor(setter, keyValues) {
    const values = [];
    super(createElem('select', {
      onChange: () => {
        setter.setFinalValue(this._values[this.domElement.selectedIndex]);
      },
    }, keyValues.map(([key, value]) => {
      values.push(value);
      return createElem('option', {textContent: key});
    })));
    this._values = values;
  }
  updateDisplay(v) {
    const ndx = this._values.indexOf(v);
    this.domElement.selectedIndex = ndx;
  }
}
