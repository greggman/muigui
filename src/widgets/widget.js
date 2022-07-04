import { createElem } from '../libs/elem.js';

export default class Widget {
  constructor(className) {
    this._root = createElem('div', {className: `muigui-widget`});
    // we need the specialization to come last so it takes precedence.
    if (className) {
      this._root.classList.add(className);
    }
  }
  get elem() {
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
}

