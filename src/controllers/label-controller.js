import { createElem } from '../libs/elem.js';
import { makeId } from '../libs/ids.js';
import Controller from './controller.js';

export default class LabelController extends Controller {
  constructor(className = '', name = '') {
    super();
    this._id = makeId();
    this._nameElem = createElem('label', {for: this._id});
    this._contentElem = createElem('div', {className: 'muigui-value'});
    this._contentElem.classList.add(className);
    this.domElement.appendChild(this._nameElem);
    this.domElement.appendChild(this._contentElem);
    this.name(name);
  }
  get id() {
    return this._id;
  }
  get contentElement() {
    return this._contentElem;
  }
  add(view) {
    this._contentElem.appendChild(view.domElement);
    return view;
  }
  name(name) {
    this._nameElem.textContent = name;
    this._nameElem.title = name;
    return this;
  }
}

