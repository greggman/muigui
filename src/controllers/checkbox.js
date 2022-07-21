import CheckboxView from '../views/CheckboxView.js';
import ValueController from './value-controller.js';

export default class Checkbox extends ValueController {
  constructor(object, property) {
    super(object, property, 'muigui-checkbox');
    const id = this.id;
    this._checkboxView = this.add(new CheckboxView(this, id));
    this.updateDisplay();
  }
}