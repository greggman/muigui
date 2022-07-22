import {
  createElem,
} from '../libs/elem.js';
import LabelController from './LabelController.js';

// TODO: remove this? Should just be user side
export default class Canvas extends LabelController {
  constructor(name) {
    super('muigui-canvas', name);
    const root = this.contentElement;

    this._canvasElem =  createElem('canvas');
    root.appendChild(this._canvasElem);
  }
  get canvas() {
    return this._canvasElem;
  }
}