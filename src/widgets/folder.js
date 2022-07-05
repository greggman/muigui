import { createElem } from '../libs/elem.js';
import Canvas from './canvas.js';
import Color from './color.js';
import { createWidget } from './createWidget.js';
import Controller from './controller.js';


// Clicking should only be first child
export default class Folder extends Controller {
  constructor(name = 'Controls', className = 'muigui-menu') {
    super(className);
    this._labelElem = createElem('label');
    this.domElement.appendChild(createElem('div', {
      onClick: () => { this.toggleOpen() },
    }, [this._labelElem]));
    this._widgetsElem = createElem('div');
    this._controllers = [];
    this.domElement.appendChild(this._widgetsElem);
    this.name(name);
    this.open();
  }
  get children() {
    return this._controllers; // should we return a copy?
  }
  get controllers() {
    return this._controllers.filter(c => !(c instanceof Folder));
  }
  get folders() {
    return this._controllers.filter(c => c instanceof Folder);
  }
  reset(recursive = true) {
    for (const controller of this._controllers) {
      if (!(controller instanceof Folder) || recursive) {
        controller.reset(recursive);
      }
    }
    return this;
  }
  open(open = true) {
    this.domElement.classList.toggle('muigui-closed', !open);
    this.domElement.classList.toggle('muigui-open', open);
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
    this.open(!this.domElement.classList.contains('muigui-open'));
    return this;
  }
  remove(controller) {
    const ndx = this._controllers.indexOf(controller);
    if (ndx >= 0) {
      this._controllers.splice(ndx, 1)[0].elem.remove();
    }    
  }
  add(object, property, ...args) {
    const widget = createWidget(object, property, ...args);
    this._widgetsElem.appendChild(widget.domElement);
    this._controllers.push(widget);
    return widget;
  }
  addColor(object, property, ...args) {
    const widget = new Color(object, property, ...args);
    this._widgetsElem.appendChild(widget.domElement);
    return widget;
  }
  addFolder(name) {
    const widget = new Folder(name);
    this._widgetsElem.appendChild(widget.domElement);
    return widget;
  }
  addCanvas(name) {
    const widget = new Canvas(name);
    this._widgetsElem.appendChild(widget.domElement);
    return widget;
  }
}
