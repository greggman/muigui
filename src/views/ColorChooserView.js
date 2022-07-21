import { createElem } from '../libs/elem.js';
import { addTouchEvents } from '../libs/touch.js';
import { clamp } from '../libs/utils.js';
import View from './View.js';
import {
  hexToUint8RGB,
  hexToFloatRGB,
  hslToRgbUint8,
  hsv01ToRGBFloat,
  rgbFloatToHSV01,
  rgbUint8ToHsl,
  floatRGBToHex,
  uint8RGBToHex,
} from '../libs/color-utils.js';

const svg = `

<svg tabindex="0" viewBox="0 0 64 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <linearGradient id="muigui-color-chooser-light-dark" x1="0" x2="0" y1="0" y2="1">
      <stop stop-color="rgba(0,0,0,0)" offset="0%"/>
      <stop stop-color="#000" offset="100%"/>
    </linearGradient>
    <linearGradient id="muigui-color-chooser-hue">
      <stop stop-color="hsl(60, 0%, 100%)" offset="0%"/>
      <stop stop-color="hsl(60, 100%, 50%)" offset="100%"/>
    </linearGradient>

    <rect width="64" height="48" fill="url(#muigui-color-chooser-hue)"/>
    <rect width="64" height="48" fill="url(#muigui-color-chooser-light-dark)"/>
    <circle r="4" class="muigui-color-chooser-circle"/>
</svg>
<svg tabindex="0" viewBox="0 0 64 6" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <linearGradient id="muigui-color-chooser-hues" x1="0" x2="1" y1="0" y2="0">
      <stop stop-color="hsl(0,100%,50%)" offset="0%"/>
      <stop stop-color="hsl(60,100%,50%)" offset="16.666%"/>
      <stop stop-color="hsl(120,100%,50%)" offset="33.333%"/>
      <stop stop-color="hsl(180,100%,50%)" offset="50%"/>
      <stop stop-color="hsl(240,100%,50%)" offset="66.666%"/>
      <stop stop-color="hsl(300,100%,50%)" offset="83.333%"/>
      <stop stop-color="hsl(360,100%,50%)" offset="100%"/>
    </linearGradient>
    <rect y="1" width="64" height="4" fill="url('#muigui-color-chooser-hues')"/>
    <g class="muigui-color-chooser-cursor">
      <rect x="-3" width="6" height="6" />
    </g>
</svg>
`;

export default class ColorChooserView extends View {
  constructor(setter) {
    super(createElem('div', {
      innerHTML: svg,
    }));
    this._satLevelElem = this.domElement.children[0];
    this._hueUIElem = this.domElement.children[1];
    this._circleElem = this.domElement.querySelector('.muigui-color-chooser-circle');
    this._hueElem = this.domElement.querySelector('#muigui-color-chooser-hue');
    this._hueCursorElem = this.domElement.querySelector('.muigui-color-chooser-cursor');

    const handleSatLevelChange = (e) => {
      const s = clamp(e.nx, 0, 1);
      const v = clamp(e.ny, 0, 1);
      this._hsv[1] = s;
      this._hsv[2] = (1 - v);
      this._skipHueUpdate = true;
      setter.setValue(floatRGBToHex(hsv01ToRGBFloat(this._hsv)));
    };

    const handleHueChange = (e) => {
      const h = clamp(e.nx, 0, 1);
      this._hsv[0] = h;
      this._skipSatLevelUpdate = true;
      setter.setValue(floatRGBToHex(hsv01ToRGBFloat(this._hsv)));
    };

    addTouchEvents(this._satLevelElem, {
      onDown: handleSatLevelChange,
      onMove: handleSatLevelChange,
    });
    addTouchEvents(this._hueUIElem, {
      onDown: handleHueChange,
      onMove: handleHueChange,
    });
  }
  updateDisplay(newV) {
    if (!this._hsv) {
      this._hsv = rgbFloatToHSV01(hexToFloatRGB(newV));
    }
    {
      const [h, s, v] = rgbFloatToHSV01(hexToFloatRGB(newV));
      // Don't copy the hue if it was un-computable.
      if (!this._skipHueUpdate) {
        this._hsv[0] = s > 0.001 && v > 0.001 ? h : this._hsv[0];
      }
      if (!this._skipSatLevelUpdate) {
        this._hsv[1] = s;
        this._hsv[2] = v;
      }
    }
    {
      const [h, s, v] = this._hsv;
      if (!this._skipHueUpdate) {
        this._hueCursorElem.setAttribute('transform', `translate(${h * 64}, 0)`);
        this._hueElem.children[0].setAttribute('stop-color', `hsl(${h * 360}, 0%, 100%)`);
        this._hueElem.children[1].setAttribute('stop-color', `hsl(${h * 360}, 100%, 50%)`);
      }
      if (!this._skipSatLevelUpdate) {
        this._circleElem.setAttribute('cx', `${s * 64}`);
        this._circleElem.setAttribute('cy', `${(1 - v) * 48}`);
      }
    }
    this._skipHueUpdate = false;
    this._skipSatLevelUpdate = false;
  }
}
