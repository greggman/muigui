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
