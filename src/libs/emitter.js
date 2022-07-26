import { removeArrayElem } from '../libs/utils.js';

/**
 * Similar to EventSource
 */
export default class Emitter {
  #listeners;
  #changes;
  #receivers;
  #emitting;

  constructor() {
    this.#listeners = {};
    this.#changes = [];
    this.#receivers = [];
  }
  on(type, listener) {
    if (this.#emitting) {
      this.#changes.push(['add', type, listener]);
      return;
    }
    const listeners = this.#listeners[type] || [];
    listeners.push(listener);
    this.#listeners[type] = listeners;
  }
  addListener(type, listener) {
    return this.on(type, listener);
  }
  removeListener(type, listener) {
    if (this.#emitting) {
      this.#changes.push(['remove', type, listener]);
      return;
    }
    const listeners = this.#listeners[type];
    if (listeners) {
      removeArrayElem(listeners, listener);
    }
  }
  propagate(receiver) {
    this.#receivers.push(receiver);
  }
  emit(type, ...args) {
    this.#emitting = true;
    const listeners = this.#listeners[type];
    if (listeners) {
      for (const listener of listeners) {
        listener(...args);
      }
    }
    this.#emitting = false;
    while (this.#changes.length) {
      const [cmd, type, listener] = this.#changes.shift();
      switch (cmd) {
        case 'add':
          this.on(type, listener);
          break;
        case 'remove':
          this.removeListener(type, listener);
          break;
        default:
          throw new Error('unknown type');
      }
    }
    for (const receiver of this.#receivers) {
      receiver.emit(type, ...args);
    }
  }
}