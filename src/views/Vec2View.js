import { createElem } from '../libs/elem.js';
import { addTouchEvents } from '../libs/touch.js';
import { onResizeSVGNoScale } from '../libs/resize-helpers.js';
import EditView from './EditView.js';

const svg = `
<svg tabindex="0" viewBox="-32 -32 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
  <path d="m-3200,0L3200,0M0,-3200L0,3200" class="muigui-vec2-axis"/>
  <path id="muigui-arrow" d="" class="muigui-vec2-line"/>
  <g id="muigui-circle" transform="translate(0, 0)">
    <circle r="3" class="muigui-vec2-axis"/>
  </g>
</svg>
`;

export default class Vec2View extends EditView {
  #svgElem;
  #arrowElem;
  #circleElem;
  #lastV = [];

  constructor(setter) {
    super(createElem('div', {
      innerHTML: svg,
      className: 'muigui-no-scroll',
    }));
    const onTouch = (e) => {
      const {width, height} = this.#svgElem.getBoundingClientRect();
      const nx = e.nx * 2 - 1;
      const ny = e.ny * 2 - 1;
      setter.setValue([nx * width * 0.5, ny * height * 0.5]);
    };
    addTouchEvents(this.domElement, {
      onDown: onTouch,
      onMove: onTouch,
    });
    this.#svgElem = this.$('svg');
    this.#arrowElem = this.$('#muigui-arrow');
    this.#circleElem = this.$('#muigui-circle');
    onResizeSVGNoScale(this.#svgElem, 0.5, 0.5, () => this.#updateDisplayImpl);
  }
  #updateDisplayImpl() {
    const [x, y] = this.#lastV;
    this.#arrowElem.setAttribute('d', `M0,0L${x},${y}`);
    this.#circleElem.setAttribute('transform', `translate(${x}, ${y})`);
  }
  updateDisplay(v) {
    this.#lastV[0] = v[0];
    this.#lastV[1] = v[1];
    this.#updateDisplayImpl();
  }
}
