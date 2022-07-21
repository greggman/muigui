import { createElem } from '../libs/elem.js';
import { addTouchEvents } from '../libs/touch.js';
import { onResizeSVGNoScale } from '../libs/resize-helpers.js';
import View from './View.js';

const svg = `
<svg tabindex="0" viewBox="-32 -32 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
  <path d="m-3200,0L3200,0M0,-3200L0,3200" class="muigui-vec2-axis"/>
  <path id="arrow" d="" class="muigui-vec2-line"/>
  <g id="circle" transform="translate(0, 0)">
    <circle r="3" class="muigui-vec2-axis"/>
  </g>
</svg>
`;

export default class Vec2View extends View {
  constructor(setter) {
    super(createElem('div', {
      innerHTML: svg,
    }));
    addTouchEvents(this.domElement, {
      onMove: (e) => {
        const nx = e.nx * 2 - 1;
        const ny = e.ny * 2 - 1;
        setter.setValue([nx * 32, ny * 32]);
//        this.updateDisplay();
      },
    });
    this._svgElem = this.domElement.querySelector('svg');
    this._arrowElem = this.domElement.querySelector('#arrow');
    this._circleElem = this.domElement.querySelector('#circle');
    onResizeSVGNoScale(this._svgElem, () => this.updateDisplay);
  }
  updateDisplay(v) {
    const [x, y] = v;
    this._arrowElem.setAttribute('d', `M0,0L${x},${y}`);
    this._circleElem.setAttribute('transform', `translate(${x}, ${y})`);
  }
}
