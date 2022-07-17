import View from './view.js';
import { createElem } from '../libs/elem.js';

export default class InputView extends View {
  constructor(type, toInput, fromInput) {
    super(createElem('input', {
      type,
      onInput: () => {
        this._skipUpdate = true;
        const result = fromInput(this._domElement.value);
        const [valid, newV] = Array.isArray(result) ? result : [true, result];
        if (valid) {
          this._skipUpdate = true;
          this.emit('set', newV);
        }
      },
      onChange: () => {
        this._skipUpdate = true;
        const result = fromInput(this._domElement.value);
        const [valid, newV] = Array.isArray(result) ? result : [true, result];
        if (valid) {
          this.emit('setFinal', newV);
        }
      },
    }));
    this._toInput = toInput;
  }
  updateDisplay(v) {
    if (!this.skipUpdate) {
      this._domElement.value = this._toInput(v);
    }
    this._skipUpdate = false;
  }
}