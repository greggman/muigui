import {
  createElem,
} from '../libs/elem.js';
import LabelWidget from './labelwidget.js';

export default class Canvas extends LabelWidget {
  constructor(name) {
    super('muigui-canvas', name);
    const root = this.domElement;

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