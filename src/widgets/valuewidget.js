import {addTask, removeTask} from '../libs/taskrunner.js';
import { removeElem } from '../libs/utils.js';
import LabelWidget from './labelwidget.js';

export default class ValueWidget extends LabelWidget {
  constructor(object, property, className = '') {
    super(className, property);
    this._object = object;
    this._property = property;
    this._changeFns = [];
    this._listening = false;
  }
  setJustValue(v) {
    this._object[this._property] = v;
  }
  setValue(v) {
    this._object[this._property] = v;
    const newV = this.getValue(v);
    for (const fn of this._changeFns) {
      fn(newV);
    }
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
    removeElem(this._changeFns, fn);
    return this;
  }
  listen(listen = true) {
    if (!this._updateFn) {
      this._updateFn = this.updateDisplay.bind(this);
    }
    if (listen) {
      if (!this._listening) {
        this._listening = true;
        addTask(this._updateFn);
      }
    } else {
      if (this._listening) {
        this._listening = false;
        removeTask(this._updateFn);
      }
    }
    return this;
  }
}

