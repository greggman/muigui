import { isTypedArray } from '../libs/utils.js';
import View from './View.js';

function arraysEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function copyArrayElementsFromTo(src, dst) {
  dst.length = src.length;
  for (let i = 0; i < src.length; ++i) {
    dst[i] = src[i];
  }
}

function checkArrayNeedsUpdate(newV) {
  // It's an array, we need to compare all elements
  // Example, vec2, [r,g,b], ...
  const needUpdate = !arraysEqual(newV, this._oldV);
  if (needUpdate) {
    copyArrayElementsFromTo(newV, this._oldV);
  }
  return needUpdate;
}

function checkTypedArrayNeedsUpdate() {
  let once = true;
  return function checkTypedArrayNeedsUpdateImpl(newV) {
    // It's a typedarray, we need to compare all elements
    // Example: Float32Array([r, g, b])
    let needUpdate = once;
    once = false;
    if (!needUpdate) {
      needUpdate = !arraysEqual(newV, this._oldV);
    }
    return needUpdate;
  };
}

function checkObjectNeedsUpdate(newV) {
  let needUpdate = false;
  for (const key in newV) {
    if (newV[key] !== this._oldV[key]) {
      needUpdate = true;
      this._oldV[key] = newV[key];
    }
  }
  return needUpdate;
}

function checkValueNeedsUpdate(newV) {
  const needUpdate = newV !== this._oldV;
  this._oldV = newV;
  return needUpdate;
}

function getUpdateCheckForType(context, newV) {
  if (Array.isArray(newV)) {
    context._oldV = [];
    return checkArrayNeedsUpdate.bind(context);
  } else if (isTypedArray(newV)) {
    context._oldV = new newV.constructor(newV);
    return checkTypedArrayNeedsUpdate().bind(context);
  } else if (typeof newV === 'object') {
    context._oldV = {};
    return checkObjectNeedsUpdate.bind(context);
  } else {
    return checkValueNeedsUpdate.bind(context);
  }
}

export default class EditView extends View {
  // The point of this is updating DOM elements
  // is slow but if we've called `listen` then
  // every frame we're going to try to update
  // things with the current value so if nothing
  // has changed then skip it.
  updateDisplayIfNeeded(newV) {
    this._updateCheck = this._updateCheck || getUpdateCheckForType(this, newV);
    if (this._updateCheck(newV)) {
      this.updateDisplay(newV);
    }
  }
}
