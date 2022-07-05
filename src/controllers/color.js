import {
  createElem,
} from '../libs/elem.js';
import ValueController from './value-controller.js';

export default class Color extends ValueController {
  constructor(object, property) {
    super(object, property, 'muigui-color');
    const root = this.domElement;
    const id = this.id;

    this._colorElem = createElem('input', {
      type: 'color',
      id,
      onInput: (e) => {
        this.setValue(this._colorElem.value);
      },
      onChange: (e) => {
        this.setFinalValue(this._colorElem.value);
      },
    });
    root.appendChild(createElem('div', {}, [this._colorElem]));

    this._textElem = createElem('input', {
      type: 'text',
      pattern: /[a-f0-9]{6}/i,
      onInput: (e) => {
        this.setValue(`#${this._textElem.value}`);
      },
      onChange: (e) => {
        this.setFinalValue(this._textElem.value);
      },
    });
    root.appendChild(this._textElem);
    this.updateDisplay();
  }
  updateDisplay() {
    const newV = super.getValue();
    this._textElem.value = newV.substring(1);
    this._colorElem.value = newV;
  }
  setValue(v) {
    super.setValue(v);
  }
}