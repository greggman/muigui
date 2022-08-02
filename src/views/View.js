import { removeArrayElem } from '../libs/utils.js';

export default class View {
  #childDestElem;
  #views = [];

  constructor(elem) {
    this.domElement = elem;
    this.#childDestElem = elem;
  }
  addElem(elem) {
    this.#childDestElem.appendChild(elem);
    return elem;
  }
  removeElem(elem) {
    this.#childDestElem.removeChild(elem);
    return elem;
  }
  pushSubElem(elem) {
    this.#childDestElem.appendChild(elem);
    this.#childDestElem = elem;
  }
  popSubElem() {
    this.#childDestElem = this.#childDestElem.parentElement;
  }
  add(view) {
    this.#views.push(view);
    this.addElem(view.domElement);
    return view;
  }
  remove(view) {
    this.removeElem(view.domElement);
    removeArrayElem(this.#views, view);
    return view;
  }
  pushSubView(view) {
    this.pushSubElem(view.domElement);
  }
  popSubView() {
    this.popSubElem();
  }
  setOptions(options) {
    for (const view of this.#views) {
      view.setOptions(options);
    }
  }
  updateDisplayIfNeeded(newV, ignoreCache) {
    for (const view of this.#views) {
      view.updateDisplayIfNeeded(newV, ignoreCache);
    }
    return this;
  }
  $(selector) {
    return this.domElement.querySelector(selector);
  }
}