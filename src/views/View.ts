import { removeArrayElem } from '../libs/utils.js';

export default class View {
  domElement: HTMLElement;

  #childDestElem: HTMLElement;
  #views: View[] = [];

  constructor(elem: HTMLElement) {
    this.domElement = elem;
    this.#childDestElem = elem;
  }
  addElem(elem: HTMLElement) {
    this.#childDestElem.appendChild(elem);
    return elem;
  }
  removeElem(elem: HTMLElement) {
    this.#childDestElem.removeChild(elem);
    return elem;
  }
  pushSubElem(elem: HTMLElement) {
    this.#childDestElem.appendChild(elem);
    this.#childDestElem = elem;
  }
  popSubElem() {
    this.#childDestElem = this.#childDestElem.parentElement!;
  }
  add(view: View) {
    this.#views.push(view);
    this.addElem(view.domElement);
    return view;
  }
  remove(view: View) {
    this.removeElem(view.domElement);
    removeArrayElem(this.#views, view);
    return view;
  }
  pushSubView(view: View) {
    this.pushSubElem(view.domElement);
  }
  popSubView() {
    this.popSubElem();
  }
  setOptions(options: any) {
    for (const view of this.#views) {
      view.setOptions(options);
    }
  }
  updateDisplayIfNeeded(newV: any, ignoreCache?: boolean) {
    for (const view of this.#views) {
      view.updateDisplayIfNeeded(newV, ignoreCache);
    }
    return this;
  }
  $(selector: string) {
    return this.domElement.querySelector(selector);
  }
}