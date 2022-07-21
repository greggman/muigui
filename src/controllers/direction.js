import { identity } from '../libs/conversions.js';
import DirectionView from '../views/DirectionView.js';
import NumberView from '../views/NumberView.js';
import ValueController from './value-controller.js';



// deg2rad
// where is 0
// range (0, 360), (-180, +180), (0,0)   Really this is a slider

export default class Direction extends ValueController {
  constructor(object, property, options) {
    super(object, property, 'muigui-direction');
this._options = options;
    this.add(new DirectionView(this));
    this.add(new NumberView(this,
identity));
    this.updateDisplay();
  }
}
