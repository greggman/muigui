export default class View {
  super(elem) {
    this._domElement = elem
  }
  get domElement() {
    return this._domElement;
  }
  updateDisplay() {
    return this;
  }
}