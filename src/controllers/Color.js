import {
  colorFormatConverters,
  guessFormat,
} from '../libs/color-utils.js';
import ValueController from './ValueController.js';
import TextView from '../views/TextView.js';
import ColorView from '../views/ColorView.js';

export default class Color extends ValueController {
  constructor(object, property, format) {
    super(object, property, 'muigui-color');

    format = format || guessFormat(this.getValue());
    this._converters = colorFormatConverters[format];
    const {fromHex, toHex, fromStr, toStr} = this._converters;

    this._colorView = this.add(new ColorView(this, {from: fromHex, to: toHex}));
    this._textView = this.add(new TextView(this, {from: fromStr, to: toStr}));
    this.updateDisplay();
  }
}