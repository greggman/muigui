import { createElem } from '../libs/elem.js';
import { makeId } from '../libs/ids.js';
import { idToLabel } from '../libs/utils.js';

export default class Widget {
  constructor(object, property, className = '') {
    this._object = object;
    this._property = property;
    this._changeFns = [];
    this._id = makeId();
    this._nameElem = createElem('label', {textContent: property, for: this._id});
    this._root = createElem('div', {className: `muigui-widget`}, [this._nameElem]);
    // we need the specialization to come last so it takes precedence.
    if (className) {
      this._root.classList.add(className);
    }
  }
  get elem() {
    return this._root;
  }
  get id() {
    return this._id;
  }
  setJustValue(v) {
    this._object[this._property] = v;
  }
  setValue(v) {
    this._object[this._property] = v;
  }
  getValue(v) {
    return this._object[this._property];
  }
  value(v) {
    this.setValue(v);
    return this;
  }
  onChange(fn) {
    this.removeChange(fn);
    this._changeFns.push(fn);
    return this;
  }
  removeChange(fn) {
    this._changeFns.remove(fn);
    return this;
  }
  name(name) {
    this._nameElem.textContent = name;
    return this;
  }
}

