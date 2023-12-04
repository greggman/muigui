import { createElem } from '../libs/elem.js';
import { strToNumber } from '../libs/conversions.js';
import { createWheelHelper } from '../libs/wheel.js';
import { clamp, copyExistingProperties, stepify } from '../libs/utils.js';
import EditView from './EditView.js';

export default class NumberView extends EditView {
  #to;
  #from;
  #step;
  #skipUpdate;
  #options = {
    step: 0.01,
    converters: strToNumber,
    min: Number.NEGATIVE_INFINITY,
    max: Number.POSITIVE_INFINITY,
  };

  constructor(setter, options) {
    const setValue = setter.setValue.bind(setter);
    const setFinalValue = setter.setFinalValue.bind(setter);
    const wheelHelper = createWheelHelper();
    super(createElem('input', {
      type: 'number',
      onInput: () => {
        this.#handleInput(setValue, true);
      },
      onChange: () => {
        this.#handleInput(setFinalValue, false);
      },
      onWheel: e => {
        e.preventDefault();
        const {min, max, step} = this.#options;
        const delta = wheelHelper(e, step);
        const v = parseFloat(this.domElement.value);
        const newV = clamp(stepify(v + delta, v => v, step), min, max);
        const [valid, outV] = this.#from(newV);
        if (valid) {
          setter.setValue(outV);
        }
      },
    }));
    this.setOptions(options);
  }
  #handleInput(setFn, skipUpdate) {
    const v = parseFloat(this.domElement.value);
    const [valid, newV] = this.#from(v);
    let inRange;
    if (valid && !Number.isNaN(v)) {
      const {min, max} = this.#options;
      inRange = newV >= min && newV <= max;
      this.#skipUpdate = skipUpdate;
      setFn(clamp(newV, min, max));
    }
    this.domElement.classList.toggle('muigui-invalid-value', !valid || !inRange);
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
      converters: {to, from},
    } = this.#options;
    this.#to = to;
    this.#from = from;
    this.#step = step;
    return this;
  }
}
