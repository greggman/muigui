import { createElem } from './libs/elem.js';
import Menu from './widgets/menu.js';

export class GUI extends Menu {
  constructor(parent) {
    super(parent ? parent : document.body);
    this.elem.classList.add('muigui');
  }
}
