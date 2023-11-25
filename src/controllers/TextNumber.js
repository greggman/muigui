
import NumberView from '../views/NumberView.js';
import ValueController from './ValueController.js';

// Wanted to name this `Number` but it conflicts with
// JavaScript `Number`. It most likely wouldn't be
// an issue? But users might `import {Number} ...` and
// things would break.
export default class TextNumber extends ValueController {
  #textView;
  #step;

  constructor(object, property, options = {}) {
    super(object, property, 'muigui-text-number');
    this.#textView = this.add(new NumberView(this, options));
    this.updateDisplay();
  }
}