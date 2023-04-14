import { createElem } from '../libs/elem.js';
import EditView from './EditView.js';

export default class CheckboxView extends EditView {
  constructor(setter, id) {
    const checkboxElem = createElem('input', {
      type: 'checkbox',
      id,
      onInput: () => {
        setter.setValue(checkboxElem.checked);
      },
      onChange: () => {
        setter.setFinalValue(checkboxElem.checked);
      },
    });
    super(createElem('label', {}, [checkboxElem]));
  }
  updateDisplay(v) {
    this.domElement.checked = v;
  }
}
