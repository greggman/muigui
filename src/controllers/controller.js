import { createElem } from '../libs/elem.js';

export default class Controller {
  constructor(className) {
    this._root = createElem('div', {className: `muigui-controller`});
    // we need the specialization to come last so it takes precedence.
    if (className) {
      this._root.classList.add(className);
    }
  }
  get domElement() {
    return this._root;
  }
  show(show = true) {
    this._root.classList.toggle('muigui-hide', !show);
    this._root.classList.toggle('muigui-show', show);
    return this;
  }
  hide() {
    return this.show(false);
  }
  enable(enable = true) {
    this._root.classList.toggle('muigui-disabled', !enable);
    return this;
  }
  disable(disable = true) {
    return this.enable(!disable);
  }
  getColors() {
    const toCamelCase = s => s.replace(/-([a-z])/g, (m, m1) => m1.toUpperCase());
    const keys = [
      'color',
      'bg-color',
      'value-color',
      'value-bg-color',
      'hover-bg-color',
      'menu-bg-color',
      'menu-sep-color',
      'disabled-color',
    ];
    const div = createElem('div');
    this._root.appendChild(div);
    const colors = Object.fromEntries(keys.map(key => {
      div.style.color = `var(--${key})`;
      const s = getComputedStyle(div);
      return [toCamelCase(key), s.color];
    }));
    div.remove();
    return colors;
  }
}

