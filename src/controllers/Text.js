import TextView from '../views/TextView.js';
import ValueController from './ValueController.js';

export default class Text extends ValueController {
  constructor(object, property) {
    super(object, property, 'muigui-text');
    this.add(new TextView(this));
    this.updateDisplay();
  }
}