import { createElem } from '../libs/elem.js';
import { identity } from '../libs/conversions.js';
import EditView from './EditView.js';
import { copyExistingProperties } from '../libs/utils.js';

export default class TextView extends EditView {
  #to;
  #from;
  #skipUpdate;
  #options = {
    converters: identity,
  };

  constructor(setter, options) {
    super(createElem('input', {
      type: 'text',
      onInput: () => {
        const [valid, newV] = this.#from(this.domElement.value);
        if (valid) {
          this.#skipUpdate = true;
          setter.setValue(newV);
        }
        this.domElement.style.color = valid ? '' : 'var(--invalid-color)';
      },
      onChange: () => {
        const [valid, newV] = this.#from(this.domElement.value);
        if (valid) {
          this.#skipUpdate = true;
          setter.setFinalValue(newV);
        }
        this.domElement.style.color = valid ? '' : 'var(--invalid-color)';
      },
    }));
    this.setOptions(options);
  }
  updateDisplay(v) {
    if (!this.#skipUpdate) {
      this.domElement.value = this.#to(v);
      this.domElement.style.color = '';
    }
    this.#skipUpdate = false;
  }
  setOptions(options) {
    copyExistingProperties(this.#options, options);
    const {
      converters: {to, from},
    } = this.#options;
    this.#to = to;
    this.#from = from;
  }
}
