import {
  createElem,
} from '../libs/elem.js';
import ValueWidget from './valuewidget.js';

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

export default class Select extends ValueWidget {
  constructor(object, property, keyValuesInput) {
    super(object, property, 'muigui-select');
    const root = this.elem;

    const valueIsNumber = typeof this.getValue() === 'number';
    const keyValues = convertToKeyValues(keyValuesInput, valueIsNumber);

    this._values = [];
    this._selectElem = createElem('select', {
      onChange: (e) => {
        this.setValue(this._values[this._selectElem.selectedIndex])
      },
    }, keyValues.map(([key, value]) => {
      this._values.push(value);
      return createElem('option', {textContent: key});
    }));
    this.update();
    root.appendChild(this._selectElem);
  }
  update() {
    const newV = super.getValue();
    const ndx = this._values.indexOf(newV);
    this._selectElem.selectedIndex = ndx;
  }
  setValue(v) {
    super.setValue(v);
    this.update();
  }
}