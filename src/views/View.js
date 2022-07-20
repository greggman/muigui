export default class View {
  constructor(elem) {
    this._domElement = elem;
  }
  get domElement() {
    return this._domElement;
  }
  add(view) {
    this._domElement.appendChild(view.domElement);
    return view;
  }
}