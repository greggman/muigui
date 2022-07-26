import {
  createElem,
} from '../libs/elem.js';
import Controller from './Controller.js';

export default class Button extends Controller {
  #object;
  #property;
  #buttonElem;

  constructor(object, property, options = {}) {
    super('muigui-button', '');
    this.#object = object;
    this.#property = property;

    this.#buttonElem = this.addElem(
        createElem('button', {
          type: 'button',
          textContent: property,
          onClick: () => {
            this.#object[this.#property](this);
          },
        }));
    const {name} = options;
    if (name) {
      this.name(name);
    }
  }
  name(name) {
    this.#buttonElem.textContent = name;
    return this;
  }
}