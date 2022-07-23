import { createElem } from '../libs/elem.js';
import { makeId } from '../libs/ids.js';
import ValueView from '../views/ValueView.js';
import Controller from './controller.js';

export default class LabelController extends Controller {
  constructor(className = '', name = '') {
    super();
    this._id = makeId();
    this._nameElem = createElem('label', {for: this._id});
    this.domElement.appendChild(this._nameElem);
    this.pushSubView(new ValueView(className));
    this.name(name);
  }
  get id() {
    return this._id;
  }
  name(name) {
    if (this._nameElem.title === this._nameElem.textContent) {
      this._nameElem.title = name;
    }
    this._nameElem.textContent = name;
    return this;
  }
  tooltip(tip) {
    this._nameElem.title = tip;
  }
}

