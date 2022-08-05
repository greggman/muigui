import { identity } from '../libs/conversions.js';
import { createElem } from '../libs/elem.js';
import { addKeyboardEvents } from '../libs/keyboard.js';
import { arc } from '../libs/svg.js';
import { addTouchEvents } from '../libs/touch.js';
import { createWheelHelper } from '../libs/wheel.js';
import { clamp, copyExistingProperties, euclideanModulo, lerp, stepify } from '../libs/utils.js';
import EditView from './EditView.js';

const svg = `
<svg tabindex="0" viewBox="-32 -32 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <!--<circle id="muigui-outline" cx="0" cy="0" r="28.871" class="muigui-direction-circle"/>-->
    <path id="muigui-range" class="muigui-direction-range" />
    <g id="muigui-arrow">
        <g transform="translate(-32, -32)">
          <path d="M31.029,33.883c-1.058,-0.007 -1.916,-0.868 -1.916,-1.928c0,-1.065 0.864,-1.929 1.929,-1.929c0.204,0 0.401,0.032 0.586,0.091l14.729,-0l0,-2.585l12.166,4.468l-12.166,4.468l0,-2.585l-15.315,0l-0.013,0Z" class="muigui-direction-arrow"/>
        </g>
    </g>
</svg>
`;

const twoPiMod = v => euclideanModulo(v + Math.PI, Math.PI * 2) - Math.PI;

export default class DirectionView extends EditView {
  #arrowElem;
  #rangeElem;
  #lastV;
  #wrap;
  #options = {
    step: 1,
    min: -180,
    max:  180,

    /*
       --------
      /  -π/2  \
     /     |    \
    |<- -π *     |
    |      * 0 ->|     zero is down the positive X axis
    |<- +π *     |
     \     |    /
      \   π/2  /
       --------
    */
    dirMin: -Math.PI,
    dirMax:  Math.PI,
    //dirMin: Math.PI * 0.5,
    //dirMax: Math.PI * 2.5,
    //dirMin: -Math.PI * 0.75,  // test 10:30 to 7:30
    //dirMax:  Math.PI * 0.75,
    //dirMin:  Math.PI * 0.75,   // test 7:30 to 10:30
    //dirMax: -Math.PI * 0.75,
    //dirMin: -Math.PI * 0.75,  // test 10:30 to 1:30
    //dirMax: -Math.PI * 0.25,
    //dirMin:  Math.PI * 0.25,   // test 4:30 to 7:30
    //dirMax:  Math.PI * 0.75,
    //dirMin:  Math.PI * 0.75,   // test 4:30 to 7:30
    //dirMax:  Math.PI * 0.25,
    wrap: undefined,
    converters: identity,
  };

  constructor(setter, options = {}) {
    const wheelHelper = createWheelHelper();
    super(createElem('div', {
      className: 'muigui-direction',
      innerHTML: svg,
      onWheel: e => {
        e.preventDefault();
        const {min, max, step} = this.#options;
        const delta = wheelHelper(e, step);
        let tempV = this.#lastV + delta;
        if (this.#wrap) {
          tempV = euclideanModulo(tempV - min, max - min) + min;
        }
        const newV = clamp(stepify(tempV, v => v, step), min, max);
        setter.setValue(newV);
      },
    }));
    const handleTouch = (e) => {
      const {min, max, step, dirMin, dirMax} = this.#options;
      const nx = e.nx * 2 - 1;
      const ny = e.ny * 2 - 1;
      const a = Math.atan2(ny, nx);

      const center = (dirMin + dirMax) / 2;

      const centeredAngle = twoPiMod(a - center);
      const centeredStart = twoPiMod(dirMin - center);
      const diff = dirMax - dirMin;

      const n = clamp((centeredAngle - centeredStart) / (diff), 0, 1);
      const newV = stepify(min + (max - min) * n, v => v, step);
      setter.setValue(newV);
    };
    addTouchEvents(this.domElement, {
      onDown: handleTouch,
      onMove: handleTouch,
    });
    addKeyboardEvents(this.domElement, {
      onDown: (e) => {
        const {min, max, step} = this.#options;
        const newV = clamp(stepify(this.#lastV + e.dx * step, v => v, step), min, max);
        setter.setValue(newV);
      },
    });
    this.#arrowElem = this.$('#muigui-arrow');
    this.#rangeElem = this.$('#muigui-range');
    this.setOptions(options);
  }
  updateDisplay(v) {
    this.#lastV = v;
    const {min, max} = this.#options;
    const n = (v - min) / (max - min);
    const angle = lerp(this.#options.dirMin, this.#options.dirMax, n);
    this.#arrowElem.style.transform = `rotate(${angle}rad)`;
  }
  setOptions(options) {
    copyExistingProperties(this.#options, options);
    const {dirMin, dirMax, wrap} = this.#options;
    this.#wrap = wrap !== undefined
       ? wrap
       : Math.abs(dirMin - dirMax) >= Math.PI * 2 - Number.EPSILON;
    const [min, max] = dirMin < dirMax ? [dirMin, dirMax] : [dirMax , dirMin];
    this.#rangeElem.setAttribute('d', arc(0, 0, 28.87, min, max));
  }
}
