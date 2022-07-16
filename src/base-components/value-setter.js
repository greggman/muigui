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
    this._editors = [];
  }
  add(editor) {
    this._editors.push(editor);
    editor.on('set', this._setValue);
    editor.on('setFinal', this._setFinalValue);
    editor.updateDisplay(this.getValue());
    return editor;
  }
  setValue = (newV) => {
    this._set(newV);
    const v = this._get();
    this._editors.forEach(editor => editor.updateDisplay(v));
    this.emit('set', newV)
  }
  setFinalValue = (newV) => {
    this._set(newV);
    const v = this._get();
    this._editors.forEach(editor => editor.updateDisplay(v));
    this.emit('setFinal', newV);
  }
}
