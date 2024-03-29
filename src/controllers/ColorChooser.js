/* eslint-disable no-underscore-dangle */
import {
  colorFormatConverters,
  guessFormat,
  hasAlpha,
  hexToUint8RGB,
  hslToRgbUint8,
  rgbUint8ToHsl,
  uint8RGBToHex,
} from '../libs/color-utils.js';
import ColorChooserView from '../views/ColorChooserView.js';
import TextView from '../views/TextView.js';
import PopDownController from './PopDownController.js';

export default class ColorChooser extends PopDownController {
  #colorView;
  #textView;
  #to;

  constructor(object, property, options = {}) {
    super(object, property, 'muigui-color-chooser');
    const format = options.format || guessFormat(this.getValue());
    const {color, text} = colorFormatConverters[format];
    this.#to = color.to;
    this.#textView = new TextView(this, {converters: text, alpha: hasAlpha(format)});
    this.#colorView = new ColorChooserView(this, {converters: color, alpha: hasAlpha(format)});
    this.addTop(this.#textView);
    this.addBottom(this.#colorView);
    // WTF! FIX!
    this.___setKnobHelper = true;
    this.updateDisplay();
  }
  #setKnobHelper() {
    if (this.#to) {
      const hex6Or8 = this.#to(this.getValue());
      const alpha = hex6Or8.length === 9 ? hex6Or8.substring(7, 9) : 'FF';
      const hsl = rgbUint8ToHsl(hexToUint8RGB(hex6Or8));
      hsl[2] = (hsl[2] + 50) % 100;
      const hex = uint8RGBToHex(hslToRgbUint8(hsl));
      this.setKnobColor(`${hex6Or8.substring(0, 7)}${alpha}`, hex);
    }
  }
  updateDisplay() {
    super.updateDisplay();
    if (this.___setKnobHelper) {
      this.#setKnobHelper();
    }
  }
  setOptions(options) {
    super.setOptions(options);
    return this;
  }
}
