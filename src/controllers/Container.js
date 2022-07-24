import Controller from './Controller.js';

export default class Container extends Controller {
  constructor(className) {
    super(className);
    this._controllers = [];
    this._childDestController = this;
  }
  get children() {
    return this._controllers; // should we return a copy?
  }
  get controllers() {
    return this._controllers.filter(c => !(c instanceof Container));
  }
  get folders() {
    return this._controllers.filter(c => c instanceof Container);
  }
  reset(recursive = true) {
    for (const controller of this._controllers) {
      if (!(controller instanceof Container) || recursive) {
        controller.reset(recursive);
      }
    }
    return this;
  }
  remove(controller) {
    const ndx = this._controllers.indexOf(controller);
    if (ndx >= 0) {
      const c = this._controllers.splice(ndx, 1);
      const c0 = c[0];
      const elem = c0.domElement;
      elem.remove();
      c0.setParent(null);
    }
    return this;
  }
  _addControllerImpl(controller) {
    this.domElement.appendChild(controller.domElement);
    this._controllers.push(controller);
    controller.setParent(this);
    return controller;
  }
  addController(controller) {
    return this._childDestController._addControllerImpl(controller);
  }
  pushContainer(container) {
    this.addController(container);
    this._childDestController = container;
    return container;
  }
  popContainer() {
    this._childDestController = this._childDestController.parent;
    return this;
  }
}
