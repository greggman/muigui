import View from '../base-components/view.js';
import { createElem } from '../libs/elem.js';

export default class Button extends View {
  constructor(fn, label = 'button') {
    super(createElem('button', {
      className: 'muigui-button',
      onClick: () => {
        this._fn();
      },
      textContent: label,
    }));
    this.setCallback(fn);
  }
  setCallback(fn) {
    this._fn = fn;
  }
}
