import { createElem } from '../libs/elem.js';
import { identity } from '../libs/conversions.js';
import { stepify } from '../libs/utils.js';
import View from './View.js';

export default class RangeView extends View {
  constructor(setter, converters = identity) {
    super(createElem('input', {
      type: 'range',
      onInput: () => {
        this._skipUpdateRangeElem = true;
        const [valid, v] = this._to(this.domElement.value);
        if (valid) {
          setter.setValue(v);
        }
      },
      onChange: () => {
        this._skipUpdateRangeElem = true;
        const [valid, v] = this._to(this.domElement.value);
        if (valid) {
          setter.setFinalValue(v);
        }
      },
    }));
    const {to, from} = converters;
    this._to = to;
    this._from = from;
  }
  updateDisplay(v) {
    if (!this._skipUpdateRangeElem) {
      this.domElement.value = stepify(v, this._from, this._step);
    }
    this._skipUpdateRangeElem = false;
  }
  min(min) {
    this.domElement.min = min;
    return this;
  }
  max(max) {
    this.domElement.max = max;
    return this;
  }
  step(step) {
    this.domElement.step = step;
    this._step = step;
    return this;
  }
}