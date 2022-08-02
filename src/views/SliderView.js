import { createElem } from '../libs/elem.js';
import { addKeyboardEvents } from '../libs/keyboard.js';
import { addTouchEvents } from '../libs/touch.js';
import { createWheelHelper } from '../libs/wheel.js';
import { onResizeSVGNoScale } from '../libs/resize-helpers.js';
import { clamp, copyExistingProperties, stepify } from '../libs/utils.js';
import EditView from './EditView.js';

const svg = `
<svg tabindex="0" viewBox="-32 -32 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
  <g id="muigui-orientation">
    <g id="muigui-origin">
      <g transform="translate(0, 4)">
        <path id="muigui-ticks" class="muigui-ticks"/>
        <path id="muigui-thicks" class="muigui-thicks"/>
      </g>
      <g transform="translate(0, 14)">
        <g id="muigui-number-orientation">
          <g id="muigui-numbers" transform="translate(0, -3)" class="muigui-svg-text"/>
        </g>
      </g>
    </g>
    <linearGradient id="muigui-bg-to-transparent">
      <stop stop-color="var(--value-bg-color)" offset="0%"/>
      <stop stop-color="var(--value-bg-color)" stop-opacity="0" offset="100%"/>
    </linearGradient>
    <linearGradient id="muigui-transparent-to-bg">
      <stop stop-color="var(--value-bg-color)" stop-opacity="0"  offset="0%"/>
      <stop stop-color="var(--value-bg-color)" offset="100%"/>  
    </linearGradient>
    <!--<circle cx="0" cy="2" r="2" class="muigui-mark"/>-->
    <!--<rect x="-1" y="0" width="2" height="10" class="muigui-mark"/>-->
    <path d="M0 4L-2 0L2 0" class="muigui-mark"/>
  </g>
  <rect id="muigui-left-grad" x="0" y="0" width="20" height="20" fill="url(#muigui-bg-to-transparent)"/>
  <rect id="muigui-right-grad" x="48" y="0" width="20" height="20" fill="url(#muigui-transparent-to-bg)"/>
</svg>
`;

function createSVGTicks(start, end, step, min, max, height) {
  const p = [];
  if (start < min) {
    start += stepify(min - start, v => v, step);
  }
  end = Math.min(end, max);
  for (let i = start; i <= end; i += step) {
    p.push(`M${i} 0 l0 ${height}`);
  }
  return p.join(' ');
}

function createSVGNumbers(start, end, unitSize, unit, minusSize, min, max, labelFn) {
  const texts = [];
  if (start < min) {
    start += stepify(min - start, v => v, unitSize);
  }
  end = Math.min(end, max);
  const digits = Math.max(0, -Math.log10(unit));
  const f = v => labelFn(v.toFixed(digits));
  for (let i = start; i <= end; i += unitSize) {
    texts.push(`<text text-anchor="middle" dominant-baseline="hanging" x="${i >= 0 ? i : (i - minusSize / 2) }" y="0">${f(i / unitSize * unit)}</text>`);
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
  #minusSize;
  #options = {
    min: -100,
    max: 100,
    step: 1,
    unit: 10,
    unitSize: 10,
    ticksPerUnit: 5,
    labelFn: v => v,
    tickHeight: 1,
    limits: true,
    thicksColor: undefined,
    orientation: undefined,
  };

  constructor(setter, options) {
    const wheelHelper = createWheelHelper();
    super(createElem('div', {
      innerHTML: svg,
      onWheel: e => {
        e.preventDefault();
        const {min, max, step} = this.#options;
        const delta = wheelHelper(e, step);
        const newV = clamp(stepify(this.#lastV + delta, v => v, step), min, max);
        setter.setValue(newV);
      },
    }));
    this.#svgElem = this.$('svg');
    this.#originElem = this.$('#muigui-origin');
    this.#ticksElem = this.$('#muigui-ticks');
    this.#thicksElem = this.$('#muigui-thicks');
    this.#numbersElem = this.$('#muigui-numbers');
    this.#leftGradElem = this.$('#muigui-left-grad');
    this.#rightGradElem = this.$('#muigui-right-grad');
    this.setOptions(options);
    let startV;
    addTouchEvents(this.domElement, {
      onDown: () => {
        startV = this.#lastV;
      },
      onMove: (e) => {
        const {min, max, unitSize, unit, step} = this.#options;
        const newV = clamp(stepify(startV - e.dx / unitSize * unit, v => v, step), min, max);
        setter.setValue(newV);
      },
    });
    addKeyboardEvents(this.domElement, {
      onDown: (e) => {
        const {min, max, step} = this.#options;
        const newV = clamp(stepify(this.#lastV + e.dx * step, v => v, step), min, max);
        setter.setValue(newV);
      },
    });
    onResizeSVGNoScale(this.#svgElem, 0.5, 0, ({rect: {width}}) => {
      this.#leftGradElem.setAttribute('x', -width / 2);
      this.#rightGradElem.setAttribute('x', width / 2 - 20);
      this.#minusSize = computeSizeOfMinus(this.#numbersElem);
      this.#width = width;
      this.#updateSlider();
    });
  }
  // |--------V--------|
  // . . | . . . | . . . |
  //
  #updateSlider() {
    // There's no size if ResizeObserver has not fired yet.
    if (!this.#width || this.#lastV === undefined) {
      return;
    }
    const {
      labelFn,
      limits,
      min,
      max,
      orientation,
      tickHeight,
      ticksPerUnit,
      unit,
      unitSize,
      thicksColor,
    } = this.#options;
    const unitsAcross = Math.ceil(this.#width / unitSize);
    const center = this.#lastV;
    const centerUnitSpace = center / unit;
    const startUnitSpace = Math.round(centerUnitSpace - unitsAcross);
    const endUnitSpace = startUnitSpace + unitsAcross * 2;
    const start = startUnitSpace * unitSize;
    const end = endUnitSpace * unitSize;
    const minUnitSpace = limits ? min * unitSize / unit : start;
    const maxUnitSpace = limits ? max * unitSize / unit : end;
    const height = labelFn(1) === '' ? 10 : 5;
    if (ticksPerUnit > 1) {
      this.#ticksElem.setAttribute('d', createSVGTicks(start, end, unitSize / ticksPerUnit, minUnitSpace, maxUnitSpace, height * tickHeight));
    }
    this.#thicksElem.style.stroke =  thicksColor; //setAttribute('stroke', thicksColor);
    this.#thicksElem.setAttribute('d', createSVGTicks(start, end, unitSize, minUnitSpace, maxUnitSpace, height));
    this.#numbersElem.innerHTML = createSVGNumbers(start, end, unitSize, unit, this.#minusSize, minUnitSpace, maxUnitSpace, labelFn);
    this.#originElem.setAttribute('transform', `translate(${-this.#lastV * unitSize / unit} 0)`);
    this.#svgElem.classList.toggle('muigui-slider-up', orientation === 'up');
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
