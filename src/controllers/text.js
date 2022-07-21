import TextView from '../views/TextView.js';
import ValueController from './value-controller.js';

export default class Text extends ValueController {
  constructor(object, property) {
    super(object, property, 'muigui-checkbox');
    this.add(new TextView(this));
    this.updateDisplay();
  }
}