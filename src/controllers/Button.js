import {
  createElem,
} from '../libs/elem.js';
import Controller from './Controller.js';

export default class Button extends Controller {
  constructor(object, property, options = {}) {
    super('muigui-button', '');
    this._object = object;
    this._property = property;

    this._buttonElem = this.addElem(
        createElem('button', {
          type: 'button',
          textContent: property,
          onClick: () => {
            this._object[this._property](this);
          },
        }));
    const {name} = options;
    if (name) {
      this.name(name);
    }
  }
  name(name) {
    this._buttonElem.textContent = name;
    return this;
  }
}