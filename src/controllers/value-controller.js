import {addTask, removeTask} from '../libs/taskrunner.js';
import { isTypedArray } from '../libs/utils.js';
import LabelController from './label-controller.js';

export default class ValueController extends LabelController {
  constructor(object, property, className = '') {
    super(className, property);
    this._object = object;
    this._property = property;
    this._initialValue = this.getValue();
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
  setValue(v) {
    if (typeof v === 'object') {
      const dst = this._object[this._property];
      // don't replace objects, just their values.
      if (Array.isArray(v)) {
        for (let i = 0; i < v.length; ++i) {
          dst[i] = v[i];
        }
      } else if (isTypedArray(v)) {
        dst.set(v);
      } else {
        Object.assign(dst, v);
      }
    } else {
      this._object[this._property] = v;
    }
    this.emitChange(this.getValue(), this._object, this._property);
  }
  setFinalValue(v) {
    this.setValue(v);
    this.emitFinalChange(this.getValue(), this._object, this._property);
  }
  getValue() {
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

