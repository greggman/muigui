import SelectView from '../views/SelectView.js';
import ValueController from './ValueController.js';

// 4 cases
//   (a) keyValues is array of arrays, each sub array is key value
//   (b) keyValues is array and value is number then keys = array contents, value = index
//   (c) keyValues is array and value is not number, key = array contents, value = array contents
//   (d) keyValues is object then key->value
function convertToKeyValues(keyValues, valueIsNumber) {
  if (Array.isArray(keyValues)) {
    if (Array.isArray(keyValues[0])) {
      // (a) keyValues is array of arrays, each sub array is key value
      return keyValues;
    } else {
      if (valueIsNumber) {
        // (b) keyValues is array and value is number then keys = array contents, value = index
        return keyValues.map((v, ndx) => [v, ndx]);
      } else {
        // (c) keyValues is array and value is not number, key = array contents, value = array contents
        return keyValues.map(v => [v, v]);
      }
    }
  } else {
    // (d)
    return [...Object.entries(keyValues)];
  }
}

export default class Select extends ValueController {
  constructor(object, property, keyValuesInput) {
    super(object, property, 'muigui-select');
    const valueIsNumber = typeof this.getValue() === 'number';
    const keyValues = convertToKeyValues(keyValuesInput, valueIsNumber);
    this.add(new SelectView(this, keyValues));
    this.updateDisplay();
  }
}