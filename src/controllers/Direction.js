import { identity } from '../libs/conversions.js';
import DirectionView from '../views/DirectionView.js';
import NumberView from '../views/NumberView.js';
// import ValueController from './ValueController.js';
import PopDownController from './PopDownController.js';


// deg2rad
// where is 0
// range (0, 360), (-180, +180), (0,0)   Really this is a range

export default class Direction extends PopDownController {
  #options;
  constructor(object, property, options) {
    super(object, property, 'muigui-direction');
this.#options = options; // FIX
    this.addTop(new NumberView(this,
identity));
    this.addBottom(new DirectionView(this, options));
    this.updateDisplay();
  }
}

