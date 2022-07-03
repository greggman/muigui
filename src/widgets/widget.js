import { createElem } from '../libs/elem.js';
import { makeId } from '../libs/ids.js';

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
}

