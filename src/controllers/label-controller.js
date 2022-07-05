import { createElem } from '../libs/elem.js';
import { makeId } from '../libs/ids.js';
import Controller from './controller.js';

export default class LabelController extends Controller {
  constructor(className = '', name = '') {
    super(className)
    this._id = makeId();
    this._nameElem = createElem('label', {for: this._id});
    this.domElement.appendChild(this._nameElem);
    this.name(name);
  }
  get id() {
    return this._id;
  }
  name(name) {
    this._nameElem.textContent = name;
    this._nameElem.title = name;
    return this;
  }
}

