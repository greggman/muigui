import { createElem } from '../libs/elem.js';
import { identity } from '../libs/conversions.js';
import EditView from './EditView.js';

export default class TextView extends EditView {
  constructor(setter, converters = identity) {
    super(createElem('input', {
      type: 'text',
      onInput: () => {
        const [valid, newV] = this._from(this.domElement.value);
        if (valid) {
          this._skipUpdateTextElem = true;
          setter.setValue(newV);
        }
        this.domElement.style.color = valid ? '' : 'var(--invalid-color)';
      },
      onChange: () => {
        const [valid, newV] = this._from(this.domElement.value);
        if (valid) {
          this._skipUpdateTextElem = true;
          setter.setFinalValue(newV);
        }
        this.domElement.style.color = valid ? '' : 'var(--invalid-color)';
      },
    }));
    const {to, from} = converters;
    this._to = to;
    this._from = from;
  }
  updateDisplay(v) {
    if (!this._skipUpdateTextElem) {
      this.domElement.value = this._to(v);
      this.domElement.style.color = '';
    }
    this._skipUpdateTextElem = false;
  }
}
