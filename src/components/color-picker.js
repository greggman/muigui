import Row from '../layouts/row.js';
import PropertySetter from '../base-components/property-setter.js';
import InputView from '../base-components/input-view.js';

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
    super(createElement('div', {
      className: 'muigui-label',
    }));
    this.label(label);
  }
  label(label) {
    this.domElement.textContent = label;
  }
};

export default class Color extends View {
  constructor(editor, format) {
    format = format || guessFormat(this.getValue());
    this._converters = colorFormatConverters[format];
    const {toHex, fromHex, toStr, fromStr} = this._converters;
    const editor = new PropertySetter(object, property);
    editor.propagate(this);
    const row = new Row();
    row.add(new Label(property));
    row.add(editor.add(new ColorView(toHex, fromHex)));
    row.add(editor.add(new TextView(toStr, fromStr)));
  }
}

