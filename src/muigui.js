import css from './styles/muigui.css.js';
import {createElem} from './libs/elem.js';
import {createController} from './controllers/create-controller.js';
import Canvas from './controllers/Canvas.js';
import Color from './controllers/Color.js';
import Divider from './controllers/Divider.js';
import Folder from './controllers/Folder.js';
import Label from './controllers/Label.js';

let stylesInjected = false;
const styleElem = createElem('style');

export class GUIFolder extends Folder {
  add(object, property, ...args) {
    return this.addController(createController(object, property, ...args));
  }
  addCanvas(name) {
    return this.addController(new Canvas(name));
  }
  addColor(object, property, ...args) {
    return this.addController(new Color(object, property, ...args));
  }
  addDivider() {
    return this.addController(new Divider());
  }
  addFolder(name) {
    return this.addController(new GUIFolder(name));
  }
  addLabel(text) {
    return this.addController(new Label(text));
  }
}

export class GUI extends GUIFolder {
  constructor(options = {}) {
    super('Controls', 'muigui-root');
    if (options instanceof HTMLElement) {
      options = {parent: options};
    }
    const {
      autoPlace = true,
      width,
      title = 'Controls',
      injectStyles = true,
    } = options;
    let {
      parent,
    } = options;
    if (injectStyles && !stylesInjected) {
      stylesInjected = true;
      (document.head || document.documentElement).appendChild(styleElem);
      styleElem.textContent = css;
    }
    if (width) {
      this.domElement.style.width = /^\d+$/.test(width) ? `${width}px` : width;
    }
    if (parent === undefined && autoPlace) {
      parent = document.body;
      this.domElement.classList.add('muigui-auto-place');
    }
    if (parent) {
      parent.appendChild(this.domElement);
    }
    if (title) {
      this.title(title);
    }
    this.domElement.classList.add('muigui');
  }
}

export default GUI;
