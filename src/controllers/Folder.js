import { createElem } from '../libs/elem.js';
import Container from './Container.js';

export default class Folder extends Container {
  #labelElem;

  constructor(name = 'Controls', className = 'muigui-menu') {
    super(className);
    this.#labelElem = createElem('label');
    this.addElem(createElem('button', {
      type: 'button',
      onClick: () => this.toggleOpen(),
    }, [this.#labelElem]));
    this.pushContainer(new Container('muigui-open-container'));
    this.pushContainer(new Container());
    this.name(name);
    this.open();
  }
  isOpen() {
    return this.domElement.classList.contains('muigui-open');
  }
  open(open = true) {
    const old = this.isOpen();
    this.domElement.classList.toggle('muigui-closed', !open);
    this.domElement.classList.toggle('muigui-open', open);
    if (old !== open) {
      this.emitChange(open, this);
    }
    return this;
  }
  close() {
    return this.open(false);
  }
  getName() {
    return this.#labelElem.textContent;
  }
  name(name) {
    this.#labelElem.textContent = name;
    return this;
  }
  title(title) {
    return this.name(title);
  }
  toggleOpen() {
    this.open(!this.isOpen());
    return this;
  }
}
