import {
  colorFormatConverters,
  guessFormat,
} from '../libs/color-utils.js';
import ValueController from './ValueController.js';
import TextView from '../views/TextView.js';
import ColorView from '../views/ColorView.js';

function getConversions(format) {
  const {fromHex, toHex, fromStr, toStr} = colorFormatConverters[format];
  return {
    color: {converters: {from: fromHex, to: toHex}},
    text: {converters: {from: fromStr, to: toStr}},
  };
}

export default class Color extends ValueController {
  #colorView;
  #textView;

  constructor(object, property, options = {}) {
    super(object, property, 'muigui-color');
    const format = options.format || guessFormat(this.getValue());
    const {color, text} = getConversions(format);
    this.#colorView = this.add(new ColorView(this, color));
    this.#textView = this.add(new TextView(this, text));
    this.updateDisplay();
  }
  setOptions(options) {
    const {format} = options;
    if (format) {
      const {color, text} = getConversions(format);
      this.#colorView.setOptions(color);
      this.#textView.setOptions(text);
    }
    super.setOptions(options);
    return this;
  }
}