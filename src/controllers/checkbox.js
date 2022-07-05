import {
  createElem,
} from '../libs/elem.js';
import ValueController from './value-controller.js';

export default class Checkbox extends ValueController {
  constructor(object, property) {
    super(object, property, 'muigui-checkbox');
    const root = this.contentElement;
    const id = this.id;

    this._checkboxElem =  createElem('input', {
      type: 'checkbox',
      id,
      onInput: (e) => {
        this.setValue(this._checkboxElem.checked);
      },
      onChange: (e) => {
        this.setFinalValue(this._checkboxElem.checked);
      },
    });
    this.updateDisplay();
    root.appendChild(createElem('label', {}, [this._checkboxElem]));
  }
  updateDisplay() {
    const newV = super.getValue();
    this._checkboxElem.checked = newV;
  }
  setValue(v) {
    super.setValue(v);
  }
}