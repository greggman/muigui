import ValueSetter from './value-setter.js';
import {isTypedArray} from '../libs/utils.js';

function createObjectPropertySetter(object, property) {
  const v = object[property];
  if (typeof v === 'object') {
    // don't replace objects, just their values.
    if (Array.isArray(v)) {
      return function setNativeArray(newV) {
        const dst = object[property];
        for (let i = 0; i < newV.length; ++i) {
          dst[i] = newV[i];
        }
      };
    } else if (isTypedArray(v)) {
      return function setTypedArray(newV) {
        const dst = object[property];
        dst.set(newV);
      };
    } else {
      return function setObjectProperties(newV) {
        const dst = object[property];
        Object.assign(dst, newV);
      };
    }
  } else {
    return function setObjectProperties(newV) {
      object[property] = newV;
    };
  }
}

export default class PropertySetter extends ValueSetter {
  constructor(object, property) {
    super(
        () => object[property],
        createObjectPropertySetter(object, property),
        property,
    );
  }
}
