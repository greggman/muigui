
import NumberView from '../views/NumberView.js';
import ValueController from './ValueController.js';
import { strToNumber } from '../libs/conversions.js';

// Wanted to name this `Number` but it conflicts with
// JavaScript `Number`. It most likely wouldn't be
// an issue? But users might `import {Number} ...` and
// things would break.
export default class TextNumber extends ValueController {
  constructor(object, property, conversion = strToNumber, step = 0.01) {
    super(object, property, 'muigui-checkbox');
    this._textView = this.add(new NumberView(this, conversion));
    this.step(step);
    this.updateDisplay();
  }
  step(step) {
    this._step = step;
    this.updateDisplay();
    return this;
  }
}