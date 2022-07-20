
import View from '../base-components/view.js';

import { createElem } from '../libs/elem.js';

export default class ValueButton extends View {
  constructor(setter, label = 'button') {
    super(createElem('button', {
      className: 'muigui-button',
      onClick: () => {
        setter.getValue()();
      },
    }));
    this.setLabel(label);
  }
  setLabel(label) {
    this.domElement.textContent = label;
  }
}
