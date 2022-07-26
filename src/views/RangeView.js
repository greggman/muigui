import { createElem } from '../libs/elem.js';
import { identity } from '../libs/conversions.js';
import { copyExistingProperties, stepify } from '../libs/utils.js';
import EditView from './EditView.js';

export default class RangeView extends EditView {
  #to;
  #from;
  #step;
  #skipUpdate;
  #options = {
    step: 0.01,
    min: 0,
    max: 1,
    converters: identity,
  };

  constructor(setter, options) {
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
    this.setOptions(options);
  }
  updateDisplay(v) {
    if (!this.#skipUpdate) {
      this.domElement.value = stepify(v, this.#to, this.#step);
    }
    this.#skipUpdate = false;
  }
  setOptions(options) {
    copyExistingProperties(this.#options, options);
    const {
      step,
      min,
      max,
      converters: {to, from},
    } = this.#options;
    this.#to = to;
    this.#from = from;
    this.#step = step;
    this.domElement.min = min;
    this.domElement.max = max;
    return this;
  }
}