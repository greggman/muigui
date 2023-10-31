import css from './styles/muigui.css.js';
import {createElem} from './libs/elem.js';
import {createController} from './controllers/create-controller.js';
import {
  mapRange,
  makeRangeConverters,
  makeRangeOptions,
  makeMinMaxPair,
} from './libs/utils.js';
import {
  converters
} from './libs/conversions.js';
import Canvas from './controllers/Canvas.js';
import Color from './controllers/Color.js';
import Divider from './controllers/Divider.js';
import Folder from './controllers/Folder.js';
import Label from './controllers/Label.js';
import Controller from './controllers/Controller.js';

import Column from './layout/Column.js';
import Frame from './layout/Frame.js';
import Grid from './layout/Grid.js';
import Row from './layout/Row.js';

export {
  Column,
  Frame,
  Grid,
  Row,
};

export class GUIFolder extends Folder {
  add(object, property, ...args) {
    const controller = object instanceof Controller
        ? object
        : createController(object, property, ...args);
    return this.addController(controller);
  }
  addCanvas(name) {
    return this.addController(new Canvas(name));
  }
  addColor(object, property, ...args) {
    return this.addController(new Color(object, property, ...args));
  }
  addDivider() {
    return this.addController(new Divider());
  }
  addFolder(name) {
    return this.addController(new GUIFolder(name));
  }
  addLabel(text) {
    return this.addController(new Label(text));
  }
}

class MuiguiElement extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: 'open'});
  }
}

customElements.define('muigui-element', MuiguiElement);

const baseStyleSheet = new CSSStyleSheet();
baseStyleSheet.replaceSync(css.default);
const userStyleSheet = new CSSStyleSheet();

function makeStyleSheetUpdater(styleSheet) {
  let newCss;
  let newCssPromise;

  function updateStyle() {
    if (newCss && !newCssPromise) {
      const s = newCss;
      newCss = undefined;
      newCssPromise = styleSheet.replace(s).then(() => {
  console.log(s);
        newCssPromise = undefined;
        updateStyle();
      });
    }
  }

  return function updateStyleSheet(css) {
    newCss = css;
    updateStyle();
  };
}

const updateBaseStyle = makeStyleSheetUpdater(baseStyleSheet);
const updateUserStyle = makeStyleSheetUpdater(userStyleSheet);

export class GUI extends GUIFolder {
  static converters = converters;
  static mapRange = mapRange;
  static makeRangeConverters = makeRangeConverters;
  static makeRangeOptions = makeRangeOptions;
  static makeMinMaxPair = makeMinMaxPair;
  #localStyleSheet = new CSSStyleSheet();

  constructor(options = {}) {
    super('Controls', 'muigui-root');
    if (options instanceof HTMLElement) {
      options = {parent: options};
    }
    const {
      autoPlace = true,
      width,
      title = 'Controls',
    } = options;
    let {
      parent,
    } = options;

    if (width) {
      this.domElement.style.width = /^\d+$/.test(width) ? `${width}px` : width;
    }
    if (parent === undefined && autoPlace) {
      parent = document.body;
      this.domElement.classList.add('muigui-auto-place');
    }
    if (parent) {
      const muiguiElement = createElem('muigui-element');
      muiguiElement.shadowRoot.adoptedStyleSheets = [baseStyleSheet, userStyleSheet, this.#localStyleSheet];
      muiguiElement.shadow.appendChild(this.domElement);
      parent.appendChild(muiguiElement);
    }
    if (title) {
      this.title(title);
    }
    this.domElement.classList.add('muigui', 'muigui-colors');
  }
  setStyle(css) {
    this.#localStyleSheet.replace(css);
  }
  static setBaseStyles(css) {
    updateBaseStyle(css);
  }
  static getBaseStyleSheet() {
    return baseStyleSheet;
  }
  static setUserStyles(css) {
    updateUserStyle(css);
  }
  static getUserStyleSheet() {
    return userStyleSheet;
  }
  static setTheme(name) {
    GUI.setBaseStyles(`${css.default}\n${css.themes[name] || ''}`);
  }
}

export default GUI;
