import ColorChooserView from '../views/ColorChooserView.js';
import TextView from '../views/TextView.js';
import PopDownController from './PopDownController.js';

export default class ColorChooser extends PopDownController {
  constructor(object, property) {
    super(object, property, 'muigui-color-chooser');
    this.addTop(new TextView(this));
    this.addBottom(new ColorChooserView(this));
    this.updateDisplay();
  }
}
