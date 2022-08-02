import ElementView from '../views/ElementView.js';
import ValueController from './ValueController.js';
import CheckboxView from '../views/CheckboxView.js';

/*

holder = new TabHolder
tab = holder.add(new Tab("name"))
tab.add(...)


pc = new PopdownController
top = pc.add(new Row())
top.add(new Button());
values = topRow.add(new Div())
bottom = pc.add(new Row());



pc = new PopdownController
pc.addTop
pc.addTop

pc.addBottom


*/

function makeSetter(object, property) {
  return {
    setValue(v) {
      object[property] = v;
    },
    setFinalValue(v) {
      this.setValue(v);
    },
  };
}

export default class PopDownController extends ValueController {
  #top;
  #valuesView;
  #bottom;
  #open = {open: false};

  constructor(object, property) {
    super(object, property, 'muigui-pop-down-controller');
    /*
    [ValueView
      [[B][values]]   upper row
      [[  visual ]]   lower row
    ]
    */
    this.#top = this.add(new ElementView('div', 'muigui-pop-down-top'));
    this.#top.add(this.add(new CheckboxView(makeSetter(this.#open, 'open'))));
    this.#valuesView = this.#top.add(new ElementView('div', 'muigui-pop-down-values'));
    this.#bottom = this.add(new ElementView('div', 'muigui-pop-down-bottom'));
  }
  addTop(view) {
    return this.#valuesView.add(view);
  }
  addBottom(view) {
    return this.#bottom.add(view);
  }
}