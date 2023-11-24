import { createElem, getNewId } from '../libs/elem.js';
import { addTouchEvents } from '../libs/touch.js';
import { identity } from '../libs/conversions.js';
import { clamp } from '../libs/utils.js';
import EditView from './EditView.js';
import {
  hexToFloatRGB,
  hexToFloatRGBA,
  hsv01ToRGBFloat,
  hsva01ToRGBAFloat,
  rgbFloatToHSV01,
  rgbaFloatToHSVA01,
  floatRGBToHex,
  floatRGBAToHex,
  rgbaFloatToHsla01,
} from '../libs/color-utils.js';
import { copyExistingProperties } from '../libs/utils.js';

const svg = `
<svg class="muigui-checkered-background" tabindex="0" viewBox="0 0 64 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <linearGradient data-src="muigui-color-chooser-light-dark" x1="0" x2="0" y1="0" y2="1">
      <stop stop-color="rgba(0,0,0,0)" offset="0%"/>
      <stop stop-color="#000" offset="100%"/>
    </linearGradient>
    <linearGradient data-src="muigui-color-chooser-hue">
      <stop stop-color="hsl(60 0% 100% / 1)" offset="0%"/>
      <stop stop-color="hsl(60 100% 50% / 1)" offset="100%"/>
    </linearGradient>

    <rect width="64" height="48" data-target="muigui-color-chooser-hue"/>
    <rect width="64" height="48" data-target="muigui-color-chooser-light-dark"/>
    <circle r="4" class="muigui-color-chooser-circle"/>
</svg>
<svg tabindex="0" viewBox="0 0 64 6" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <linearGradient data-src="muigui-color-chooser-hues" x1="0" x2="1" y1="0" y2="0">
      <stop stop-color="hsl(0,100%,50%)" offset="0%"/>
      <stop stop-color="hsl(60,100%,50%)" offset="16.666%"/>
      <stop stop-color="hsl(120,100%,50%)" offset="33.333%"/>
      <stop stop-color="hsl(180,100%,50%)" offset="50%"/>
      <stop stop-color="hsl(240,100%,50%)" offset="66.666%"/>
      <stop stop-color="hsl(300,100%,50%)" offset="83.333%"/>
      <stop stop-color="hsl(360,100%,50%)" offset="100%"/>
    </linearGradient>
    <rect y="1" width="64" height="4" data-target="muigui-color-chooser-hues"/>
    <g class="muigui-color-chooser-hue-cursor">
      <rect x="-3" width="6" height="6" />
    </g>
</svg>
<svg class="muigui-checkered-background" tabindex="0" viewBox="0 0 64 6" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <linearGradient data-src="muigui-color-chooser-alpha" x1="0" x2="1" y1="0" y2="0">
      <stop stop-color="hsla(0,100%,100%,0)" offset="0%"/>
      <stop stop-color="hsla(0,100%,100%,1)" offset="100%"/>
    </linearGradient>
    <rect y="1" width="64" height="4" data-target="muigui-color-chooser-alpha"/>
    <g class="muigui-color-chooser-alpha-cursor">
      <rect x="-3" width="6" height="6" />
    </g>
</svg>
`;

function connectFillTargets(elem) {
  elem.querySelectorAll('[data-src]').forEach(srcElem => {
    const id = getNewId();
    srcElem.id = id;
    elem.querySelectorAll(`[data-target=${srcElem.dataset.src}]`).forEach(targetElem => {
      targetElem.setAttribute('fill', `url(#${id})`);
    });
  });
  return elem;
}

