import { createElem } from '../libs/elem.js';
import { removeArrayElem } from '../libs/utils.js';
import View from '../views/View.js';

export default class Controller extends View {
  #changeFns;
  #finishChangeFns;
  #parent;

  constructor(className) {
    super(createElem('div', {className: 'muigui-controller'}));
    this.#changeFns = [];
    this.#finishChangeFns = [];
    // we need the specialization to come last so it takes precedence.
    if (className) {
      this.domElement.classList.add(className);
    }
  }
  get parent() {
    return this.#parent;
  }
  setParent(parent) {
    this.#parent = parent;
    this.enable(!this.disabled());
  }
  show(show = true) {
    this.domElement.classList.toggle('muigui-hide', !show);
    this.domElement.classList.toggle('muigui-show', show);
    return this;
  }
  hide() {
    return this.show(false);
  }
  disabled() {
    return !!this.domElement.closest('.muigui-disabled');
  }

  enable(enable = true) {
    this.domElement.classList.toggle('muigui-disabled', !enable);

    // If disabled we need to set the attribute 'disabled=true' to all
    // input/select/button/textarea's below
    //
    // If enabled we need to set the attribute 'disabled=false' to all below
    // until we hit a disabled controller.
    //
    // ATM the problem is we can find the input/select/button/textarea elements
    // but we can't easily find which controller they belong do.
    // But we don't need to? We can just check up if it or parent has
    // '.muigui-disabled'
    ['input', 'button', 'select', 'textarea'].forEach(tag => {
      this.domElement.querySelectorAll(tag).forEach(elem => {
        const disabled = !!elem.closest('.muigui-disabled');
        elem.disabled = disabled;
      });
    });

    return this;
  }
  disable(disable = true) {
    return this.enable(!disable);
  }
  onChange(fn) {
    this.removeChange(fn);
    this.#changeFns.push(fn);
    return this;
  }
  removeChange(fn) {
    removeArrayElem(this.#changeFns, fn);
    return this;
  }
  onFinishChange(fn) {
    this.removeFinishChange(fn);
    this.#finishChangeFns.push(fn);
    return this;
  }
  removeFinishChange(fn) {
    removeArrayElem(this.#finishChangeFns, fn);
    return this;
  }
  #callListeners(fns, newV) {
    for (const fn of fns) {
      fn.call(this, newV);
    }
  }
  emitChange(value, object, property) {
    this.#callListeners(this.#changeFns, value);
    if (this.#parent) {
      if (object === undefined) {
        this.#parent.emitChange(value);
      } else {
        this.#parent.emitChange({
          object,
          property,
          value,
          controller: this,
        });
      }
    }
  }
  emitFinalChange(value, object, property) {
    this.#callListeners(this.#finishChangeFns, value);
    if (this.#parent) {
      if (object === undefined) {
        this.#parent.emitChange(value);
      } else {
        this.#parent.emitFinalChange({
          object,
          property,
          value,
          controller: this,
        });
      }
    }
  }
  updateDisplay() {
    // placeholder. override
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
    this.domElement.appendChild(div);
    const colors = Object.fromEntries(keys.map(key => {
      div.style.color = `var(--${key})`;
      const s = getComputedStyle(div);
      return [toCamelCase(key), s.color];
    }));
    div.remove();
    return colors;
  }
}
