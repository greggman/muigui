import {addTask, removeTask} from '../libs/taskrunner.js';
import { isTypedArray } from '../libs/utils.js';
import LabelController from './LabelController.js';

export default class ValueController extends LabelController {
  #object;
  #property;
  #initialValue;
  #listening;
  #views;
  #updateFn;

  constructor(object, property, className = '') {
    super(className, property);
    this.#object = object;
    this.#property = property;
    this.#initialValue = this.getValue();
    this.#listening = false;
    this.#views = [];
  }
  get initialValue() {
    return this.#initialValue;
  }
  get object() {
    return this.#object;
  }
  get property() {
    return this.#property;
  }
  add(view) {
    this.#views.push(view);
    super.add(view);
    this.updateDisplay();
    return view;
  }
  setValue(v) {
    if (typeof v === 'object') {
      const dst = this.#object[this.#property];
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
      this.#object[this.#property] = v;
    }
    this.updateDisplay();
    this.emitChange(this.getValue(), this.#object, this.#property);
    return this;
  }
  setFinalValue(v) {
    this.setValue(v);
    this.updateDisplay();
    this.emitFinalChange(this.getValue(), this.#object, this.#property);
    return this;
  }
  updateDisplay() {
    const newV = this.getValue();
    for (const view of this.#views) {
      view.updateDisplayIfNeeded(newV);
    }
    return this;
  }
  setOptions(options) {
    for (const view of this.#views) {
      view.setOptions(options);
    }
    this.updateDisplay();
  }
  getValue() {
    return this.#object[this.#property];
  }
  value(v) {
    this.setValue(v);
    return this;
  }
  reset() {
    this.setValue(this.#initialValue);
    return this;
  }
  listen(listen = true) {
    if (!this.#updateFn) {
      this.#updateFn = this.updateDisplay.bind(this);
    }
    if (listen) {
      if (!this.#listening) {
        this.#listening = true;
        addTask(this.#updateFn);
      }
    } else {
      if (this.#listening) {
        this.#listening = false;
        removeTask(this.#updateFn);
      }
    }
    return this;
  }
}

