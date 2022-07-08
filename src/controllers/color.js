import {
  colorFormatConverters,
  guessFormat,
} from '../libs/color-utils.js';
import {
  createElem,
} from '../libs/elem.js';
import ValueController from './value-controller.js';

export default class Color extends ValueController {
  constructor(object, property, format) {
    super(object, property, 'muigui-color');
    const root = this.contentElement;
    const id = this.id;

    format = format || guessFormat(this.getValue());
    this._converters = colorFormatConverters[format];
    const {fromHex, fromStr} = this._converters;

    this._colorElem = createElem('input', {
      type: 'color',
      id,
      onInput: (e) => {
        this._skipUpdateColorElem = true;
        this.setValue(fromHex(this._colorElem.value));
      },
      onChange: (e) => {
        this._skipUpdateColorElem = true;
        this.setFinalValue(fromHex(this._colorElem.value));
      },
    });
    root.appendChild(createElem('div', {}, [this._colorElem]));

    this._textElem = createElem('input', {
      type: 'text',
      onInput: (e) => {
        const [valid, newV] = fromStr(this._textElem.value);
        if (valid) {
          this._skipUpdateTextElem = true;
          this.setValue(newV);
        }
      },
      onChange: (e) => {
        const [valid, newV] = fromStr(this._textElem.value);
        if (valid) {
         this._skipUpdateTextElem = true;
         this.setFinalValue(newV);
        }
      },
    });
    root.appendChild(this._textElem);
    this.updateDisplay();
  }
  updateDisplay() {
    const {toHex, toStr} = this._converters;
    const newV = super.getValue();
    if (!this._skipUpdateTextElem) {
      this._textElem.value = toStr(newV);
    }
    if (!this._skipUpdateColorElem) {
      this._colorElem.value = toHex(newV);
    }
    this._skipUpdateTextElem = false;
    this._skipUpdateColorElem = false;
    return this;
  }
  setValue(v) {
    super.setValue(v);
    this.updateDisplay();
    return this;
  }
}