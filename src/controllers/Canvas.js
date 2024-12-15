import ElementView from '../views/ElementView.js';
import LabelController from './LabelController.js';

// TODO: remove this? Should just be user side
export default class Canvas extends LabelController {
  #canvasElem;

  constructor(name) {
    super('muigui-canvas', name);
    this.#canvasElem = this.add(
      new ElementView('canvas', 'muigui-canvas'),
    ).domElement;
  }
  get canvas() {
    return this.#canvasElem;
  }
  listen() {
    return this;
  }
}