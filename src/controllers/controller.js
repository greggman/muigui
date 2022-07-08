import { createElem } from '../libs/elem.js';
import { removeArrayElem } from '../libs/utils.js';

export default class Controller {
  constructor(className) {
    this._root = createElem('div', {className: `muigui-controller`});
    this._changeFns = [];
    this._finishChangeFns = [];
    // we need the specialization to come last so it takes precedence.
    if (className) {
      this._root.classList.add(className);
    }
  }
  get domElement() {
    return this._root;
  }
  setParent(parent) {
    this._parent = parent;
    this.enable(!this.disabled());
  }
  show(show = true) {
    this._root.classList.toggle('muigui-hide', !show);
    this._root.classList.toggle('muigui-show', show);
    return this;
  }
  hide() {
    return this.show(false);
  }
  disabled() {
    return !!this._root.closest('.muigui-disabled');
  }
  enable(enable = true) {
    this._root.classList.toggle('muigui-disabled', !enable);
    const disabled = this.disabled();
    ['input', 'button', 'select'].forEach(tag => {
      this._root.querySelectorAll(tag).forEach(e => e.disabled = disabled);
    });
    return this;
  }
  disable(disable = true) {
    return this.enable(!disable);
  }
  onChange(fn) {
    this.removeChange(fn);
    this._changeFns.push(fn);
    return this;
  }
  removeChange(fn) {
    removeArrayElem(this._changeFns, fn);
    return this;
  }
  onFinishChange(fn) {
    this.removeFinishChange(fn);
    this._finishChangeFns.push(fn);
    return this;
  }
  removeFinishChange(fn) {
    removeArrayElem(this._finishChangeFns, fn);
    return this;
  }
  _callListeners(fns, newV) {
    for (const fn of fns) {
      fn.call(this, newV);
    }
  }
  emitChange(value, object, property) {
    this._callListeners(this._changeFns, value);
    if (this._parent) {
      if (object === undefined) {
        this._parent.emitChange(value);
      } else {
        this._parent.emitChange({
          object,
          property,
          value,
          controller: this,
        });
      }
    }
  }
  emitFinalChange(value, object, property) {
    this._callListeners(this._finishChangeFns, value);
    if (this._parent) {
      if (object === undefined) {
        this._parent.emitChange(value);
      } else {
        this._parent.emitFinalChange({
          object,
          property,
          value,
          controller: this,
        });
      }
    }
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

