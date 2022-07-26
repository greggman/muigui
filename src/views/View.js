export default class View {
  #childDestElem;

  constructor(elem) {
    this.domElement = elem;
    this.#childDestElem = elem;
  }
  addElem(elem) {
    this.#childDestElem.appendChild(elem);
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
    this.addElem(view.domElement);
    return view;
  }
  pushSubView(view) {
    this.pushSubElem(view.domElement);
  }
  popSubView() {
    this.popSubElem();
  }
  $(selector) {
    return this.domElement.querySelector(selector);
  }
}