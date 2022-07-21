import NumberView from '../views/NumberView.js';
import Vec2View from '../views/Vec2View.js';
import ValueController from './value-controller.js';

// TODO: zoom with wheel and pinch?
// TODO: grid?
// // options
//   scale:
//   range: number (both x and y + /)
//   range: array (min, max)
//   xRange:
// deg/rad/turn

export default class Vec2 extends ValueController {
  constructor(object, property) {
    super(object, property, 'muigui-vec2');
    this.add(new Vec2View(this));
    this.add(new NumberView(this, {
      to: v => v[0],
      from: v => {
        const newV = this.getValue().slice();
        newV[0] = v;
        return [true, newV];
      },
    }));
    this.add(new NumberView(this, {
      to: v => v[1],
      from: v => {
        const newV = this.getValue().slice();
        newV[1] = v;
        return [true, newV];
      },
    }));
    this.updateDisplay();
  }
}
