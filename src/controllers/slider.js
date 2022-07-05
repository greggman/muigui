import {
  createElem,
} from '../libs/elem.js';
import ValueController from './value-controller.js';

export default class Slider extends ValueController {
  constructor(object, property, min = 0, max = 1, step = 0.01) {
    super(object, property, 'muigui-slider');
    const root = this.domElement;
    const id = this.id;

    this._rangeElem = createElem('input', {
      type: 'range',
      min,
      max,
      step,
      id,
      onInput: (e) => {
        this.setValue(this._rangeElem.value);
      },
      onChange: (e) => {
        this.setFinalValue(this._rangeElem.value);
      },
    });
    root.appendChild(this._rangeElem);

    this._textElem = createElem('input', {
      type: 'number',
      onInput: (e) => {
        const v = parseFloat(this._textElem.value);
        if (!Number.isNaN(v)) {
          this.setValue(v);
        }
      },
      onChange: (e) => {
        const v = parseFloat(this._textElem.value);
        if (!Number.isNaN(v)) {
          this.setFinalValue(parseFloat(this._textElem.value));
        }
      }
    });
    root.appendChild(this._textElem);
    this.updateDisplay();
  }
  updateDisplay() {
    const newV = super.getValue();
    this._textElem.value = newV;
    this._rangeElem.value = newV;
  }
  setValue(v) {
    super.setValue(v);
    this.updateDisplay();
  }
}