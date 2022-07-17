import Layout from './layout.js';

export default class Pane extends Layout {
  constructor() {
    super('muigui-pane');
  }
  add(rowCol) {
    if (this._type && this._type !== rowCol.constructor) {
      throw new Error('must add same types to Pane');
    }
    this.domElement.classList.add(`muigui-${rowCol.constructor.name.toLowerCase()}s`);
    return super.add(rowCol);
  }
}