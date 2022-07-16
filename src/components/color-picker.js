import Row from '../layouts/row.js';
import PropertySetter from '../base-components/property-setter.js';
import InputView from '../base-components/input-view.js';
import View from '../base-components/view.js';
import { createElem } from '../libs/elem.js';
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

class Label extends View {
  constructor(label) {
    super(createElem('div', {
      className: 'muigui-label',
    }));
    this.label(label);
  }
  label(label) {
    this.domElement.textContent = label;
  }
};

export default class Color extends View {
  constructor(setter, format) {
    const row = new Row();
    super(row.domElement);
    format = format || guessFormat(setter.getValue());
    this._converters = colorFormatConverters[format];
    const {toHex, fromHex, toStr, fromStr} = this._converters;
    setter.propagate(this);
    row.add(new Label('property'));
    row.add(setter.add(new ColorView(toHex, fromHex)));
    row.add(setter.add(new TextView(toStr, fromStr)));
  }
}

