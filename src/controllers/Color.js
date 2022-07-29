import {
  colorFormatConverters,
  guessFormat,
} from '../libs/color-utils.js';
import ValueController from './ValueController.js';
import TextView from '../views/TextView.js';
import ColorView from '../views/ColorView.js';

export default class Color extends ValueController {
  #colorView;
  #textView;

  constructor(object, property, options = {}) {
    super(object, property, 'muigui-color');
    const format = options.format || guessFormat(this.getValue());
    const {color, text} = colorFormatConverters[format];
    this.#colorView = this.add(new ColorView(this, {converters: color}));
    this.#textView = this.add(new TextView(this, {converters: text}));
    this.updateDisplay();
  }
  setOptions(options) {
    const {format} = options;
    if (format) {
      const {color, text} = colorFormatConverters[format];
      this.#colorView.setOptions({converters: color});
      this.#textView.setOptions({converters: text});
    }
    super.setOptions(options);
    return this;
  }
}