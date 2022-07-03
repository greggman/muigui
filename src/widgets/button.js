import {
  createElem,
} from '../libs/elem.js';
import Widget from './widget.js';

export default class Button extends Widget {
  constructor(object, property) {
    super('muigui-button', '');
    const root = this.elem;
    this._object = object;
    this._property = property;

    this._buttonElem =  createElem('button', {
      type: 'button',
      textContent: property,
      onClick: (e) => {
        this._object[this._property](this);
      } 
    });
    root.appendChild(this._buttonElem);
  }
  name(name) {
    this._buttonElem.textContent = name;
    return this;
  }
  updateDisplay() {
  }
  setValue(v) {
    super.setValue(v);
  }
}