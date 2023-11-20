import {
  colorFormatConverters,
  guessFormat,
  hasAlpha,
} from '../libs/color-utils.js';
import ColorChooserView from '../views/ColorChooserView.js';
import TextView from '../views/TextView.js';
import PopDownController from './PopDownController.js';

export default class ColorChooser extends PopDownController {
  #colorView;
  #textView;

  constructor(object, property, options = {}) {
    super(object, property, 'muigui-color-chooser');
    const format = options.format || guessFormat(this.getValue());
    const {color, text} = colorFormatConverters[format];
    this.#textView = new TextView(this, {converters: text, alpha: hasAlpha(format)});
    this.#colorView = new ColorChooserView(this, {converters: color, alpha: hasAlpha(format)});
    this.addTop(this.#textView);
    this.addBottom(this.#colorView);
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
