import { createElem } from '../libs/elem.js';
import { addTouchEvents } from '../libs/touch.js';
import ValueController from './value-controller.js';
import { onResizeSVGNoScale } from '../libs/resize-helpers.js';

const svg = `
<svg tabindex="0" viewBox="-32 -32 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
  <path d="m-3200,0L3200,0M0,-3200L0,3200" class="muigui-vec2-axis"/>
  <path id="arrow" d="" class="muigui-vec2-line"/>
  <g id="circle" transform="translate(0, 0)">
    <circle r="3" class="muigui-vec2-axis"/>
  </g>
</svg>
`;



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
    const root = this.contentElement;
    this._svgContainerElem = createElem('div', {
      innerHTML: svg,
    });
    addTouchEvents(this._svgContainerElem, {
      onMove: (e) => {
        const nx = e.nx * 2 - 1;
        const ny = e.ny * 2 - 1;
        this.setValue([nx * 32, ny * 32]);
        this.updateDisplay();
      },
    });
    this._svgElem = this._svgContainerElem.querySelector('svg');
    this._arrowElem = this._svgContainerElem.querySelector('#arrow');
    this._circleElem = this._svgContainerElem.querySelector('#circle');
    onResizeSVGNoScale(this._svgElem, () => this.updateDisplay);
    root.appendChild(this._svgContainerElem);
    this._textElem = createElem('input', {
      type: 'number',
    });
    root.appendChild(this._textElem);
    this.updateDisplay();
  }
  updateDisplay() {
    const [x, y] = this.getValue();
    this._arrowElem.setAttribute('d', `M0,0L${x},${y}`);
    this._circleElem.setAttribute('transform', `translate(${x}, ${y})`);
  }
}
