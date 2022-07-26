import ValueController from './ValueController.js';
import NumberView from '../views/NumberView.js';
import RangeView from '../views/RangeView.js';

export default class Range extends ValueController {
  constructor(object, property, options) {
    super(object, property, 'muigui-range');
    this.add(new RangeView(this, options));
    this.add(new NumberView(this, options));
  }
}
