import {
  createElem,
} from '../libs/elem.js';
import ValueController from './value-controller.js';

export default class Text extends ValueController {
  constructor(object, property) {
    super(object, property, 'muigui-checkbox');
    const root = this.contentElement;
    const id = this.id;

    this._textElem =  createElem('input', {
      type: 'text',
      id,
      onInput: (e) => {
        this.setValue(this._textElem.value);
      },
      onChange: (e) => {
        this.setFinalValue(this._textElem.value);
      },
    });
    this.updateDisplay();
    root.appendChild(this._textElem);
  }
  updateDisplay() {
    const newV = super.getValue();
    this._textElem.value = newV;
    return this;
  }
}