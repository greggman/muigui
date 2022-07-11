const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const f0 = v => +v.toFixed(0);  // converts to string (eg 1.2 => "1"), then converts back to number (eg, "1.200" => 1.2)
const f3 = v => +v.toFixed(3);  // converts to string (eg 1.2 => "1.200"), then converts back to number (eg, "1.200" => 1.2)

const hexToUint32RGB = v => (parseInt(v.substring(1, 3), 16) << 16) |
                            (parseInt(v.substring(3, 5), 16) << 8 ) |
                            (parseInt(v.substring(5, 7), 16)      ) ;
const uint32RGBToHex = v => `#${(Math.round(v)).toString(16).padStart(6, '0')}`;

const hexToUint8RGB = v => [parseInt(v.substring(1, 3), 16),
                            parseInt(v.substring(3, 5), 16),
                            parseInt(v.substring(5, 7), 16)];
const uint8RGBToHex = v => `#${Array.from(v).map(v => v.toString(16).padStart(2, '0')).join('')}`;

const hexToFloatRGB = v => hexToUint8RGB(v).map(v => f3(v / 255));
const floatRGBToHex = v => uint8RGBToHex(Array.from(v).map(v => Math.round(clamp(v * 255, 0, 255))));

const hexToObjectRGB = v => ({
  r: parseInt(v.substring(1, 3), 16) / 255,
  g: parseInt(v.substring(3, 5), 16) / 255,
  b: parseInt(v.substring(5, 7), 16) / 255,
});
const scaleAndClamp = v => clamp(Math.round(v * 255), 0, 255).toString(16).padStart(2, '0');
const objectRGBToHex = v => `#${scaleAndClamp(v.r)}${scaleAndClamp(v.g)}${scaleAndClamp(v.b)}`

const hexToCssRGB = v => `rgb(${hexToUint8RGB(v).join(', ')})`;
const cssRGBRegex = /^\s*rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/;
const cssRGBToHex = v => {
  const m = cssRGBRegex.exec(v);
  return uint8RGBToHex([m[1], m[2], m[3]].map(v => parseInt(v)));
};

const hexToCssHSL = v => {
  const hsl = rgbToHsl(hexToUint8RGB(v)).map(v => f0(v));  
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
};
const cssHSLRegex = /^\s*hsl\(\s*(\d+)(?:deg|)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)\s*$/;

const hex3DigitTo6Digit = v => `${v[0]}${v[0]}${v[1]}${v[1]}${v[2]}${v[2]}`;
const cssHSLToHex = v => {
  const m = cssHSLRegex.exec(v);
  const rgb = hslToRgb([m[1], m[2], m[3]].map(v => parseFloat(v)));
  return uint8RGBToHex(rgb);
};

function hslToRgb([hue, sat, light]) {
  hue = hue % 360;

  if (hue < 0) {
    hue += 360;
  }

  sat /= 100;
  light /= 100;

  function f(n) {
    const k = (n + hue/30) % 12;
    const a = sat * Math.min(light, 1 - light);
    return light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  }

  return [f(0), f(8), f(4)].map(v => Math.round(v * 255));
}

