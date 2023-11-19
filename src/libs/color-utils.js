const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;
const fract = v => v >= 0 ? v % 1 : 1 - (v % 1);

const f0 = v => +v.toFixed(0);  // converts to string (eg 1.2 => "1"), then converts back to number (eg, "1.200" => 1.2)
const f3 = v => +v.toFixed(3);  // converts to string (eg 1.2 => "1.200"), then converts back to number (eg, "1.200" => 1.2)

const hexToUint32RGB = v => (parseInt(v.substring(1, 3), 16) << 16) |
                            (parseInt(v.substring(3, 5), 16) << 8 ) |
                            (parseInt(v.substring(5, 7), 16)      );
const uint32RGBToHex = v => `#${(Math.round(v)).toString(16).padStart(6, '0')}`;

export const hexToUint8RGB = v => [
    parseInt(v.substring(1, 3), 16),
    parseInt(v.substring(3, 5), 16),
    parseInt(v.substring(5, 7), 16),
];
export const uint8RGBToHex = v => `#${Array.from(v).map(v => v.toString(16).padStart(2, '0')).join('')}`;

export const hexToFloatRGB = v => hexToUint8RGB(v).map(v => f3(v / 255));
export const floatRGBToHex = v => uint8RGBToHex(Array.from(v).map(v => Math.round(clamp(v * 255, 0, 255))));

const hexToObjectRGB = v => ({
  r: parseInt(v.substring(1, 3), 16) / 255,
  g: parseInt(v.substring(3, 5), 16) / 255,
  b: parseInt(v.substring(5, 7), 16) / 255,
});
const scaleAndClamp = v => clamp(Math.round(v * 255), 0, 255).toString(16).padStart(2, '0');
const objectRGBToHex = v => `#${scaleAndClamp(v.r)}${scaleAndClamp(v.g)}${scaleAndClamp(v.b)}`;

const hexToCssRGB = v => `rgb(${hexToUint8RGB(v).join(', ')})`;
const cssRGBRegex = /^\s*rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/;
const cssRGBToHex = v => {
  const m = cssRGBRegex.exec(v);
  return uint8RGBToHex([m[1], m[2], m[3]].map(v => parseInt(v)));
};
const cssRGBARegex = /^\s*rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/;

const hexToCssHSL = v => {
  const hsl = rgbUint8ToHsl(hexToUint8RGB(v)).map(v => f0(v));
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
};
const cssHSLRegex = /^\s*hsl\(\s*(\d+)(?:deg|)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)\s*$/;
const cssHSLARegex = /^\s*hsl\(\s*(\d+)(?:deg|)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)\s*$/;

const hex3DigitTo6Digit = v => `${v[0]}${v[0]}${v[1]}${v[1]}${v[2]}${v[2]}`;
const cssHSLToHex = v => {
  const m = cssHSLRegex.exec(v);
  const rgb = hslToRgbUint8([m[1], m[2], m[3]].map(v => parseFloat(v)));
  return uint8RGBToHex(rgb);
};

const euclideanModulo = (v, n) => ((v % n) + n) % n;

export function hslToRgbUint8([h, s, l]) {
  h = euclideanModulo(h, 360);
  s = clamp(s / 100, 0, 1);
  l = clamp(l / 100, 0, 1);

  const a = s * Math.min(l, 1 - l);

  function f(n) {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  }

  return [f(0), f(8), f(4)].map(v => Math.round(v * 255));
}

export function rgbFloatToHsl01([r, g, b]) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (min + max) * 0.5;
  const d = max - min;
  let h = 0;
  let s = 0;

  if (d !== 0) {
    s = (l === 0 || l === 1)
        ? 0
        : (max - l) / Math.min(l, 1 - l);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4;
    }
  }

  return [h / 6, s, l];
}

export const rgbUint8ToHsl = (rgb) => {
  const [h, s, l] = rgbFloatToHsl01(rgb.map(v => v / 255));
  return [h * 360, s * 100, l * 100];
};

export function hsv01ToRGBFloat([hue, sat, val]) {
  sat = clamp(sat, 0, 1);
  val = clamp(val, 0, 1);
  return [hue, hue + 2 / 3, hue + 1 / 3].map(
      v => lerp(1, clamp(Math.abs(fract(v) * 6 - 3.0) - 1, 0, 1), sat) * val
  );
}

const round3 = v => Math.round(v * 1000) / 1000;

export function rgbFloatToHSV01([r, g, b]) {
  const p = b > g
      ? [b, g, -1, 2 / 3]
      : [g, b, 0, -1 / 3];
  const q = p[0] > r
      ? [p[0], p[1], p[3], r]
      : [r, p[1], p[2], p[0]];
  const d = q[0] - Math.min(q[3], q[1]);
  return [
    Math.abs(q[2] + (q[3] - q[1]) / (6 * d + Number.EPSILON)),
    d / (q[0] + Number.EPSILON),
    q[0],
  ].map(round3);
}

