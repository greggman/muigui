import { createElem } from '../libs/elem.js';
import Canvas from './canvas.js';
import Color from './color.js';
import { createWidget } from './createWidget.js';
import Widget from './widget.js';


// Clicking should only be first child
export default class Menu extends Widget {
  constructor(name = 'Controls', className = 'muigui-menu') {
    super(className);
    this._labelElem = createElem('label');
    this.elem.appendChild(createElem('div', {
      onClick: () => { this.toggleOpen() },
    }, [this._labelElem]));
    this._widgetsElem = createElem('div');
    this.elem.appendChild(this._widgetsElem);
    this.name(name);
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
  name(name) {
    this._labelElem.textContent = name;
    return this;
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
