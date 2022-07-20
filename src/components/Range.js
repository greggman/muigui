import Row from '../layouts/row.js';
import View from '../base-components/view.js';
import InputView from '../base-components/input-view.js';
import Label from './Label.js';

class NumberView extends InputView {
  constructor(toStr, fromStr) {
    super('number', toStr, fromStr);
  }
}

class SliderView extends InputView {
  constructor(min, max, step, conversion) {
    super('range');
    this.min(min);
    this.max(max);
    this.step(step);
    this.conversion(conversion);
  }
  min(min) {
    this._rangeElem.min = min;
    return this;
  }
  max(max) {
    this._rangeElem.max = max;
    return this;
  }
  step(step) {
    this._rangeElem.step = step;
    this._step = step;
    this.updateDisplay();
    return this;
  }
  conversion(conversion) {
    this._from = conversion.from;
    this._to = conversion.to;
    this.updateDisplay();
    return this;
  }
}

export default class Range extends View {
  constructor(setter, min, max, step, conversion) {
    const row = new Row('muigui-range');
    super(row.domElement);
    setter.propagate(this);
    row.add(new Label(setter.name));
    const subRow = row.add(new Row());
    this._slider = subRow.add(setter.add(new SliderView(min, max, step)));
    subRow.add(setter.add(new NumberView(toStr, fromStr)));
    this.conversion(conversion);
    this.min(min);
    this.max(max);
    this.step(step);
  }
  min(min) {
    this._slider.min(min);
    return this;
  }
  max(max) {
    this._slider.max(max);
    return this;
  }
  step(step) {
    this._slider.step(step);
    return this;
  }
  conversion(conversion) {
    this._slider.conversion(conversion);
    return this;
  }
}