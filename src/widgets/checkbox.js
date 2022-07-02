import {
  createElem,
} from '../libs/elem.js';
import Widget from './widget.js';

export default class Checkbox extends Widget {
  constructor(object, property) {
    super(object, property, 'muigui-checkbox');
    const root = this.elem;
    const id = this.id;

    this._checkboxElem =  createElem('input', {
      type: 'checkbox',
      id,
      onInput: (e) => {
        this.setValue(this._checkboxElem.checked);
      } 
    });
    this.update();
    root.appendChild(this._checkboxElem);
  }
  update() {
    const newV = super.getValue();
    this._checkboxElem.checked = newV;
  }
  setValue(v) {
    super.setValue(v);
  }
}