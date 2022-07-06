import {
  createElem,
} from '../libs/elem.js';
import ValueController from './value-controller.js';

const identity = {from: v => v, to: v => v};

// Wanted to name this `Number` but it conflicts with
// JavaScript `Number`. It most likely wouldn't be
// an issue? But users might `import {Number} ...` and
// things would break.
export default class TextNumber extends ValueController {
  constructor(object, property, conversion = identity, step = 0.01) {
    super(object, property, 'muigui-checkbox');
    const root = this.contentElement;
    const id = this.id;

    this._textElem =  createElem('input', {
      type: 'number',
      id,
      onInput: (e) => {
        const v = parseFloat(this._textElem.value);
        if (!Number.isNaN(v)) {
          this.setValue(this._to(v));
        }
      },
      onChange: (e) => {
        const v = parseFloat(this._textElem.value);
        if (!Number.isNaN(v)) {
          this.setFinalValue(this._to(v));
        }
      },
    });
    this.conversion(conversion);
    this.step(step);
    this.updateDisplay();
    root.appendChild(this._textElem);
  }
  step(step) {
    this._step = step;
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
    this._textElem.value = steppedV;
    return this;
  }
  conversion(conversion) {
    this._from = conversion.from;
    this._to = conversion.to;
    this.updateDisplay();
    return this;
  }
}