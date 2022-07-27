import GridView from '../views/GridView.js';
import NumberView from '../views/NumberView.js';
import Vec2View from '../views/Vec2View.js';
import ValueController from './ValueController.js';
import { strToNumber } from '../libs/conversions.js';

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
    this.pushSubView(new GridView(2));

    const makeSetter = (ndx) => {
      return {
        setValue: (v) => {
          const newV = this.getValue();
          newV[ndx] = v;
          this.setValue(newV);
        },
        setFinalValue: (v) => {
          const newV = this.getValue();
          newV[ndx] = v;
          this.setFinalValue(newV);
        },
      };
    };

    this.add(new NumberView(makeSetter(0), {
      converters: {
        to: v => v[0],
        from: strToNumber.from,
      },
    }));
    this.add(new NumberView(makeSetter(1), {
      converters: {
        to: v => v[1],
        from: strToNumber.from,
      },
    }));
    this.popSubView();
    this.updateDisplay();
  }
}
