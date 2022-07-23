import { createElem } from '../libs/elem.js';
import { identity } from '../libs/conversions.js';
import EditView from './EditView.js';

export default class ColorView extends EditView {
  constructor(setter, converters = identity) {
    const colorElem = createElem('input', {
      type: 'color',
      onInput: () => {
        const [valid, newV] = this._from(colorElem.value);
        if (valid) {
          this._skipUpdateTextElem = true;
          setter.setValue(newV);
        }
      },
      onChange: () => {
        const [valid, newV] = this._from(colorElem.value);
        if (valid) {
          this._skipUpdateTextElem = true;
          setter.setFinalValue(newV);
        }
      },
    });
    super(createElem('div', {}, [colorElem]));
    const {to, from} = converters;
    this._to = to;
    this._from = from;
    this._colorElem = colorElem;
  }
  updateDisplay(v) {
    if (!this._skipUpdateTextElem) {
      this._colorElem.value = this._to(v);
    }
    this._skipUpdateTextElem = false;
  }
}
