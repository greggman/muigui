import { createElem } from '../libs/elem.js';
import { addTouchEvents } from '../libs/touch.js';
import ValueController from './value-controller.js';

const svg = `
<svg tabindex="0" width="100%" height="100%" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <circle id="outline" cx="32" cy="32" r="28.871" class="muigui-direction-circle"/>
    <g transform="translate(32 32)">
      <g id="arrow">
          <g transform="translate(-32, -32)">
            <path d="M31.029,33.883c-1.058,-0.007 -1.916,-0.868 -1.916,-1.928c0,-1.065 0.864,-1.929 1.929,-1.929c0.204,0 0.401,0.032 0.586,0.091l14.729,-0l0,-2.585l12.166,4.468l-12.166,4.468l0,-2.585l-15.315,0l-0.013,0Z" class="muigui-direction-arrow"/>
          </g>
      </g>
    </g>
</svg>
`;

export default class Direction extends ValueController {
  constructor(object, property) {
    super(object, property, 'muigui-direction');
    const root = this.contentElement;
    this._svgElem = createElem('div', {
      innerHTML: svg,
    });
    addTouchEvents(this._svgElem, {
      onMove: (e) => {
        const nx = e.nx * 2 - 1;
        const ny = e.ny * 2 - 1;
        this._arrowElem.style.transform = `rotate(${Math.atan2(ny, nx)}rad)`;
      },
    });
    this._arrowElem = this._svgElem.querySelector('#arrow');
    root.appendChild(this._svgElem);
    this._textElem = createElem('input', {
      type: 'number',
    });
    root.appendChild(this._textElem);
  }
}
