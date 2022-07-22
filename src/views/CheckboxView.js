import { createElem } from '../libs/elem.js';
import View from './View.js';

export default class CheckboxView extends View {
  constructor(setter, id) {
    const checkboxElem = createElem('input', {
      type: 'checkbox',
      id,
      onInput: () => {
        setter.setValue(this.domElement.checked);
      },
      onChange: () => {
        setter.setFinalValue(this.domElement.checked);
      },
    });
    super(createElem('label', {}, [checkboxElem]));
    this._checkboxElem = checkboxElem;
  }
  updateDisplay(v) {
    this.domElement.checked = v;
  }
}