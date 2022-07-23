import {
  createElem,
} from '../libs/elem.js';
import Controller from './controller.js';

export default class Button extends Controller {
  constructor(object, property) {
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
  }
  name(name) {
    this._buttonElem.textContent = name;
    return this;
  }
}