import { identity } from '../libs/conversions.js';
import ValueController from './ValueController.js';
import NumberView from '../views/NumberView.js';
import RangeView from '../views/RangeView.js';

export default class Range extends ValueController {
  #rangeView;
  #numberView;

  constructor(object, property, options) {
    super(object, property, 'muigui-range');
    const {
      min = 0,
      max = 1,
      step = 0.01,
      conversion = identity,
    } = options;
    this.#rangeView = this.add(new RangeView(this, conversion));
    this.#numberView = this.add(new NumberView(this, conversion));

    this.min(min);
    this.max(max);
    this.step(step);
    this.updateDisplay();
  }
  min(min) {
    this.#rangeView.min(min);
    this.updateDisplay();
    return this;
  }
  max(max) {
    this.#rangeView.max(max);
    this.updateDisplay();
    return this;
  }
  step(step) {
    this.#rangeView.step(step);
    this.#numberView.step(step);
    this.updateDisplay();
    return this;
  }
}
