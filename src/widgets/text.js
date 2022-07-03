import {
  createElem,
} from '../libs/elem.js';
import ValueWidget from './valuewidget.js';

export default class Text extends ValueWidget {
  constructor(object, property) {
    super(object, property, 'muigui-checkbox');
    const root = this.elem;
    const id = this.id;

    this._textElem =  createElem('input', {
      type: 'text',
      id,
      onInput: (e) => {
        this.setValue(this._textElem.value);
      } 
    });
    this.updateDisplay();
    root.appendChild(this._textElem);
  }
  updateDisplay() {
    const newV = super.getValue();
    this._textElem.value = newV;
  }
  setValue(v) {
    super.setValue(v);
  }
}