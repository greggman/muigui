export default class View {
  constructor(elem) {
    this.domElement = elem;
    this._childDestElem = elem;
  }
  addElem(elem) {
    this._childDestElem.appendChild(elem);
    return elem;
  }
  pushSubElem(elem) {
    this._childDestElem.appendChild(elem);
    this._childDestElem = elem;
  }
  popSubElem() {
    this._childDestElem = this._childDestElem.parentElement;
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
}