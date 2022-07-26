import { createElem } from '../libs/elem.js';
import { identity } from '../libs/conversions.js';
import EditView from './EditView.js';

export default class TextView extends EditView {
  #to;
  #from;
  #skipUpdate;

  constructor(setter, converters = identity) {
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
    const {to, from} = converters;
    this.#to = to;
    this.#from = from;
  }
  updateDisplay(v) {
    if (!this.#skipUpdate) {
      this.domElement.value = this.#to(v);
      this.domElement.style.color = '';
    }
    this.#skipUpdate = false;
  }
}
