import {
  createElem,
} from '../libs/elem.js';
import LabelController from './LabelController.js';

// TODO: remove this? Should just be user side
export default class SVG extends LabelController {
  constructor(name) {
    super('muigui-svg', name);
    const root = this.contentElement;

    this._canvasElem =  createElem('svg', {
       style: 'border: 1px solid red',
       width: '600',
       height: '250',
    });
    root.appendChild(this._canvasElem);
  }
  get canvas() {
    return this._canvasElem;
  }
}