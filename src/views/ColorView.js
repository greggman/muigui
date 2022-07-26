import { createElem } from '../libs/elem.js';
import { identity } from '../libs/conversions.js';
import EditView from './EditView.js';
import { copyExistingProperties } from '../libs/utils.js';

export default class ColorView extends EditView {
  #to;
  #from;
  #colorElem;
  #skipUpdate;
  #options = {
    converters: identity,
  };

  constructor(setter, options) {
    const colorElem = createElem('input', {
      type: 'color',
      onInput: () => {
        const [valid, newV] = this.#from(colorElem.value);
        if (valid) {
          this.#skipUpdate = true;
          setter.setValue(newV);
        }
      },
      onChange: () => {
        const [valid, newV] = this.#from(colorElem.value);
        if (valid) {
          this.#skipUpdate = true;
          setter.setFinalValue(newV);
        }
      },
    });
    super(createElem('div', {}, [colorElem]));
    this.setOptions(options);
    this.#colorElem = colorElem;
  }
  updateDisplay(v) {
    if (!this.#skipUpdate) {
      this.#colorElem.value = this.#to(v);
    }
    this.#skipUpdate = false;
  }
  setOptions(options) {
    copyExistingProperties(this.#options, options);
    const {converters: {to, from}} = this.#options;
    this.#to = to;
    this.#from = from;
  }
}
