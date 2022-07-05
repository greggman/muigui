import Folder from './controllers/folder.js';
import css from './styles/muigui.css.js';

let stylesInjected = false;
const styleElem = document.createElement('style');

export class GUI extends Folder {
  constructor(options) {
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
    if (!parent && autoPlace) {
      parent = document.body;
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
