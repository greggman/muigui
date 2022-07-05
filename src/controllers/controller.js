import { createElem } from '../libs/elem.js';

export default class Controller {
  constructor(className) {
    this._root = createElem('div', {className: `muigui-controller`});
    // we need the specialization to come last so it takes precedence.
    if (className) {
      this._root.classList.add(className);
    }
  }
  get domElement() {
    return this._root;
  }
  show(show = true) {
    this._root.classList.toggle('muigui-hide', !show);
    this._root.classList.toggle('muigui-show', show);
    return this;
  }
  hide() {
    return this.show(false);
  }
  enable(enable = true) {
    this._root.classList.toggle('muigui-disabled', !enable);
    return this;
  }
  disable(disable = true) {
    return this.enable(!disable);
  }
}

