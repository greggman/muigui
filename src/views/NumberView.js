import { createElem } from '../libs/elem.js';
import { identity } from '../libs/conversions.js';
import { stepify } from '../libs/utils.js';
import View from './View.js';

export default class NumberView extends View {
  constructor(setter, converters = identity) {
    super(createElem('input', {
      type: 'number',
      onInput: () => {
        const [valid, v] = this._from(this.domElement.value);
        if (valid) {
          this._skipUpdateTextElem = true;
          setter.setValue(v);
        }
      },
      onChange: () => {
        const [valid, v] = this._from(this.domElement.value);
        if (valid) {
          this._skipUpdateTextElem = true;
          setter.setFinalValue(v);
        }
      },
    }));
    const {to, from} = converters;
    this._to = to;
    this._from = from;
    this._step = 0.01;
  }
  updateDisplay(v) {
    if (!this._skipUpdateTextElem) {
      this.domElement.value = stepify(v, this._to, this._step);
    }
    this._skipUpdateTextElem = false;
  }
  step(step) {
    this._step = step;
    return this;
  }
}
