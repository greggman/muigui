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

export default class EditView extends View {
  #oldV;
  #updateCheck;

  #checkArrayNeedsUpdate(newV) {
    // It's an array, we need to compare all elements
    // Example, vec2, [r,g,b], ...
    const needUpdate = !arraysEqual(newV, this.#oldV);
    if (needUpdate) {
      copyArrayElementsFromTo(newV, this.#oldV);
    }
    return needUpdate;
  }

  #checkTypedArrayNeedsUpdate() {
    let once = true;
    return function checkTypedArrayNeedsUpdateImpl(newV) {
      // It's a typedarray, we need to compare all elements
      // Example: Float32Array([r, g, b])
      let needUpdate = once;
      once = false;
      if (!needUpdate) {
        needUpdate = !arraysEqual(newV, this.#oldV);
      }
      return needUpdate;
    };
  }

  #checkObjectNeedsUpdate(newV) {
    let needUpdate = false;
    for (const key in newV) {
      if (newV[key] !== this.#oldV[key]) {
        needUpdate = true;
        this.#oldV[key] = newV[key];
      }
    }
    return needUpdate;
  }

  #checkValueNeedsUpdate(newV) {
    const needUpdate = newV !== this.#oldV;
    this.#oldV = newV;
    return needUpdate;
  }

  #getUpdateCheckForType(newV) {
    if (Array.isArray(newV)) {
      this.#oldV = [];
      return this.#checkArrayNeedsUpdate.bind(this);
    } else if (isTypedArray(newV)) {
      this.#oldV = new newV.constructor(newV);
      return this.#checkTypedArrayNeedsUpdate(this);
    } else if (typeof newV === 'object') {
      this.#oldV = {};
      return this.#checkObjectNeedsUpdate.bind(this);
    } else {
      return this.#checkValueNeedsUpdate.bind(this);
    }
  }

  // The point of this is updating DOM elements
  // is slow but if we've called `listen` then
  // every frame we're going to try to update
  // things with the current value so if nothing
  // has changed then skip it.
  updateDisplayIfNeeded(newV, ignoreCache) {
    this.#updateCheck = this.#updateCheck || this.#getUpdateCheckForType(newV);
    // Note: We call #updateCheck first because it updates
    // the cache
    if (this.#updateCheck(newV) || ignoreCache) {
      this.updateDisplay(newV);
    }
  }
  setOptions(/*options*/) {
    // override this
    return this;
  }
}
