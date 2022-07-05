import {
  createElem,
} from '../libs/elem.js';
import ValueWidget from './valuewidget.js';

export default class Checkbox extends ValueWidget {
  constructor(object, property) {
    super(object, property, 'muigui-checkbox');
    const root = this.domElement;
    const id = this.id;

    this._checkboxElem =  createElem('input', {
      type: 'checkbox',
      id,
      onInput: (e) => {
        this.setValue(this._checkboxElem.checked);
      } 
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