function rgbToHsl(rgb) {
  const [red, green, blue] = rgb.map(v => v / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  let [hue, sat, light] = [NaN, 0, (min + max)/2];
  const d = max - min;

  if (d !== 0) {
    sat = (light === 0 || light === 1)
        ? 0
        : (max - light) / Math.min(light, 1 - light);

    switch (max) {
      case red:   hue = (green - blue) / d + (green < blue ? 6 : 0); break;
      case green: hue = (blue - red) / d + 2; break;
      case blue:  hue = (red - green) / d + 4;
    }

    hue = hue * 60;
  } else {
    hue = 0;
    sat = 0;
  }

  return [hue, sat * 100, light * 100];
}

const cssStringFormats = [
  { re: /^#(?:[0-9a-f]){6}$/i, format: 'hex6' },
  { re: /^(?:[0-9a-f]){6}$/i, format: 'hex6-no-hash' },
  { re: /^#(?:[0-9a-f]){3}$/i, format: 'hex3' },
  { re: /^(?:[0-9a-f]){3}$/i, format: 'hex3-no-hash' },
  { re: cssRGBRegex, format: 'css-rgb' },
  { re: cssHSLRegex, format: 'css-hsl' },
];

function guessStringColorFormat(v) {
  for (const formatInfo of cssStringFormats) {
    if (formatInfo.re.test(v)) {
      return formatInfo;
    }
  }
}

export function guessFormat(v) {
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
      if (v instanceof Uint8Array || v instanceof Uint8ClampedArray) {
        if (v.length === 3) {
          return 'uint8-rgb'
        }
      } else if (v instanceof Float32Array) {
        if (v.length === 3) {
          return 'float-rgb';
        }
      } else if (Array.isArray(v)) {
        if (v.length === 3) {
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

const hex3RE = /^(#|)([0-9a-f]{3})$/i
function hex3ToHex6(hex3) {
  const m = hex3RE.exec(hex3);
  if (m) {
    const [, m1, m2] = m;
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
  } catch(e) {
    return [false];
  }
}

const strToCssRGB = s => {
  const m = cssRGBRegex.exec(s);
  if (!m) {
    return [false];
  }
  const v = [m[1], m[2], m[3]].map(v => parseInt(v));
  const outOfRange = v.find(v => v > 255);
  return [!outOfRange, `rgb(${v.join(', ')})`];
}

const strToCssHSL = s => {
  const m = cssHSLRegex.exec(s);
  if (!m) {
    return [false];
  }
  const v = [m[1], m[2], m[3]].map(v => parseFloat(v));
  const outOfRange = v.find(v => Number.isNaN(v));
  return [!outOfRange, `hsl(${v[0]}, ${v[1]}%, ${v[2]}%)`];
}

const rgbObjectToStr = rgb => {
  return `{r:${f3(rgb.r)}, g:${f3(rgb.g)}, b:${f3(rgb.b)}}`;
}

const strTo3IntsRE = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*$/
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
  const v = s.split(',').map(v => parseFloat(v.trim()));
  if (v.length !== 3) {
    return [false];
  }
  const badNdx = v.findIndex(v => Number.isNaN(v));
  return [badNdx < 0, v.map(v => f3(v))];
};

const strToUint32RGBRegex = /^\s*(?:0x){0,1}([0-9a-z]{6})\s*$/i;
const strToUint32RGB = s => {
  const m = strToUint32RGBRegex.exec(s);
  if (!m) {
    return [false];
  }
  return [true, parseInt(m[1], 16)];
}

const hexRE = /^\s*#[a-f0-9]{6}|#[a-f0-9]{3}\s*$/i;
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
    fromHex: v => v,
    toHex: fixHex6,
    fromStr: v => [hexRE.test(v), v.trim()],
    toStr: v => v,
  },
  'hex3': {
    fromHex: fixHex3,
    toHex: hex3ToHex6,
    fromStr: v => [hexRE.test(v), hex6ToHex3(v.trim())],
    toStr: v => v,
  },
  'hex6-no-hash': {
    fromHex: v => v.substring(1),
    toHex: v => `#${fixHex6(v)}`,
    fromStr: v => [hexNoHashRE.test(v), v.trim()],
    toStr: v => v,
  },
  'hex3-no-hash': {
    fromHex: v => fixHex3(v).substring(1),
    toHex: hex3ToHex6,
    fromStr: v => [hexNoHashRE.test(v), hex6ToHex3(v.trim())],
    toStr: v => v,
  },
  'uint32-rgb': {
    fromHex: hexToUint32RGB,
    toHex: uint32RGBToHex,
    fromStr: v => strToUint32RGB(v),
    toStr: v => `0x${v.toString(16).padStart(6, '0')}`,
  },
  'uint8-rgb': {
    fromHex: hexToUint8RGB,
    toHex: uint8RGBToHex,
    fromStr: strTo3Ints,
    toStr: v => v.join(', '),
  },
  'float-rgb': {
    fromHex: hexToFloatRGB,
    toHex: floatRGBToHex,
    fromStr: strTo3Floats,
    // We need Array.from because map of Float32Array makes a Float32Array
    toStr: v => Array.from(v).map(v => f3(v)).join(', '),
  },
  'object-rgb': {
    fromHex: hexToObjectRGB,
    toHex: objectRGBToHex,
    fromStr: strToRGBObject,
    toStr: rgbObjectToStr,
  },
  'css-rgb': {
    fromHex: hexToCssRGB,
    toHex: cssRGBToHex,
    fromStr: strToCssRGB,
    toStr: v => strToCssRGB(v)[1],
  },
  'css-hsl': {
    fromHex: hexToCssHSL,
    toHex: cssHSLToHex,
    fromStr: strToCssHSL,
    toStr: v => strToCssHSL(v)[1],
  },
};