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
    const setValue = setter.setValue.bind(setter);
    const setFinalValue = setter.setFinalValue.bind(setter);
    super(createElem('input', {
      type: 'text',
      onInput: () => {
        this.#handleInput(setValue, true);
      },
      onChange: () => {
        this.#handleInput(setFinalValue, false);
      },
    }));
    this.setOptions(options);
  }
  #handleInput(setFn, skipUpdate) {
    const [valid, newV] = this.#from(this.domElement.value);
    if (valid) {
      this.#skipUpdate = skipUpdate;
      setFn(newV);
    }
    this.domElement.style.color = valid ? '' : 'var(--invalid-color)';

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
    return this;
  }
}
