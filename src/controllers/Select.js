import SelectView from '../views/SelectView.js';
import ValueController from './ValueController.js';
import { convertToKeyValues } from '../libs/key-values.js';

export default class Select extends ValueController {
  constructor(object, property, options) {
    super(object, property, 'muigui-select');
    const valueIsNumber = typeof this.getValue() === 'number';
    const {keyValues: keyValuesInput} = options;
    const keyValues = convertToKeyValues(keyValuesInput, valueIsNumber);
    this.add(new SelectView(this, keyValues));
    this.updateDisplay();
  }
}