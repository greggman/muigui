import { Emitter } from '../libs/emitter.js';

/**
 * Represents the ability get a value, display it in 1 or more
 * editors, have the value be updated when the value in the editor
 * is used. And be able to update the editor when the value is set.
 */
export default class ValueSetter extends Emitter {
  constructor(get, set) {
    this._get = get;
    this._set = set;
    this._views = [];
  }
  add(view) {
    this._views.push(view);
    view.on('set', this._setValue);
    view.on('setFinal', this._setFinalValue);
    view.updateDisplay(this.getValue());
    return view;
  }
  setValue = (newV) => {
    this._set(newV);
    const v = this._get();
    this._views.forEach(editor => editor.updateDisplay(v));
    this.emit('set', newV)
  }
  setFinalValue = (newV) => {
    this._set(newV);
    const v = this._get();
    this._views.forEach(editor => editor.updateDisplay(v));
    this.emit('setFinal', newV);
  }
}
