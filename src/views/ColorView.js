import { createElem } from '../libs/elem.js';
import { identity } from '../libs/conversions.js';
import EditView from './EditView.js';

export default class ColorView extends EditView {
  #to;
  #from;
  #colorElem;
  #skipUpdate;

  constructor(setter, converters = identity) {
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
    const {to, from} = converters;
    this.#to = to;
    this.#from = from;
    this.#colorElem = colorElem;
  }
  updateDisplay(v) {
    if (!this.#skipUpdate) {
      this.#colorElem.value = this.#to(v);
    }
    this.#skipUpdate = false;
  }
}
