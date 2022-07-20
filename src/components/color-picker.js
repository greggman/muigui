import Row from '../layouts/row.js';
import InputView from '../base-components/input-view.js';
import View from '../base-components/view.js';
import Label from './Label.js';
import { colorFormatConverters, guessFormat } from '../libs/color-utils.js';

class ColorView extends InputView {
  constructor(toHex, fromHex) {
    super('color', toHex, fromHex);
  }
}

class TextView extends InputView {
  constructor(toStr, fromStr) {
    super('text', toStr, fromStr);
  }
}

export default class Color extends View {
  constructor(setter, format) {
    const row = new Row('muigui-color');
    super(row.domElement);
    format = format || guessFormat(setter.getValue());
    this._converters = colorFormatConverters[format];
    const {toHex, fromHex, toStr, fromStr} = this._converters;
    setter.propagate(this);
    row.add(new Label(setter.name));
    const subRow = row.add(new Row());
    subRow.add(setter.add(new ColorView(toHex, fromHex)));
    subRow.add(setter.add(new TextView(toStr, fromStr)));
  }
}

