import {
  createElem,
} from '../libs/elem.js';
import Controller from './controller.js';

export default class Button extends Controller {
  constructor(object, property) {
    super('muigui-button', '');
    const root = this.domElement;
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
  onChange() { return this; } // what
  onFinishChange() { return this; } // what?
}