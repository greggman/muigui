import { createElem } from '../libs/elem.js';
import { identity } from '../libs/conversions.js';
import { stepify } from '../libs/utils.js';
import EditView from './EditView.js';

export default class NumberView extends EditView {
  #to;
  #from;
  #step;
  #skipUpdate;

  constructor(setter, converters = identity) {
    super(createElem('input', {
      type: 'number',
      onInput: () => {
        const [valid, v] = this.#from(this.domElement.value);
        if (valid) {
          this.#skipUpdate = true;
          setter.setValue(v);
        }
      },
      onChange: () => {
        const [valid, v] = this.#from(this.domElement.value);
        if (valid) {
          this.#skipUpdate = true;
          setter.setFinalValue(v);
        }
      },
    }));
    const {to, from} = converters;
    this.#to = to;
    this.#from = from;
    this.#step = 0.01;
  }
  updateDisplay(v) {
    if (!this.#skipUpdate) {
      this.domElement.value = stepify(v, this.#to, this.#step);
    }
    this.#skipUpdate = false;
  }
  step(step) {
    this.#step = step;
    return this;
  }
}
