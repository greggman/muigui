import { createElem } from '../libs/elem.js';
import { makeId } from '../libs/ids.js';
import Controller from './controller.js';

export default class LabelWidget extends Controller {
  constructor(className = '', name = '') {
    super(className)
    this._id = makeId();
    this._nameElem = createElem('label', {textContent: name, for: this._id});
    this.domElement.appendChild(this._nameElem);    
  }
  get id() {
    return this._id;
  }
  name(name) {
    this._nameElem.textContent = name;
    return this;
  }
}

