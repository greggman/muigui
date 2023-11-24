import { removeArrayElem } from './utils.js';

export default class IterableArray {
  #arr;
  #added;
  #removedSet;
  #iterating;

  constructor() {
    this.#arr = [];
    this.#added = [];
    this.#removedSet = new Set();
  }
  add(elem) {
    if (this.#iterating) {
      this.#removedSet.delete(elem);
      this.#added.push(elem);
    } else {
      this.#arr.push(elem);
    }
  }
  remove(elem) {
    if (this.#iterating) {
      removeArrayElem(this.#added, elem);
      this.#removedSet.add(elem);
    } else {
      removeArrayElem(this.#arr, elem);
    }
  }
  #process(arr, fn) {
    for (const elem of arr) {
      if (!this.#removedSet.has(elem)) {
        if (fn(elem) === false) {
          break;
        }
      }
    }
  }
  forEach(fn) {
    this.#iterating = true;
    this.#process(this.#arr, fn);
    do {
      if (this.#removedSet.size) {
        for (const elem of this.#removedSet.values()) {
          removeArrayElem(this.#arr, elem);
        }
        this.#removedSet.clear();
      }
      if (this.#added.length) {
        const added = this.#added;
        this.#added = [];
        this.#process(added, fn);
      }
    } while (this.#added.length || this.#removedSet.size);
    this.#iterating = false;
  }
}