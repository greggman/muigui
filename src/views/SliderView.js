import { createElem } from '../libs/elem.js';
import { addTouchEvents } from '../libs/touch.js';
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
  constructor(setter, options) {
    super(createElem('div', {
      innerHTML: svg,
    }));
    const {
      min = -100,
      max = 100,
      step = 10,
      thicks = 30,
    } = options;
    this._svgElem = this.domElement.querySelector('svg');
    this._originElem = this.domElement.querySelector('#origin');
    this._ticksElem = this.domElement.querySelector('#ticks');
    this._thicksElem = this.domElement.querySelector('#thicks');
    this._numbersElem = this.domElement.querySelector('#numbers');
    this._leftGradElem = this.domElement.querySelector('#left-grad');
    this._rightGradElem = this.domElement.querySelector('#right-grad');
    this._ticksElem.setAttribute('d', createSVGTicks(min, max, step));
    this._thicksElem.setAttribute('d', createSVGTicks(min, max, thicks));
    let start;
    addTouchEvents(this.domElement, {
      onDown: (e) => {
        start = 0;
      },
      onMove: (e) => {
        this._originElem.setAttribute('transform', `translate(${e.dx})`);
// setter.setValue(Math.atan2(ny, nx) * 180 / Math.PI);
      },
    });
    new ResizeObserver(() => {
      const {width, height} = this._svgElem.getBoundingClientRect();
      if (this._width !== width || this._height !== height) {
        this._width = width;
        this._height = height;
        const viewBox = `${-width / 2 | 0} 0 ${width | 0} ${height | 0}`;
        this._leftGradElem.setAttribute('x', -width / 2);
        this._rightGradElem.setAttribute('x', width / 2 - 20);
        this._svgElem.setAttribute('viewBox', viewBox);
        const minusSize = computeSizeOfMinus(this._numbersElem);
console.log(minusSize);
        this._numbersElem.innerHTML = createSVGNumbers(min, max, thicks, minusSize);
      }
    }).observe(this._svgElem);
  }
  updateDisplay(v) {
  }
  min(min) {
    //this._rangeView.min(min);
    //this.updateDisplay();
    return this;
  }
  max(max) {
    //this._rangeView.max(max);
    //this.updateDisplay();
    return this;
  }
  step(step) {
    //this._rangeView.step(step);
    //this._numberView.step(step);
    this.updateDisplay();
    return this;
  }
}
