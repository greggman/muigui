import { identity } from '../libs/conversions.js';
import ValueController from './ValueController.js';
import NumberView from '../views/NumberView.js';
import RangeView from '../views/RangeView.js';

export default class Slider extends ValueController {
  constructor(object, property, min = 0, max = 1, step = 0.01, conversion = identity) {
    super(object, property, 'muigui-slider');

    this._rangeView = this.add(new RangeView(this, conversion));
    this._numberView = this.add(new NumberView(this, conversion));

    this.min(min);
    this.max(max);
    this.step(step);
    this.updateDisplay();
  }
  min(min) {
    this._rangeView.min(min);
    this.updateDisplay();
    return this;
  }
  max(max) {
    this._rangeView.max(max);
    this.updateDisplay();
    return this;
  }
  step(step) {
    this._rangeView.step(step);
    this._numberView.step(step);
    this.updateDisplay();
    return this;
  }
}
