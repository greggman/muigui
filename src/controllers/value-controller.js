import {addTask, removeTask} from '../libs/taskrunner.js';
import { removeArrayElem } from '../libs/utils.js';
import LabelController from './label-controller.js';

export default class ValueController extends LabelController {
  constructor(object, property, className = '') {
    super(className, property);
    this._object = object;
    this._property = property;
    this._initialValue = this.getValue();
    this._changeFns = [];
    this._finishChangeFns = [];
    this._listening = false;
  }
  get initialValue() {
    return this._initialValue;
  }
  get object() {
    return this._object;
  }
  get property() {
    return this._property;
  }
  setJustValue(v) {
    this._object[this._property] = v;
  }
  _callListeners(fns) {
    const newV = this.getValue();
    for (const fn of fns) {
      fn.call(this, {
        object: this._object,
        property: this._property,
        value: newV,
        controller: this,
      });
    }
  }
  setValue(v) {
    this._object[this._property] = v;
    this._callListeners(this._changeFns);
  }
  setFinalValue(v) {
    this.setValue(v);
    this._callListeners(this._finishChangeFns);
  }
  getValue(v) {
    return this._object[this._property];
  }
  value(v) {
    this.setValue(v);
    return this;
  }
  reset() {
    this.setValue(this._initialValue);
    return this;
  }
  onChange(fn) {
    this.removeChange(fn);
    this._changeFns.push(fn);
    return this;
  }
  removeChange(fn) {
    removeArrayElem(this._changeFns, fn);
    return this;
  }
  onFinishChange(fn) {
    this.removeFinishChange(fn);
    this._finishChangeFns.push(fn);
    return this;
  }
  removeFinishChange(fn) {
    removeArrayElem(this._finishChangeFns, fn);
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

