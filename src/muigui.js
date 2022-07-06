import Folder from './controllers/folder.js';
import css from './styles/muigui.css.js';
import {createElem} from './libs/elem.js';

let stylesInjected = false;
const styleElem = createElem('style');

export class GUI extends Folder {
  constructor(options = {}) {
    super('Controls', 'muigui-root');
    if (options instanceof HTMLElement) {
      options = {parent: options};
    }
    let {
      parent,
      autoPlace = true,
      width,
      title = 'Controls',
      injectStyles = true,
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