window.hsv01ToRGBFloat = hsv01ToRGBFloat;
window.rgbFloatToHSV01 = rgbFloatToHSV01;

// Yea, meh!
export const hasAlpha = format => format.endsWith('a') || format.startsWith('hex8');

const cssStringFormats = [
  { re: /^#(?:[0-9a-f]){6}$/i, format: 'hex6' },
  { re: /^(?:[0-9a-f]){6}$/i, format: 'hex6-no-hash' },
  { re: /^#(?:[0-9a-f]){8}$/i, format: 'hex8' },
  { re: /^(?:[0-9a-f]){8}$/i, format: 'hex8-no-hash' },
  { re: /^#(?:[0-9a-f]){3}$/i, format: 'hex3' },
  { re: /^(?:[0-9a-f]){3}$/i, format: 'hex3-no-hash' },
  { re: cssRGBRegex, format: 'css-rgb' },
  { re: cssHSLRegex, format: 'css-hsl' },
  { re: cssRGBARegex, format: 'css-rgba' },
  { re: cssHSLARegex, format: 'css-hsla' },
];

function guessStringColorFormat(v) {
  for (const formatInfo of cssStringFormats) {
    if (formatInfo.re.test(v)) {
      return formatInfo;
    }
  }
  return undefined;
}

export function guessFormat(v) {
  switch (typeof v) {
    case 'number':
      console.warn('can not reliably guess format based on a number. You should pass in a format like {format: "uint32-rgb"} or {format: "uint32-rgb"}');
      return v <= 0xFFFFFF ? 'uint32-rgb' : 'uint32-rgba';
    case 'string': {
      const formatInfo = guessStringColorFormat(v.trim());
      if (formatInfo) {
        return formatInfo.format;
      }
      break;
    }
    case 'object':
      if (v instanceof Uint8Array || v instanceof Uint8ClampedArray) {
        if (v.length === 3) {
          return 'uint8-rgb';
        } else if (v.length === 4) {
          return 'uint8-rgba';
        }
      } else if (v instanceof Float32Array) {
        if (v.length === 3) {
          return 'float-rgb';
        } else if (v.length === 4) {
          return 'float-rgba';
        }
      } else if (Array.isArray(v)) {
        if (v.length === 3) {
          return 'float-rgb';
        } else if (v.length === 4) {
          return 'float-rgba';
        }
      } else {
        if ('r' in v && 'g' in v && 'b' in v) {
          if ('a' in v) {
            return 'object-rgba';
          } else {
            return 'object-rgb';
          }
        }
      }
  }
  throw new Error(`unknown color format: ${v}`);
}

function fixHex6(v) {
  return v.trim(v);
  //const formatInfo = guessStringColorFormat(v.trim());
  //const fix = formatInfo ? formatInfo.fix : v => v;
  //return fix(v.trim());
}

function hex6ToHex3(hex6) {
  return (hex6[1] === hex6[2] &&
          hex6[3] === hex6[4] &&
          hex6[5] === hex6[6])
      ? `#${hex6[1]}${hex6[3]}${hex6[5]}`
      : hex6;
}

const hex3RE = /^(#|)([0-9a-f]{3})$/i;
function hex3ToHex6(hex3) {
  const m = hex3RE.exec(hex3);
  if (m) {
    const [, , m2] = m;
    return `#${hex3DigitTo6Digit(m2)}`;
  }
  return hex3;
}

function fixHex3(v) {
  return hex6ToHex3(fixHex6(v));
}

const strToRGBObject = (s) => {
  try {
    const json = s.replace(/([a-z])/g, '"$1"');
    const rgb = JSON.parse(json);
    if (Number.isNaN(rgb.r) || Number.isNaN(rgb.g) || Number.isNaN(rgb.b)) {
      throw new Error('not {r, g, b}');
    }
    return [true, rgb];
  } catch (e) {
    return [false];
  }
};

const strToCssRGB = s => {
  const m = cssRGBRegex.exec(s);
  if (!m) {
    return [false];
  }
  const v = [m[1], m[2], m[3]].map(v => parseInt(v));
  const outOfRange = v.find(v => v > 255);
  return [!outOfRange, `rgb(${v.join(', ')})`];
};

const strToCssHSL = s => {
  const m = cssHSLRegex.exec(s);
  if (!m) {
    return [false];
  }
  const v = [m[1], m[2], m[3]].map(v => parseFloat(v));
  const outOfRange = v.find(v => Number.isNaN(v));
  return [!outOfRange, `hsl(${v[0]}, ${v[1]}%, ${v[2]}%)`];
};

const rgbObjectToStr = rgb => {
  return `{r:${f3(rgb.r)}, g:${f3(rgb.g)}, b:${f3(rgb.b)}}`;
};

const strTo3IntsRE = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*$/;
const strTo3Ints = s => {
  const m = strTo3IntsRE.exec(s);
  if (!m) {
    return [false];
  }
  const v = [m[1], m[2], m[3]].map(v => parseInt(v));
  const outOfRange = v.find(v => v > 255);
  return [!outOfRange, v];
};

const strTo3Floats = s => {
  const numbers = s.split(',').map(s => s.trim());
  const v = numbers.map(v => parseFloat(v));
  if (v.length !== 3) {
    return [false];
  }
  // Note: using isNaN not Number.isNaN
  const badNdx = numbers.findIndex(v => isNaN(v));
  return [badNdx < 0, v.map(v => f3(v))];
};

const strToUint32RGBRegex = /^\s*(?:0x){0,1}([0-9a-z]{1,6})\s*$/i;
const strToUint32RGB = s => {
  const m = strToUint32RGBRegex.exec(s);
  if (!m) {
    return [false];
  }
  return [true, parseInt(m[1], 16)];
};

const hexRE = /^\s*#[a-f0-9]{6}\s*$|^\s*#[a-f0-9]{3}\s*$/i;
const hexNoHashRE = /^\s*[a-f0-9]{6}\s*$/i;

// For each format converter
//
// fromHex/toHex convert from/to '#RRGGBB'
//
//  fromHex converts from the string '#RRBBGG' to the format
//     (eg: for uint32-rgb, '#123456' becomes 0x123456)
//
//  toHex converts from the format to '#RRGGBB'
//     (eg: for uint8-rgb, [16, 33, 50] becomes '#102132')
//
//
// fromStr/toStr convert from/to what's in the input[type=text] element
//
//  toStr converts from the format to its string representation
//     (eg, for object-rgb, {r: 1, g: 0.5, b:0} becomes "{r: 1, g: 0.5, b:0}")
//                           ^object                     ^string
//
//  fromStr converts its string representation to its format
//     (eg, for object-rgb) "{r: 1, g: 0.5, b:0}" becomes {r: 1, g: 0.5, b:0})
//                           ^string                      ^object
//     fromString returns an array which is [valid, v]
//     where valid is true if the string was a valid and v is the converted
//     format if v is true.
//
// Note: toStr should convert to "ideal" form (whatever that is).
//    (eg, for css-rgb
//    "{   r:  0.10000, g: 001, b:    0}" becomes "{r: 0.1, g: 1, b: 0}"
//    notice that css-rgb is a string to a string
//    )
export const colorFormatConverters = {
  'hex6': {
    color: {
      from: v => [true, v],
      to: fixHex6,
    },
    text: {
      from: v => [hexRE.test(v), v.trim()],
      to: v => v,
    },
  },
  'hex3': {
    color: {
      from: v => [true, fixHex3(v)],
      to: hex3ToHex6,
    },
    text: {
      from: v => [hexRE.test(v), hex6ToHex3(v.trim())],
      to: v => v,
    },
  },
  'hex6-no-hash': {
    color: {
      from: v => [true, v.substring(1)],
      to: v => `#${fixHex6(v)}`,
    },
    text: {
      from: v => [hexNoHashRE.test(v), v.trim()],
      to: v => v,
    },
  },
  'hex3-no-hash': {
    color: {
      from: v => [true, fixHex3(v).substring(1)],
      to: hex3ToHex6,
    },
    text: {
      from: v => [hexNoHashRE.test(v), hex6ToHex3(v.trim())],
      to: v => v,
    },
  },
  'uint32-rgb': {
    color: {
      from: v => [true, hexToUint32RGB(v)],
      to: uint32RGBToHex,
    },
    text: {
      from: v => strToUint32RGB(v),
      to: v => `0x${v.toString(16).padStart(6, '0')}`,
    },
  },
  'uint8-rgb': {
    color: {
      from: v => [true, hexToUint8RGB(v)],
      to: uint8RGBToHex,
    },
    text: {
      from: strTo3Ints,
      to: v => v.join(', '),
    },
  },
  'float-rgb': {
    color: {
      from: v => [true, hexToFloatRGB(v)],
      to: floatRGBToHex,
    },
    text: {
      from: strTo3Floats,
      // need Array.from because map of Float32Array makes a Float32Array
      to: v => Array.from(v).map(v => f3(v)).join(', '),
    },
  },
  'object-rgb': {
    color: {
      from: v => [true, hexToObjectRGB(v)],
      to: objectRGBToHex,
    },
    text: {
      from: strToRGBObject,
      to: rgbObjectToStr,
    },
  },
  'css-rgb': {
    color: {
      from: v => [true, hexToCssRGB(v)],
      to: cssRGBToHex,
    },
    text: {
      from: strToCssRGB,
      to: v => strToCssRGB(v)[1],
    },
  },
  'css-hsl': {
    color: {
      from: v => [true, hexToCssHSL(v)],
      to: cssHSLToHex,
    },
    text: {
      from: strToCssHSL,
      to: v => strToCssHSL(v)[1],
    },
  },
};