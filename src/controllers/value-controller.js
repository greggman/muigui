import {addTask, removeTask} from '../libs/taskrunner.js';
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
    this._object[this._property] = v;
    this.emitChange(this.getValue(), this._object, this._property);
  }
  setFinalValue(v) {
    this.setValue(v);
    this.emitFinalChange(this.getValue(), this._object, this._property);
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

