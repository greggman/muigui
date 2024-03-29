import RadioGridView from '../views/RadioGridView.js';
import ValueController from './ValueController.js';
import { convertToKeyValues } from '../libs/key-values.js';

export default class RadioGrid extends ValueController {
  constructor(object, property, options) {
    super(object, property, 'muigui-radio-grid');
    const valueIsNumber = typeof this.getValue() === 'number';
    const {
      keyValues: keyValuesInput,
      cols = 3,
    } = options;
    const keyValues = convertToKeyValues(keyValuesInput, valueIsNumber);
    this.add(new RadioGridView(this, keyValues, cols));
    this.updateDisplay();
  }
}