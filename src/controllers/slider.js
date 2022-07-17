import {
  createElem,
} from '../libs/elem.js';
import ValueController from './value-controller.js';

const identity = {from: v => v, to: v => v};

export default class Slider extends ValueController {
  constructor(object, property, min = 0, max = 1, step = 0.01, conversion = identity) {
    super(object, property, 'muigui-slider');
    const root = this.contentElement;
    const id = this.id;

    this._rangeElem = createElem('input', {
      type: 'range',
      id,
      onInput: () => {
        this._skipUpdateRangeElem = true;
        this.setValue(this._to(this._rangeElem.value));
      },
      onChange: () => {
        this._skipUpdateRangeElem = true;
        this.setFinalValue(this._to(this._rangeElem.value));
      },
    });

    this._textElem = createElem('input', {
      type: 'number',
      onInput: () => {
        const v = parseFloat(this._textElem.value);
        if (!Number.isNaN(v)) {
          this._skipUpdateTextElem = true;
          this.setValue(this._to(v));
        }
      },
      onChange: () => {
        const v = parseFloat(this._textElem.value);
        if (!Number.isNaN(v)) {
          this._skipUpdateTextElem = true;
          this.setFinalValue(this._to(v));
        }
      },
    });

    this.conversion(conversion);
    this.min(min);
    this.max(max);
    this.step(step);
    root.appendChild(this._rangeElem);

    root.appendChild(this._textElem);
    this.updateDisplay();
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
  updateDisplay() {
    const newV = super.getValue();
    // Yea, I know this should be `Math.round(v / step) * step
    // but try step = 0.1, newV = 19.95
    //
    // I get
    //     Math.round(19.95 / 0.1) * 0.1
    //     19.900000000000002
    // vs
    //     Math.round(19.95 / 0.1) / (1 / 0.1)
    //     19.9
    //
    const steppedV = Math.round(this._from(newV) / this._step) / (1 / this._step);
    if (!this._skipUpdateTextElem) {
      this._textElem.value = steppedV;
    }
    if (!this._skipUpdateRangeElem) {
      this._rangeElem.value = steppedV;
    }
    this._skipUpdateRangeElem = false;
    this._skipUpdateTextElem = false;
    return this;
  }
  setValue(v) {
    super.setValue(v);
    this.updateDisplay();
    return this;
  }
}