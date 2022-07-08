const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const f3 = v => +v.toFixed(3);  // converts to string (eg 1.2 => "1.200"), then converts back to number (eg, "1.200" => 1.2)

const hexToUint32RGB = v => (parseInt(v.substring(1, 3), 16) << 16) |
                            (parseInt(v.substring(3, 5), 16) << 8 ) |
                            (parseInt(v.substring(5, 7), 16)      ) ;
const uint32RGBToHex = v => `#${(v | 0).toString(16).padStart(6, '0')}`;

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
const scaleAndClamp = v => clamp(v * 255 | 0, 0, 255).toString(16).padStart(2, '0');
const objectRGBToHex = v => `#${scaleAndClamp(v.r)}${scaleAndClamp(v.g)}${scaleAndClamp(v.b)}`

const hexToCssRGB = v => `rgb(${hexToUint8RGB(v).join(', ')})`;
const cssRGBRegex = /^\s*rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/;
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

function fixHex(v) {
  const formatInfo = guessStringColorFormat(v.trim());
  const fix = formatInfo ? formatInfo.fix : v => v;
  return fix(v.trim());
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
  'hex':        {
    fromHex: v => v,
    toHex: v => fixHex(v),
    fromStr: v => [hexRE.test(v), v],
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
    fromStr: v => strTo3Ints(v),
    toStr: v => v.join(', '),
  },
  'float-rgb': {
    fromHex: hexToFloatRGB,
    toHex: floatRGBToHex,
    fromStr: v => strTo3Floats(v),
    // We need array from because map of Float32Array makes a Float32Array
    toStr: v => Array.from(v).map(v => f3(v)).join(', '),
  },
  'object-rgb': {
    fromHex: hexToObjectRGB,
    toHex: objectRGBToHex,
    fromStr: v => strToRGBObject(v),
    toStr: v => rgbObjectToStr(v),
  },
  'css-rgb': {
    fromHex: hexToCssRGB,
    toHex: cssRGBToHex,
    fromStr: v => strToCssRGB(v),
    toStr: v => strToCssRGB(v)[1],
  },
  'hex-no-hash': {
    fromHex: v => v.substring(1),
    toHex: v => `#${fixHex(v)}`,
    fromStr: v => [hexNoHashRE.test(v), v.trim()],
    toStr: v => v,
  },
};