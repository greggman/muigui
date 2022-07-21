export default class View {
  constructor(elem) {
    this.domElement = elem;
  }
  add(view) {
    this._domElement.appendChild(view.domElement);
    return view;
  }
}