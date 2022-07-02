import { createElem } from './libs/elem.js';
import Slider from './widgets/slider.js';
import Widget from './widgets/widget.js';

export function createWidget(object, property, ...args) {
  const t = typeof object[property];
  switch (t) {
    case 'number':
      return new Slider(object, property, ...args);
  }
}

export class GUI extends Widget {
  constructor() {
    super({}, 'Controls', 'muigui-root');
    document.body.appendChild(this.elem);
    this._widgetsElem = createElem('div');
    this.elem.appendChild(this._widgetsElem);
  }
  add(object, property, ...args) {
    const widget = createWidget(object, property, ...args);
    this._widgetsElem.appendChild(widget.elem);
    return this;
  }
}

export default GUI;
