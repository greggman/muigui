import { createElem } from '../libs/elem.js';
import { strToNumber } from '../libs/conversions.js';
import { copyExistingProperties, stepify } from '../libs/utils.js';
import EditView from './EditView.js';

export default class NumberView extends EditView {
  #to;
  #from;
  #step;
  #skipUpdate;
  #options = {
    step: 0.01,
    converters: strToNumber,
  };

  constructor(setter, options) {
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
    this.setOptions(options);
  }
  updateDisplay(v) {
    if (!this.#skipUpdate) {
      this.domElement.value = stepify(v, this.#to, this.#step);
    }
    this.#skipUpdate = false;
  }
  setOptions(options) {
    // FIX: add min/max
    copyExistingProperties(this.#options, options);
    const {
      step,
      converters: {to, from},
    } = this.#options;
    this.#to = to;
    this.#from = from;
    this.#step = step;
    return this;
  }
}
