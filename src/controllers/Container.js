import Controller from './Controller.js';

export default class Container extends Controller {
  #controllers;
  #childDestController;

  constructor(className) {
    super(className);
    this.#controllers = [];
    this.#childDestController = this;
  }
  get children() {
    return this.#controllers; // should we return a copy?
  }
  get controllers() {
    return this.#controllers.filter(c => !(c instanceof Container));
  }
  get folders() {
    return this.#controllers.filter(c => c instanceof Container);
  }
  reset(recursive = true) {
    for (const controller of this.#controllers) {
      if (!(controller instanceof Container) || recursive) {
        controller.reset(recursive);
      }
    }
    return this;
  }
  updateDisplay() {
    for (const controller of this.#controllers) {
      controller.updateDisplay();
    }
    return this;
  }
  remove(controller) {
    const ndx = this.#controllers.indexOf(controller);
    if (ndx >= 0) {
      const c = this.#controllers.splice(ndx, 1);
      const c0 = c[0];
      const elem = c0.domElement;
      elem.remove();
      c0.setParent(null);
    } else {
      this.#controllers.forEach(c => {
        c.remove(controller);
      });
    }
    return this;
  }
  #addControllerImpl(controller) {
    this.domElement.appendChild(controller.domElement);
    this.#controllers.push(controller);
    controller.setParent(this);
    return controller;
  }
  addController(controller) {
    return this.#childDestController.#addControllerImpl(controller);
  }
  pushContainer(container) {
    this.addController(container);
    this.#childDestController = container;
    return container;
  }
  popContainer() {
    this.#childDestController = this.#childDestController.parent;
    return this;
  }
  listen() {
    this.#controllers.forEach(c => {
      c.listen();
    });
    return this;
  }
}
