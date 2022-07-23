import {addTask, removeTask} from '../libs/taskrunner.js';
import { isTypedArray } from '../libs/utils.js';
import LabelController from './LabelController.js';

export default class ValueController extends LabelController {
  constructor(object, property, className = '') {
    super(className, property);
    this._object = object;
    this._property = property;
    this._initialValue = this.getValue();
    this._listening = false;
    this._views = [];
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
  add(view) {
    this._views.push(view);
    return super.add(view);
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
    this.updateDisplay();
    this.emitChange(this.getValue(), this._object, this._property);
    return this;
  }
  setFinalValue(v) {
    this.setValue(v);
    this.updateDisplay();
    this.emitFinalChange(this.getValue(), this._object, this._property);
    return this;
  }
  updateDisplay() {
    const newV = this.getValue();
    for (const view of this._views) {
      view.updateDisplayIfNeeded(newV);
    }
    return this;
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

