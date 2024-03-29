export function removeArrayElem(array, value) {
  const ndx = array.indexOf(value);
  if (ndx) {
    array.splice(ndx, 1);
  }
  return array;
}

/**
 * Converts an camelCase or snake_case id to "camel case" or "snake case"
 * @param {string} id
 */
const underscoreRE = /_/g;
const upperLowerRE = /([A-Z])([a-z])/g;
export function idToLabel(id) {
  return id.replace(underscoreRE, ' ')
           .replace(upperLowerRE, (m, m1, m2) => `${m1.toLowerCase()} ${m2}`);
}

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export const isTypedArray = typeof SharedArrayBuffer !== 'undefined'
  ? function isArrayBufferOrSharedArrayBuffer(a) {
    return a && a.buffer && (a.buffer instanceof ArrayBuffer || a.buffer instanceof SharedArrayBuffer);
  }
  : function isArrayBuffer(a) {
    return a && a.buffer && a.buffer instanceof ArrayBuffer;
  };

export const isArrayOrTypedArray = v => Array.isArray(v) || isTypedArray(v);

// Yea, I know this should be `Math.round(v / step) * step
// but try step = 0.1, newV = 19.95
//
// I get
//     Math.round(19.95 / 0.1) * 0.1
//     19.900000000000002
// vs
//     Math.round(19.95 / 0.1) / (1 / 0.1)
//     19.9
//
export const stepify = (v, from, step) => Math.round(from(v) / step) / (1 / step);

export const euclideanModulo = (v, n) => ((v % n) + n) % n;
export const lerp = (a, b, t) => a + (b - a) * t;
export function copyExistingProperties(dst, src) {
  for (const key in src) {
    if (key in dst) {
      dst[key] = src[key];
    }
  }
  return dst;
}

export const mapRange = (v, inMin, inMax, outMin, outMax) => (v - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

export const makeRangeConverters = ({from, to}) => {
  return {
    to: v => mapRange(v, ...from, ...to),
    from: v => [true, mapRange(v, ...to, ...from)],
  };
};

export const makeRangeOptions = ({from, to, step}) => {
  return {
    min: to[0],
    max: to[1],
    ...(step && {step}),
    converters: makeRangeConverters({from, to}),
  };
};

// TODO: remove an use one in conversions. Move makeRangeConverters there?
export const identity = {
  to: v => v,
  from: v => [true, v],
};
export function makeMinMaxPair(gui, properties, minPropName, maxPropName, options) {
  const { converters: { from } = identity } = options;
  const { min, max } = options;
  const guiMinRange = options.minRange || 0;
  const valueMinRange = from(guiMinRange)[1];
  const minGui = gui
    .add(properties, minPropName, {
      ...options,
      min,
      max: max - guiMinRange,
    })
    .onChange(v => {
      maxGui.setValue(Math.min(max, Math.max(v + valueMinRange, properties[maxPropName])));
    });
  const maxGui = gui
    .add(properties, maxPropName, {
      ...options,
      min: min + guiMinRange,
      max,
    })
    .onChange(v => {
      minGui.setValue(Math.max(min, Math.min(v - valueMinRange, properties[minPropName])));
    });
  return [ minGui, maxGui ];
}

