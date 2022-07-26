import { identity } from '../libs/conversions.js';
import ValueController from './ValueController.js';
import NumberView from '../views/NumberView.js';
import SliderView from '../views/SliderView.js';

export default class Slider extends ValueController {
  #sliderView;
  #numberView;

  constructor(object, property, options = {}) {
    super(object, property, 'muigui-slider');
    const {
      min = -100,
      max = 100,
      step = 5,
      conversion = identity,
    } = options;

    this.#sliderView = this.add(new SliderView(this, conversion, options));
    this.#numberView = this.add(new NumberView(this, conversion));

    this.min(min);
    this.max(max);
    this.step(step);
    this.updateDisplay();
  }
  min(min) {
    this.#sliderView.min(min);
    this.updateDisplay();
    return this;
  }
  max(max) {
    this.#sliderView.max(max);
    this.updateDisplay();
    return this;
  }
  step(step) {
    this.#sliderView.step(step);
    this.#numberView.step(step);
    this.updateDisplay();
    return this;
  }
}
