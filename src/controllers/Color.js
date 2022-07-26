import {
  colorFormatConverters,
  guessFormat,
} from '../libs/color-utils.js';
import ValueController from './ValueController.js';
import TextView from '../views/TextView.js';
import ColorView from '../views/ColorView.js';

export default class Color extends ValueController {
  #converters;

  constructor(object, property, options = {}) {
    super(object, property, 'muigui-color');

    const format = options.format || guessFormat(this.getValue());
    this.#converters = colorFormatConverters[format];
    const {fromHex, toHex, fromStr, toStr} = this.#converters;

    this.add(new ColorView(this, {from: fromHex, to: toHex}));
    this.add(new TextView(this, {from: fromStr, to: toStr}));
    this.updateDisplay();
  }
}