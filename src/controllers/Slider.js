import ValueController from './ValueController.js';
import NumberView from '../views/NumberView.js';
import SliderView from '../views/SliderView.js';

export default class Slider extends ValueController {
  constructor(object, property, options = {}) {
    super(object, property, 'muigui-slider');
    this.add(new SliderView(this, options));
    this.add(new NumberView(this, options));
    this.updateDisplay();
  }
}
