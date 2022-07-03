import LabelWidget from './labelwidget.js';

export default class ValueWidget extends LabelWidget {
  constructor(object, property, className = '') {
    super(className, property);
    this._object = object;
    this._property = property;
    this._changeFns = [];
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
}

