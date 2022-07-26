import ElementView from '../views/ElementView.js';
import LabelController from './LabelController.js';

// TODO: remove this? Should just be user side
export default class Canvas extends LabelController {
  constructor() {
    super('muigui-canvas');
    this._canvasElem = this.add(
      new ElementView('canvas', 'muigui-canvas'),
    ).domElement;
  }
  get canvas() {
    return this._canvasElem;
  }
}