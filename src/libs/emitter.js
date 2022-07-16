import { removeArrayElem } from '../libs/utils.js';

export default class Emitter {
  constructor() {
    this._listeners = {};
    this._changes = [];
    this._receivers = [];
  }
  on(type, listener) {
    if (this._emitting) {
      this._changes.push(['add', type, listener]);
      return;
    }
    const listeners = this._listeners[type] || [];
    listeners.push(listener);
    this._listeners[type] = listeners;
  }
  addListener(type, listener) {
    return this.on(type, listener);
  }
  removeListener(type, listener) {
    if (this._emitting) {
      this._changes.push(['remove', type, listener]);
      return;
    }
    const listeners = this._listeners[type];
    if (listeners) {
      removeArrayElem(listeners, listener);
    }
  }
  propagate(receiver) {
    this._receivers.push(receiver);
  }
  emit(type, ...args) {
    this._emitting = true;
    const listeners = this._listeners[type];
    if (listeners) {
      for (const listener of listeners) {
        listener(...args);
      }
    }
    this._emitting = false;
    while (this._changes.length) {
      const [cmd, type, listener] = this._changes.shift();
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
    for (const receiver of this._receivers) {
      receiver.emit(type, ...args);
    }
  }
}