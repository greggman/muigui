import { createElem } from './libs/elem.js';
import Menu from './widgets/menu.js';

export class GUI extends Menu {
  constructor(parent) {
    super('Controls', 'muigui-root');
    (parent ? parent : document.body).appendChild(this.elem);
    this.elem.classList.add('muigui');
  }
}