// Was originally going to make alpha an option. Issue is
// hard coded conversions?
export default class ColorChooserView extends EditView {
  #to;
  #from;
  #satLevelElem;
  #circleElem;
  #hueUIElem;
  #hueElem;
  #hueCursorElem;
  #alphaUIElem;
  #alphaElem;
  #alphaCursorElem;
  #hsva;
  #skipHueUpdate;
  #skipSatLevelUpdate;
  #skipAlphaUpdate;
  #options = {
    converters: identity,
    alpha: false,
  };
  #convertInternalToHex;
  #convertHexToInternal;

  constructor(setter, options) {
    super(createElem('div', {
      innerHTML: svg,
      className: 'muigui-no-scroll',
    }));
    this.#satLevelElem = this.domElement.children[0];
    this.#hueUIElem = this.domElement.children[1];
    this.#alphaUIElem = this.domElement.children[2];
    connectFillTargets(this.#satLevelElem);
    connectFillTargets(this.#hueUIElem);
    connectFillTargets(this.#alphaUIElem);
    this.#circleElem = this.$('.muigui-color-chooser-circle');
    this.#hueElem = this.$('[data-src=muigui-color-chooser-hue]');
    this.#hueCursorElem = this.$('.muigui-color-chooser-hue-cursor');
    this.#alphaElem = this.$('[data-src=muigui-color-chooser-alpha]');
    this.#alphaCursorElem = this.$('.muigui-color-chooser-alpha-cursor');

    const handleSatLevelChange = (e) => {
      const s = clamp(e.nx, 0, 1);
      const v = clamp(e.ny, 0, 1);
      this.#hsva[1] = s;
      this.#hsva[2] = (1 - v);
      this.#skipHueUpdate = true;
      this.#skipAlphaUpdate = true;
      const [valid, newV] = this.#from(this.#convertInternalToHex(this.#hsva));
      if (valid) {
        setter.setValue(newV);
      }
    };

    const handleHueChange = (e) => {
      const h = clamp(e.nx, 0, 1);
      this.#hsva[0] = h;
      this.#skipSatLevelUpdate = true;
      this.#skipAlphaUpdate = true;
      const [valid, newV] = this.#from(this.#convertInternalToHex(this.#hsva));
      if (valid) {
        setter.setValue(newV);
      }
    };

    const handleAlphaChange = (e) => {
      const a = clamp(e.nx, 0, 1);
      this.#hsva[3] = a;
      this.#skipHueUpdate = true;
      this.#skipSatLevelUpdate = true;
      const [valid, newV] = this.#from(this.#convertInternalToHex(this.#hsva));
      if (valid) {
        setter.setValue(newV);
      }
    };

    addTouchEvents(this.#satLevelElem, {
      onDown: handleSatLevelChange,
      onMove: handleSatLevelChange,
    });
    addTouchEvents(this.#hueUIElem, {
      onDown: handleHueChange,
      onMove: handleHueChange,
    });
    addTouchEvents(this.#alphaUIElem, {
      onDown: handleAlphaChange,
      onMove: handleAlphaChange,
    });
    this.setOptions(options);
  }
  updateDisplay(newV) {
    if (!this.#hsva) {
      this.#hsva = this.#convertHexToInternal(this.#to(newV));
    }
    {
      const [h, s, v, a = 1] = this.#convertHexToInternal(this.#to(newV));
      // Don't copy the hue if it was un-computable.
      if (!this.#skipHueUpdate) {
        this.#hsva[0] = s > 0.001 && v > 0.001 ? h : this.#hsva[0];
      }
      if (!this.#skipSatLevelUpdate) {
        this.#hsva[1] = s;
        this.#hsva[2] = v;
      }
      if (!this.#skipAlphaUpdate) {
        this.#hsva[3] = a;
      }
    }
    {
      const [h, s, v, a] = this.#hsva;
      const [hue, sat, lum] = rgbaFloatToHsla01(hsva01ToRGBAFloat(this.#hsva));

      if (!this.#skipHueUpdate) {
        this.#hueCursorElem.setAttribute('transform', `translate(${h * 64}, 0)`);
      }
      this.#hueElem.children[0].setAttribute('stop-color', `hsl(${hue * 360} 0% 100% / ${a})`);
      this.#hueElem.children[1].setAttribute('stop-color', `hsl(${hue * 360} 100% 50% / ${a})`);
      if (!this.#skipAlphaUpdate) {
        this.#alphaCursorElem.setAttribute('transform', `translate(${a * 64}, 0)`);
      }
      this.#alphaElem.children[0].setAttribute('stop-color', `hsl(${hue * 360} ${sat * 100}% ${lum * 100}% / 0)`);
      this.#alphaElem.children[1].setAttribute('stop-color', `hsl(${hue * 360} ${sat * 100}% ${lum * 100}% / 1)`);

      if (!this.#skipSatLevelUpdate) {
        this.#circleElem.setAttribute('cx', `${s * 64}`);
        this.#circleElem.setAttribute('cy', `${(1 - v) * 48}`);
      }
    }
    this.#skipHueUpdate = false;
    this.#skipSatLevelUpdate = false;
    this.#skipAlphaUpdate = false;
  }
  setOptions(options) {
    copyExistingProperties(this.#options, options);
    const {converters: {to, from}, alpha} = this.#options;
    this.#alphaUIElem.style.display = alpha ? '' : 'none';
    this.#convertInternalToHex = alpha
       ? v => floatRGBAToHex(hsva01ToRGBAFloat(v))
       : v => floatRGBToHex(hsv01ToRGBFloat(v));
    this.#convertHexToInternal = alpha
       ? v => rgbaFloatToHSVA01(hexToFloatRGBA(v))
       : v => rgbFloatToHSV01(hexToFloatRGB(v));
    this.#to = to;
    this.#from = from;
    return this;
  }
}
