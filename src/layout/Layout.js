import { createElem } from '../libs/elem.js';
import View from '../views/View.js';

function showCSS(ob) {
  if (ob.prototype.css) {
    showCSS(ob.prototype);
  }
}

export default class Layout extends View {
  static css = 'bar';
  constructor(tag, className) {
    super(createElem(tag, {className}));

    showCSS(this);
  }
}

/*
class ValueController ?? {
  const row = this.add(new Row());
  const label = row.add(new Label());
  const div = row.add(new Div());
  const row = div.add(new Row());
}
*/

/*
class MyCustomThing extends ValueController {
  constructor(object, property, options) {
    const topRow = this.add(new Row());
    const bottomRow = this.add(new Row());
    topRow.add(new NumberView());
    topRow.add(new NumberView());
    topRow.add(new NumberView());
    topRow.add(new NumberView());
    bottomRow.add(new DirectionView());
    bottomRow.add(new DirectionView());
    bottomRow.add(new DirectionView());
    bottomRow.add(new DirectionView());
  }
}
  new Grid([
    [new
  ]
  */