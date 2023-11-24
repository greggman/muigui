import {
  createElem,
} from '../libs/elem.js';
import { copyExistingProperties } from '../libs/utils.js';
import Controller from './Controller.js';

export default class Button extends Controller {
  #object;
  #property;
  #buttonElem;
  #options = {
    name: '',
  };

  constructor(object, property, options = {}) {
    super('muigui-button', '');
    this.#object = object;
    this.#property = property;

    this.#buttonElem = this.addElem(
        createElem('button', {
          type: 'button',
          onClick: () => {
            this.#object[this.#property](this);
          },
        }));
    this.setOptions({name: property, ...options});
  }
  setOptions(options) {
    copyExistingProperties(this.#options, options);
    const {name} = this.#options;
    this.#buttonElem.textContent = name;
  }
}