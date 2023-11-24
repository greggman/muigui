import Controller from './Controller.js';

// This feels like it should be something else like
// gui.addDividing = new Controller()
export default class Label extends Controller {
  constructor(text) {
    super('muigui-label');
    this.text(text);
  }
  text(text) {
    this.domElement.textContent = text;
    return this;
  }
}