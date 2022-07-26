import { createElem } from '../libs/elem.js';
import { identity } from '../libs/conversions.js';
import { stepify } from '../libs/utils.js';
import EditView from './EditView.js';

export default class RangeView extends EditView {
  #to;
  #from;
  #step;
  #skipUpdate;

  constructor(setter, converters = identity) {
    super(createElem('input', {
      type: 'range',
      onInput: () => {
        this.#skipUpdate = true;
        const [valid, v] = this.#from(this.domElement.value);
        if (valid) {
          setter.setValue(v);
        }
      },
      onChange: () => {
        this.#skipUpdate = true;
        const [valid, v] = this.#from(this.domElement.value);
        if (valid) {
          setter.setFinalValue(v);
        }
      },
    }));
    const {to, from} = converters;
    this.#to = to;
    this.#from = from;
  }
  updateDisplay(v) {
    if (!this.#skipUpdate) {
      this.domElement.value = stepify(v, this.#to, this.#step);
    }
    this.#skipUpdate = false;
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
    this.#step = step;
    return this;
  }
}