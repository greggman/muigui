import { createElem } from '../libs/elem.js';
import Controller from './Controller.js';

export default class TabHolder extends Controller {
  #labelElem;

  constructor(name = 'Controls', className = 'muigui-tab-holder') {
    super(className);
    this.#labelElem = createElem('label');
    this.addElem(createElem('button', {
      type: 'button',
      onClick: () => this.toggleOpen(),
    }, [this.#labelElem]));
    this.name(name);
    this.open();
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
    this.#labelElem.textContent = name;
    return this;
  }
  title(title) {
    return this.name(title);
  }
  toggleOpen() {
    this.open(!this.domElement.classList.contains('muigui-open'));
    return this;
  }
}
