import { createElem } from '../libs/elem.js';
import { createWidget } from './createWidget.js';
import Widget from './widget.js';


// FIX: Menu should not be based on Widget
// Clicking should only be first child
export default class Menu extends Widget {
  constructor(parent, className = 'muigui-menu') {
    super({}, 'Controls', className);
    if (!parent) {
      parent =  document.body;
    }
    parent.appendChild(this.elem);
    this.elem.addEventListener('click', () => {
      console.log('click');

      this.toggleOpen();
    });
    this._widgetsElem = createElem('div');
    this.elem.appendChild(this._widgetsElem);
    this.open();
  }
  open(open = true) {
    console.log('open:', open);
    this.elem.classList.toggle('muigui-closed', !open);
    this.elem.classList.toggle('muigui-open', open);
  }
  close() {
    this.open(false);
  }
  toggleOpen() {
    this.open(!this.elem.classList.contains('muigui-open'));
  }
  add(object, property, ...args) {
    const widget = createWidget(object, property, ...args);
    this._widgetsElem.appendChild(widget.elem);
    return this;
  }
}
