import {
  createElem,
} from '../libs/elem.js';
import Widget from './widget.js';

export default class Button extends Widget {
  constructor(object, property) {
    super(object, property, 'muigui-button');
    const root = this.elem;

    this._buttonElem =  createElem('button', {
      type: 'button',
      onClick: (e) => {
        this.getValue()(this);
      } 
    });
    root.appendChild(this._buttonElem);
  }
  update() {
  }
  setValue(v) {
    super.setValue(v);
  }
}