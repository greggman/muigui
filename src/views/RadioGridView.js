import { createElem } from '../libs/elem.js';
import { makeId } from '../libs/ids.js';
import EditView from './EditView.js';

export default class RadioGridView extends EditView {
  #values;

  constructor(setter, keyValues, cols = 3) {
    const values = [];
    const name = makeId();
    super(createElem('div', {}, keyValues.map(([key, value], ndx) => {
      values.push(value);
      return createElem('label', {}, [
        createElem('input', {
          type: 'radio',
          name,
          value: ndx,
          onChange: function() {
            if (this.checked) {
              setter.setFinalValue(that.#values[this.value]);
            }
          },
        }),
        createElem('button', {
          type: 'button',
          textContent: key,
          onClick: function() {
            this.previousElementSibling.click();
          },
        }),
      ]);
    })));
    const that = this;
    this.#values = values;
    this.cols(cols);
  }
  updateDisplay(v) {
    const ndx = this.#values.indexOf(v);
    for (let i = 0; i < this.domElement.children.length; ++i) {
      this.domElement.children[i].children[0].checked = i === ndx;
    }
  }
  cols(cols) {
    this.domElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  }
}
