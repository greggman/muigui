import { createElem } from '../libs/elem.js';
import { addTouchEvents } from '../libs/touch.js';
import ValueController from './value-controller.js';

const svg = `
<svg tabindex="0" width="100%" height="100%" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <g transform="translate(32, 32)">
      <path d="m-32,0L32,0M0,-32L0,32" class="muigui-vec2-axis"/>
      <path id="arrow" d="" class="muigui-vec2-line"/>
      <g id="circle" transform="translate(0, 0)">
        <circle r="3" class="muigui-vec2-axis"/>
      </g>
    </g>
</svg>
`;

// TODO: zoom with wheel and pinch?

export default class Vec2 extends ValueController {
  constructor(object, property) {
    super(object, property, 'muigui-vec2');
    const root = this.contentElement;
    this._svgElem = createElem('div', {
      innerHTML: svg,
    });
    addTouchEvents(this._svgElem, {
      onMove: (e) => {
        const nx = e.nx * 2 - 1;
        const ny = e.ny * 2 - 1;
        this.setValue([nx * 32, ny * 32]);
        this.updateDisplay();
      },
    });
    this._arrowElem = this._svgElem.querySelector('#arrow');
    this._circleElem = this._svgElem.querySelector('#circle');
    root.appendChild(this._svgElem);
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
