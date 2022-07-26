import { createElem } from '../libs/elem.js';
import { addTouchEvents } from '../libs/touch.js';
import { copyExistingProperties } from '../libs/utils.js';
import EditView from './EditView.js';

const svg = `
<svg tabindex="0" viewBox="-32 -32 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
  <circle cx="0" cy="2" r="2" class="muigui-mark"/>
  <g id="origin">
    <g transform="translate(0, 6)">
      <path id="ticks" class="muigui-ticks"/>
      <path id="thicks" class="muigui-thicks"/>
    </g>
    <g id="numbers" transform="translate(0, 14)" class="muigui-svg-text"/>
  </g>
  <linearGradient id="bg-to-transparent">
    <stop stop-color="var(--value-bg-color)" offset="0%"/>
    <stop stop-color="var(--value-bg-color)" stop-opacity="0" offset="100%"/>
  </linearGradient>
  <linearGradient id="transparent-to-bg">
    <stop stop-color="var(--value-bg-color)" stop-opacity="0"  offset="0%"/>
    <stop stop-color="var(--value-bg-color)" offset="100%"/>  
  </linearGradient>
  <rect id="left-grad" x="0" y="0" width="20" height="20" fill="url(#bg-to-transparent)"/>
  <rect id="right-grad" x="48" y="0" width="20" height="20" fill="url(#transparent-to-bg)"/>
</svg>
`;

function createSVGTicks(min, max, step) {
  const p = [];
  for (let i = min; i <= max; i += step) {
    p.push(`M${i} 0 l0 5`);
  }
  return p.join(' ');
}

function createSVGNumbers(min, max, step, minusSize) {
  const texts = [];
  for (let i = min; i <= max; i += step) {
    texts.push(`<text text-anchor="middle" dominant-baseline="hanging" x="${i >= 0 ? i : (i - minusSize / 2) }" y="0">${i}</text>`);
  }
  return texts.join('\n');
}

function computeSizeOfMinus(elem) {
  const oldHTML = elem.innerHTML;
  elem.innerHTML = '<text>- </text>';
  const text = elem.querySelector('text');
  const size = text.getComputedTextLength();
  elem.innerHTML = oldHTML;
  return size;
}

export default class SliderView extends EditView {
  #svgElem;
  #originElem;
  #ticksElem;
  #thicksElem;
  #numbersElem;
  #leftGradElem;
  #rightGradElem;
  #width;
  #height;
  #lastV;
  #options = {
    min: -100,
    max: 100,
    step: 10,
    unitSize: 10,
    ticksPerUnit: 5,
  };

  constructor(setter, options) {
    super(createElem('div', {
      innerHTML: svg,
    }));
    this.#svgElem = this.$('svg');
    this.#originElem = this.$('#origin');
    this.#ticksElem = this.$('#ticks');
    this.#thicksElem = this.$('#thicks');
    this.#numbersElem = this.$('#numbers');
    this.#leftGradElem = this.$('#left-grad');
    this.#rightGradElem = this.$('#right-grad');
    this.setOptions(options);
    let start;
    addTouchEvents(this.domElement, {
      onDown: (e) => {
        start = 0;
      },
      onMove: (e) => {
        this.#originElem.setAttribute('transform', `translate(${e.dx})`);
// setter.setValue(Math.atan2(ny, nx) * 180 / Math.PI);
      },
    });
    new ResizeObserver(() => {
      const {width, height} = this.#svgElem.getBoundingClientRect();
      if (this.#width !== width || this.#height !== height) {
        this.#width = width;
        this.#height = height;
        const viewBox = `${-width / 2 | 0} 0 ${width | 0} ${height | 0}`;
        this.#leftGradElem.setAttribute('x', -width / 2);
        this.#rightGradElem.setAttribute('x', width / 2 - 20);
        this.#svgElem.setAttribute('viewBox', viewBox);
        const minusSize = computeSizeOfMinus(this.#numbersElem);
        const {min, max, unitSize} = this.#options;
        this.#numbersElem.innerHTML = createSVGNumbers(min, max, unitSize, minusSize);
        this.#updateSlider();
      }
    }).observe(this.#svgElem);
  }
  // |--------V--------|
  // . . | . . . | . . . |
  //
  #updateSlider() {
    // There's no size of ResizeObserver has not fired yet.
    if (!this.#width) {
      return;
    }
    const {unitSize, ticksPerUnit} = this.#options;
    const unitsAcross = Math.ceil(this.#width / unitSize);
    const start = unitsAcross * unitSize * -2;
    const end = unitsAcross * unitSize * 2;
    this.#ticksElem.setAttribute('d', createSVGTicks(start, end, unitSize / ticksPerUnit));
    this.#thicksElem.setAttribute('d', createSVGTicks(start, end, unitSize));

  }
  updateDisplay(v) {
    this.#lastV = v;
    this.#updateSlider();
  }
  setOptions(options) {
    copyExistingProperties(this.#options, options);
    return this;
  }
}
