import { createElem } from '../libs/elem.js';
import { makeId } from '../libs/ids.js';
import Widget from './widget.js';

export default class LabelWidget extends Widget {
  constructor(className = '', name = '') {
    super(className)
    this._id = makeId();
    this._nameElem = createElem('label', {textContent: name, for: this._id});
    this.elem.appendChild(this._nameElem);    
  }
  get id() {
    return this._id;
  }
  name(name) {
    this._nameElem.textContent = name;
    return this;
  }
}

