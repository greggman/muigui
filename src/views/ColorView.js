import { createElem } from '../libs/elem.js';
import { identity } from '../libs/conversions.js';
import View from './View.js';

export default class ColorView extends View {
  constructor(setter, converters = identity) {
    const colorElem = createElem('input', {
      type: 'color',
      onInput: () => {
        const [valid, newV] = this._to(colorElem.value);
        if (valid) {
          this._skipUpdateTextElem = true;
          setter.setValue(newV);
        }
      },
      onChange: () => {
        const [valid, newV] = this._to(colorElem.value);
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
      this._colorElem.value = this._from(v);
    }
    this._skipUpdateTextElem = false;
  }
}
