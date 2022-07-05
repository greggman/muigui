import {
  createElem,
} from '../libs/elem.js';
import LabelController from './label-controller.js';

export default class Canvas extends LabelController {
  constructor(name) {
    super('muigui-canvas', name);
    const root = this.contentElement;

    this._canvasElem =  createElem('canvas', {
      onMouseDown: (e) => {
      },
      onMouseMove: (e) => {
      },
      onMouseUp: (e) => {
      },
    });
    root.appendChild(this._canvasElem);
  }
  get canvas() {
    return this._canvasElem;
  }
}