import {
  createElem,
} from '../libs/elem.js';
import ValueController from './value-controller.js';

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const hexToUint32RGB = v => (parseInt(v.substring(1, 3), 16) << 24) |
                            (parseInt(v.substring(3, 5), 16) << 8 ) |
                            (parseInt(v.substring(5, 7), 16)      ) ;
const uint32RGBToHex = v => `#${(v | 0).toString(16).padStart(6, '0')}`;

const hexToUint8RGB = v => [parseInt(v.substring(1, 3), 16),
                            parseInt(v.substring(3, 5), 16),
                            parseInt(v.substring(5, 7), 16)];
const uint8RGBToHex = v => `#${v.map(v => v.toString(16).padStart(2, '0')).join('')}`;

const hexToFloatRGB = v => hexToUint8RGB(v).map(v => v / 255);
const floatRGBToHex = v => uint8RGBToHex(v.map(v => clamp(v * 255, 0, 255)));

const hexToObjectRGB = v => ({
  r: parseInt(v.substring(1, 3), 16) / 255,
  g: parseInt(v.substring(3, 5), 16) / 255,
  b: parseInt(v.substring(5, 7), 16) / 255,
});
const scaleAndClamp = v => clamp(v * 255 | 0, 0, 255).toString(16).padStart(2, '0');
const objectRGBToHex = v => `#${scaleAndClamp(v.r)}${scaleAndClamp(v.g)}${scaleAndClamp(v.b)}`

const hexToCssRGB = v => `rgb(${hexToUint8RGB(v)})`;
const cssRGBRegex = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
const cssRGBToHex = v => {
  const m = cssRGBRegex.exec(v);
  return uint8RGBToHex([m[1], m[2], m[3]].map(v => parseInt(v)));
};

const hex3DigitTo6Digit = v => `${v[0]}${v[0]}${v[1]}${v[1]}${v[2]}${v[2]}`;

const cssStringFormats = [
  { re: /^#(?:[0-9a-f]){6}$/i, format: 'hex', fix: v => v, },
  { re: /^(?:[0-9a-f]){6}$/i, format: 'hex-no-hash', fix: v => v, },
  { re: /^#(?:[0-9a-f]){3}$/i, format: 'hex', fix: v => `#${hex3DigitTo6Digit(v.substring(1))}`, },
  { re: /^(?:[0-9a-f]){3}$/i, format: 'hex-no-hash', fix: v => hex3DigitTo6Digit(v), },
  { re: cssRGBRegex, format: 'css-rgb', fix: v => v, },
];

function guessStringColorFormat(v) {
  for (const formatInfo of cssStringFormats) {
    if (formatInfo.re.test(v)) {
      return formatInfo;
    }
  }
}

function guessFormat(v) {
  switch (typeof v) {
    case 'number':
      return 'uint32-rgb';
    case 'string':
      const formatInfo = guessStringColorFormat(v.trim());
      if (formatInfo) {
        return formatInfo.format;
      }
      break;
    case 'object':
      if (v.length === 3) {
        if (Math.max(...v) > 1) {
          return 'uint8-rgb';
        } else {
          return 'float-rgb';
        }
      } else {
        if ('r' in v && 'g' in v && 'b' in v) {
          return 'object-rgb';
        }
      }
  }
  throw new Error(`unknown color format: ${v}`);
}

function fixHex(v) {
  const formatInfo = guessStringColorFormat(v.trim());
  const fix = formatInfo ? formatInfo.fix : v => v;
  return fix(v.trim());
}

const formatConverters = {
  'hex':        { fromHex: v => v,         toHex: v => fixHex(v) },
  'uint32-rgb': { fromHex: hexToUint32RGB, toHex: uint32RGBToHex },
  'uint8-rgb':  { fromHex: hexToUint8RGB,  toHex: uint8RGBToHex },
  'float-rgb':  { fromHex: hexToFloatRGB,  toHex: floatRGBToHex },
  'object-rgb': { fromHex: hexToObjectRGB, toHex: objectRGBToHex },
  'css-rgb':    { fromHex: hexToCssRGB,    toHex: cssRGBToHex },
  'hex-no-hash':{ fromHex: v => v.substring(1), toHex: v => `#${v}` },
};

export default class Color extends ValueController {
  constructor(object, property, format) {
    super(object, property, 'muigui-color');
    const root = this.domElement;
    const id = this.id;

    format = format || guessFormat(this.getValue());
    this._converters = formatConverters[format];
    const {fromHex} = this._converters;

    this._colorElem = createElem('input', {
      type: 'color',
      id,
      onInput: (e) => {
        this.setValue(fromHex(this._colorElem.value));
      },
      onChange: (e) => {
        this.setFinalValue(fromHex(this._colorElem.value));
      },
    });
    root.appendChild(createElem('div', {}, [this._colorElem]));

    this._textElem = createElem('input', {
      type: 'text',
      pattern: /[a-f0-9]{6}/i,
      onInput: (e) => {
        this.setValue(fromHex(`#${this._textElem.value}`));
      },
      onChange: (e) => {
        this.setFinalValue(fromHex(`#${this._textElem.value}`));
      },
    });
    root.appendChild(this._textElem);
    this.updateDisplay();
  }
  updateDisplay() {
    const newV = this._converters.toHex(super.getValue());
    this._textElem.value = newV.substring(1);
    this._colorElem.value = newV;
  }
}