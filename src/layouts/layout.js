import { createElem } from '../libs/elem.js';

export default class Layout {
  constructor(className, tag = 'div') {
    this._domElement = createElem(tag, {className});
    this._children = [];
  }
  get domElement() {
    return this._domElement;
  }
  setParent(parent) {
    this._parent = parent; 
  }
  remove() {
    const ndx = this._children.indexOf(controller);
    if (ndx >= 0) {
      const c = this._children.splice(ndx, 1);
      const c0 = c[0];
      const elem = c0.domElement;
      elem.remove();
      c0.setParent(null);
    }    
  }
  add(layout) {
    this.domElement.appendChild(layout.domElement);
    this._children.push(layout);
    layout.setParent(this);
    return layout;
  }
}