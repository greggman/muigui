import { removeArrayElem } from './utils.js';

export default class IterableArray {
  constructor() {
    this._arr = [];
    this._added = [];
    this._removedSet = new Set();
  }
  add(elem) {
    if (this._iterating) {
      this._removeSet.delete(elem);
      this._added.push(elem);
    } else {
      this._arr.push(elem);
    }
  }
  remove(elem) {
    if (this._iterating) {
      removeArrayElem(this._added, elem);
      this._removedSet.add(elem);
    } else {
      removeArrayElem(this._arr, elem);
    }
  }
  _process(arr, fn) {
    for (const elem of arr) {
      if (!this._removedSet.has(elem)) {
        if (fn(elem) === false) {
          break;
        }
      }
    }
  }
  forEach(fn) {
    this._iterating = true;
    this._process(this._arr, fn);
    do {
      if (this._removedSet.size) {
        for (const elem of this._removedSet.values()) {
          removeArrayElem(this._arr, elem);
        }
        this._removedSet.clear();
      }
      if (this._added.length) {
        const added = this._added;
        this._added = [];
        this._process(added, fn);
      }
    } while (this._added.length || this._removedSet.size);
    this._iterating = false;
  }
}