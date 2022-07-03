import {
  createElem,
} from '../libs/elem.js';
import ValueWidget from './valuewidget.js';

export default class Color extends ValueWidget {
  constructor(object, property) {
    super(object, property, 'muigui-color');
    const root = this.elem;
    const id = this.id;

    this._colorElem =  createElem('input', {
      type: 'color',
      id,
      onInput: (e) => {
        this.setValue(this._colorElem.value);
      } 
    });
    this.update();
    root.appendChild(this._colorElem);
  }
  update() {
    const newV = super.getValue();
    this._colorElem.value = newV;
  }
  setValue(v) {
    super.setValue(v);
  }
}