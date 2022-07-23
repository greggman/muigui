import { createElem } from '../libs/elem.js';
import { identity } from '../libs/conversions.js';
import { stepify } from '../libs/utils.js';
import EditView from './EditView.js';

export default class RangeView extends EditView {
  constructor(setter, converters = identity) {
    super(createElem('input', {
      type: 'range',
      onInput: () => {
        this._skipUpdateRangeElem = true;
        const [valid, v] = this._from(this.domElement.value);
        if (valid) {
          setter.setValue(v);
        }
      },
      onChange: () => {
        this._skipUpdateRangeElem = true;
        const [valid, v] = this._from(this.domElement.value);
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
      this.domElement.value = stepify(v, this._to, this._step);
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