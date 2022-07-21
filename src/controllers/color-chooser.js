import ValueController from './value-controller.js';
import ColorChooserView from '../views/ColorChooserView.js';
import TextView from '../views/TextView.js';

export default class ColorChooser extends ValueController {
  constructor(object, property) {
    super(object, property, 'muigui-color-chooser');
    this.add(new ColorChooserView(this));
    this.add(new TextView(this));
    this.updateDisplay();
  }
}
