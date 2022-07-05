import { createElem } from './libs/elem.js';
import Folder from './widgets/folder.js';

export class GUI extends Folder {
  constructor(parent) {
    super('Controls', 'muigui-root');
    (parent ? parent : document.body).appendChild(this.domElement);
    this.domElement.classList.add('muigui');
  }
}
