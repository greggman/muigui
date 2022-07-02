import {
  createElem,
} from '../libs/elem.js';
import Widget from './widget.js';

export default class Slider extends Widget {
  constructor(object, property, min = 0, max = 1, step = 0.01) {
    super(object, property, 'muigui-slider');
    const root = this.elem;
    const id = this.id;

    const value = this.getValue();
    this._rangeElem = createElem('input', {
      type: 'range',
      min,
      max,
      value,
      step,
      id,
      onInput: (e) => {
        this.setValue(this._rangeElem.value);
      }
    });
    root.appendChild(this._rangeElem);

    this._textElem = createElem('input', {
      type: 'number',
      value: value,
      onInput: (e) => {
        this.setValue(parseFloat(this._textElem.value));
      },
    });
    root.appendChild(this._textElem);
  }
  setValue(v) {
    super.setValue(v);
    const newV = super.getValue();
    this._textElem.value = newV;
    this._rangeElem.value = newV;
  }
}