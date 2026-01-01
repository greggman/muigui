import { createElem } from '../libs/elem.js';
import { makeId } from '../libs/ids.js';
import ValueView from '../views/ValueView.js';
import Controller from './Controller.js';

export default class LabelController extends Controller {
  #id;
  #nameElem;

  constructor(className = '', name = '') {
    super('muigui-label-controller');
    this.#id = makeId();
    this.#nameElem = createElem('label', {for: this.#id});
    this.domElement.appendChild(this.#nameElem);
    this.pushSubView(new ValueView(className));
    this.name(name);
  }
  get id() {
    return this.#id;
  }
  getName() {
    return this.#nameElem.textContent;
  }
  name(name) {
    if (this.#nameElem.title === this.#nameElem.textContent) {
      this.#nameElem.title = name;
    }
    this.#nameElem.textContent = name;
    return this;
  }
  tooltip(tip) {
    this.#nameElem.title = tip;
  }
}

