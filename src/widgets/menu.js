import { createElem } from '../libs/elem.js';
import Canvas from './canvas.js';
import Color from './color.js';
import { createWidget } from './createWidget.js';
import LabelWidget from './labelwidget.js';


// Clicking should only be first child
export default class Menu extends LabelWidget {
  constructor(name = 'Controls', className = 'muigui-menu') {
    super(className, name);
    this._labelElem = this.elem.querySelector('label');
    this._labelElem.addEventListener('click', () => {
      this.toggleOpen();
    });
    this._widgetsElem = createElem('div');
    this.elem.appendChild(this._widgetsElem);
    this.open();
  }
  open(open = true) {
    this.elem.classList.toggle('muigui-closed', !open);
    this.elem.classList.toggle('muigui-open', open);
    return this;
  }
  close() {
    return this.open(false);
  }
  title(title) {
    return this.name(title);
  }
  toggleOpen() {
    this.open(!this.elem.classList.contains('muigui-open'));
    return this;
  }
  add(object, property, ...args) {
    const widget = createWidget(object, property, ...args);
    this._widgetsElem.appendChild(widget.elem);
    return widget;
  }
  addColor(object, property, ...args) {
    const widget = new Color(object, property, ...args);
    this._widgetsElem.appendChild(widget.elem);
    return widget;
  }
  addFolder(name) {
    const widget = new Menu(name);
    this._widgetsElem.appendChild(widget.elem);
    return widget;
  }
  addCanvas(name) {
    const widget = new Canvas(name);
    this._widgetsElem.appendChild(widget.elem);
    return widget;
  }
}
