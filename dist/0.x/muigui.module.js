/* muigui@0.0.1, license MIT */
function createElem(tag, attrs = {}, children = []) { 
  const elem = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (typeof value === 'function' && key.startsWith('on')) {
      const eventName = key.substring(2).toLowerCase();
      elem.addEventListener(eventName, value, {passive: false});
    } else if (typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) {
        elem[key][k] = v;
      }
    } else if (elem[key] === undefined) {
      elem.setAttribute(key, value);
    } else {
      elem[key] = value;
    }
  }
  for (const child of children) {
    elem.appendChild(child);
  }
  return elem;
}

let id = 0;

function makeId() {
  return `muigui-${++id}`;
}

class Controller {
  constructor(className) {
    this._root = createElem('div', {className: `muigui-controller`});
    // we need the specialization to come last so it takes precedence.
    if (className) {
      this._root.classList.add(className);
    }
  }
  get domElement() {
    return this._root;
  }
  show(show = true) {
    this._root.classList.toggle('muigui-hide', !show);
    this._root.classList.toggle('muigui-show', show);
    return this;
  }
  hide() {
    return this.show(false);
  }
  enable(enable = true) {
    this._root.classList.toggle('muigui-disabled', !enable);
    return this;
  }
  disable(disable = true) {
    return this.enable(!disable);
  }
  getColors() {
    const toCamelCase = s => s.replace(/-([a-z])/g, (m, m1) => m1.toUpperCase());
    const keys = [
      'color',
      'bg-color',
      'value-color',
      'value-bg-color',
      'hover-bg-color',
      'menu-bg-color',
      'menu-sep-color',
      'disabled-color',
    ];
    const div = createElem('div');
    this._root.appendChild(div);
    const colors = Object.fromEntries(keys.map(key => {
      div.style.color = `var(--${key})`;
      const s = getComputedStyle(div);
      return [toCamelCase(key), s.color];
    }));
    div.remove();
    return colors;
  }
}

class LabelController extends Controller {
  constructor(className = '', name = '') {
    super();
    this._id = makeId();
    this._nameElem = createElem('label', {for: this._id});
    this._contentElem = createElem('div', {className: 'muigui-value'});
    this._contentElem.classList.add(className);
    this.domElement.appendChild(this._nameElem);
    this.domElement.appendChild(this._contentElem);
    this.name(name);
  }
  get id() {
    return this._id;
  }
  get contentElement() {
    return this._contentElem;
  }
  name(name) {
    this._nameElem.textContent = name;
    this._nameElem.title = name;
    return this;
  }
}

// TODO: remove this? Should just be user side
class Canvas extends LabelController {
  constructor(name) {
    super('muigui-canvas', name);
    const root = this.contentElement;

    this._canvasElem =  createElem('canvas');
    root.appendChild(this._canvasElem);
  }
  get canvas() {
    return this._canvasElem;
  }
}

function removeArrayElem(array, value) {
  const ndx = array.indexOf(value);
  if (ndx) {
    array.splice(ndx, 1);
  }
  return array;
}

const tasks = [];
const tasksToRemove = new Set();

let requestId;
let processing;

function removeTasks() {
  if (!tasksToRemove.size) {
    return;
  }

  if (processing) {
    queueProcessing();
    return;
  }

  tasksToRemove.forEach(task => {
    removeArrayElem(tasks, task);
  });
  tasksToRemove.clear();
}

function processTasks() {
  requestId = undefined;
  processing = true;
  for (const task of tasks) {
    if (!tasksToRemove.has(task)) {
      task();
    }
  }
  processing = false;
  removeTasks();
  queueProcessing();
}

function queueProcessing() {
  if (!requestId && tasks.length) {
    requestId = requestAnimationFrame(processTasks);
  }
}

function addTask(fn) {
  tasks.push(fn);
  queueProcessing();
}

function removeTask(fn) {
  tasksToRemove.set(fn);
  
  const ndx = tasks.indexOf(fn);
  if (ndx >= 0) {
    tasks.splice(ndx, 1);
  }
}

class ValueController extends LabelController {
  constructor(object, property, className = '') {
    super(className, property);
    this._object = object;
    this._property = property;
    this._initialValue = this.getValue();
    this._changeFns = [];
    this._finishChangeFns = [];
    this._listening = false;
  }
  get initialValue() {
    return this._initialValue;
  }
  get object() {
    return this._object;
  }
  get property() {
    return this._property;
  }
  setJustValue(v) {
    this._object[this._property] = v;
  }
  _callListeners(fns) {
    const newV = this.getValue();
    for (const fn of fns) {
      fn.call(this, newV);
    }
  }
  setValue(v) {
    this._object[this._property] = v;
    this._callListeners(this._changeFns);
  }
  setFinalValue(v) {
    this.setValue(v);
    this._callListeners(this._finishChangeFns);
  }
  getValue(v) {
    return this._object[this._property];
  }
  value(v) {
    this.setValue(v);
    return this;
  }
  reset() {
    this.setValue(this._initialValue);
    return this;
  }
  onChange(fn) {
    this.removeChange(fn);
    this._changeFns.push(fn);
    return this;
  }
  removeChange(fn) {
    removeArrayElem(this._changeFns, fn);
    return this;
  }
  onFinishChange(fn) {
    this.removeFinishChange(fn);
    this._finishChangeFns.push(fn);
    return this;
  }
  removeFinishChange(fn) {
    removeArrayElem(this._finishChangeFns, fn);
    return this;
  }
  listen(listen = true) {
    if (!this._updateFn) {
      this._updateFn = this.updateDisplay.bind(this);
    }
    if (listen) {
      if (!this._listening) {
        this._listening = true;
        addTask(this._updateFn);
      }
    } else {
      if (this._listening) {
        this._listening = false;
        removeTask(this._updateFn);
      }
    }
    return this;
  }
}

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const hexToUint32RGB = v => (parseInt(v.substring(1, 3), 16) << 16) |
                            (parseInt(v.substring(3, 5), 16) << 8 ) |
                            (parseInt(v.substring(5, 7), 16)      ) ;
const uint32RGBToHex = v => `#${(v | 0).toString(16).padStart(6, '0')}`;

const hexToUint8RGB = v => [parseInt(v.substring(1, 3), 16),
                            parseInt(v.substring(3, 5), 16),
                            parseInt(v.substring(5, 7), 16)];
const uint8RGBToHex = v => `#${v.map(v => v.toString(16).padStart(2, '0')).join('')}`;

const hexToFloatRGB = v => hexToUint8RGB(v).map(v => v / 255);
const floatRGBToHex = v => uint8RGBToHex(v.map(v => clamp(v * 255, 0, 255)));

const hexToObjectRGB = v => ({
  r: parseInt(v.substring(1, 3), 16) / 255,
  g: parseInt(v.substring(3, 5), 16) / 255,
  b: parseInt(v.substring(5, 7), 16) / 255,
});
const scaleAndClamp = v => clamp(v * 255 | 0, 0, 255).toString(16).padStart(2, '0');
const objectRGBToHex = v => `#${scaleAndClamp(v.r)}${scaleAndClamp(v.g)}${scaleAndClamp(v.b)}`;

const hexToCssRGB = v => `rgb(${hexToUint8RGB(v)})`;
const cssRGBRegex = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
const cssRGBToHex = v => {
  const m = cssRGBRegex.exec(v);
  return uint8RGBToHex([m[1], m[2], m[3]].map(v => parseInt(v)));
};

const hex3DigitTo6Digit = v => `${v[0]}${v[0]}${v[1]}${v[1]}${v[2]}${v[2]}`;

const cssStringFormats = [
  { re: /^#(?:[0-9a-f]){6}$/i, format: 'hex', fix: v => v, },
  { re: /^(?:[0-9a-f]){6}$/i, format: 'hex-no-hash', fix: v => v, },
  { re: /^#(?:[0-9a-f]){3}$/i, format: 'hex', fix: v => `#${hex3DigitTo6Digit(v.substring(1))}`, },
  { re: /^(?:[0-9a-f]){3}$/i, format: 'hex-no-hash', fix: v => hex3DigitTo6Digit(v), },
  { re: cssRGBRegex, format: 'css-rgb', fix: v => v, },
];

function guessStringColorFormat(v) {
  for (const formatInfo of cssStringFormats) {
    if (formatInfo.re.test(v)) {
      return formatInfo;
    }
  }
}

function guessFormat(v) {
  switch (typeof v) {
    case 'number':
      return 'uint32-rgb';
    case 'string':
      const formatInfo = guessStringColorFormat(v.trim());
      if (formatInfo) {
        return formatInfo.format;
      }
      break;
    case 'object':
      if (v.length === 3) {
        return 'float-rgb';
      } else {
        if ('r' in v && 'g' in v && 'b' in v) {
          return 'object-rgb';
        }
      }
  }
  throw new Error(`unknown color format: ${v}`);
}

function fixHex(v) {
  const formatInfo = guessStringColorFormat(v.trim());
  const fix = formatInfo ? formatInfo.fix : v => v;
  return fix(v.trim());
}

const formatConverters = {
  'hex':        { fromHex: v => v,         toHex: v => fixHex(v) },
  'uint32-rgb': { fromHex: hexToUint32RGB, toHex: uint32RGBToHex },
  'uint8-rgb':  { fromHex: hexToUint8RGB,  toHex: uint8RGBToHex },
  'float-rgb':  { fromHex: hexToFloatRGB,  toHex: floatRGBToHex },
  'object-rgb': { fromHex: hexToObjectRGB, toHex: objectRGBToHex },
  'css-rgb':    { fromHex: hexToCssRGB,    toHex: cssRGBToHex },
  'hex-no-hash':{ fromHex: v => v.substring(1), toHex: v => `#${fixHex(v)}` },
};

class Color extends ValueController {
  constructor(object, property, format) {
    super(object, property, 'muigui-color');
    const root = this.contentElement;
    const id = this.id;

    format = format || guessFormat(this.getValue());
    this._converters = formatConverters[format];
    const {fromHex} = this._converters;

    this._colorElem = createElem('input', {
      type: 'color',
      id,
      onInput: (e) => {
        this.setValue(fromHex(this._colorElem.value));
      },
      onChange: (e) => {
        this.setFinalValue(fromHex(this._colorElem.value));
      },
    });
    root.appendChild(createElem('div', {}, [this._colorElem]));

    this._textElem = createElem('input', {
      type: 'text',
      pattern: /[a-f0-9]{6}/i,
      onInput: (e) => {
        this.setValue(fromHex(`#${this._textElem.value}`));
      },
      onChange: (e) => {
        this.setFinalValue(fromHex(`#${this._textElem.value}`));
      },
    });
    root.appendChild(this._textElem);
    this.updateDisplay();
  }
  updateDisplay() {
    const newV = this._converters.toHex(super.getValue());
    this._textElem.value = newV.substring(1);
    this._colorElem.value = newV;
    return this;
  }
  setValue(v) {
    super.setValue(v);
    this.updateDisplay();
    return this;
  }
}

class Button extends Controller {
  constructor(object, property) {
    super('muigui-button', '');
    const root = this.domElement;
    this._object = object;
    this._property = property;

    this._buttonElem =  createElem('button', {
      type: 'button',
      textContent: property,
      onClick: (e) => {
        this._object[this._property](this);
      } 
    });
    root.appendChild(this._buttonElem);
  }
  name(name) {
    this._buttonElem.textContent = name;
    return this;
  }
  updateDisplay() {
  }
  onChange() { return this; } // what
  onFinishChange() { return this; } // what?
}

class Checkbox extends ValueController {
  constructor(object, property) {
    super(object, property, 'muigui-checkbox');
    const root = this.contentElement;
    const id = this.id;

    this._checkboxElem =  createElem('input', {
      type: 'checkbox',
      id,
      onInput: (e) => {
        this.setValue(this._checkboxElem.checked);
      },
      onChange: (e) => {
        this.setFinalValue(this._checkboxElem.checked);
      },
    });
    this.updateDisplay();
    root.appendChild(createElem('label', {}, [this._checkboxElem]));
  }
  updateDisplay() {
    const newV = super.getValue();
    this._checkboxElem.checked = newV;
  }
  setValue(v) {
    super.setValue(v);
  }
}

const identity$1 = {from: v => v, to: v => v};

// Wanted to name this `Number` but it conflicts with
// JavaScript `Number`. It most likely wouldn't be
// an issue? But users might `import {Number} ...` and
// things would break.
class TextNumber extends ValueController {
  constructor(object, property, conversion = identity$1, step = 0.01) {
    super(object, property, 'muigui-checkbox');
    const root = this.contentElement;
    const id = this.id;

    this._textElem =  createElem('input', {
      type: 'number',
      id,
      onInput: (e) => {
        const v = parseFloat(this._textElem.value);
        if (!Number.isNaN(v)) {
          this.setValue(this._to(v));
        }
      },
      onChange: (e) => {
        const v = parseFloat(this._textElem.value);
        if (!Number.isNaN(v)) {
          this.setFinalValue(this._to(v));
        }
      },
    });
    this.conversion(conversion);
    this.step(step);
    this.updateDisplay();
    root.appendChild(this._textElem);
  }
  step(step) {
    this._step = step;
    this.updateDisplay();
    return this;
  }
  updateDisplay() {
    const newV = super.getValue();
    // Yea, I know this should be `Math.round(v / step) * step
    // but try step = 0.1, newV = 19.95
    //
    // I get
    //     Math.round(19.95 / 0.1) * 0.1
    //     19.900000000000002
    // vs
    //     Math.round(19.95 / 0.1) / (1 / 0.1)
    //     19.9
    //
    const steppedV = Math.round(this._from(newV) / this._step) / (1 / this._step);
    this._textElem.value = steppedV;
    return this;
  }
  conversion(conversion) {
    this._from = conversion.from;
    this._to = conversion.to;
    this.updateDisplay();
    return this;
  }
}

// 4 cases
//   (a) keyValues is array of arrays, each sub array is key value
//   (b) keyValues is array and value is number then keys = array contents, value = index
//   (c) keyValues is array and value is not number, key = array contents, value = array contents
//   (d) keyValues is object then key->value
function convertToKeyValues(keyValues, valueIsNumber) {
  if (Array.isArray(keyValues)) {
    if (Array.isArray(keyValues[0])) {
      // (a) keyValues is array of arrays, each sub array is key value
      return keyValues;
    } else {
      if (valueIsNumber) {
        // (b) keyValues is array and value is number then keys = array contents, value = index
        return keyValues.map((v, ndx) => [v, ndx]);
      } else {
        // (c) keyValues is array and value is not number, key = array contents, value = array contents
        return keyValues.map(v => [v, v]);
      }
    }
  } else {
    // (d)
    return [...Object.entries(keyValues)];
  }
}

class Select extends ValueController {
  constructor(object, property, keyValuesInput) {
    super(object, property, 'muigui-select');
    const root = this.contentElement;

    const valueIsNumber = typeof this.getValue() === 'number';
    const keyValues = convertToKeyValues(keyValuesInput, valueIsNumber);

    this._values = [];
    this._selectElem = createElem('select', {
      onChange: (e) => {
        this.setFinalValue(this._values[this._selectElem.selectedIndex]);
      },
    }, keyValues.map(([key, value]) => {
      this._values.push(value);
      return createElem('option', {textContent: key});
    }));
    this.updateDisplay();
    root.appendChild(this._selectElem);
  }
  updateDisplay() {
    const newV = super.getValue();
    const ndx = this._values.indexOf(newV);
    this._selectElem.selectedIndex = ndx;
  }
  setValue(v) {
    super.setValue(v);
    this.updateDisplay();
  }
}

const identity = {from: v => v, to: v => v};

class Slider extends ValueController {
  constructor(object, property, min = 0, max = 1, step = 0.01, conversion = identity) {
    super(object, property, 'muigui-slider');
    const root = this.contentElement;
    const id = this.id;

    this._rangeElem = createElem('input', {
      type: 'range',
      id,
      onInput: (e) => {
        this._skipUpdateRangeElem = true;
        this.setValue(this._to(this._rangeElem.value));
      },
      onChange: (e) => {
        this._skipUpdateRangeElem = true;
        this.setFinalValue(this._to(this._rangeElem.value));
      },
    });

    this._textElem = createElem('input', {
      type: 'number',
      onInput: (e) => {
        const v = parseFloat(this._textElem.value);
        if (!Number.isNaN(v)) {
          this._skipUpdateTextElem = true;
          this.setValue(this._to(v));
        }
      },
      onChange: (e) => {
        const v = parseFloat(this._textElem.value);
        if (!Number.isNaN(v)) {
          this._skipUpdateTextElem = true;
          this.setFinalValue(this._to(v));
        }
      }
    });

    this.conversion(conversion);
    this.min(min);
    this.max(max);
    this.step(step);
    root.appendChild(this._rangeElem);

    root.appendChild(this._textElem);
    this.updateDisplay();
  }
  min(min) {
    this._rangeElem.min = min;
    return this;
  }
  max(max) {
    this._rangeElem.max = max;
    return this;
  }
  step(step) {
    this._rangeElem.step = step;
    this._step = step;
    this.updateDisplay();
    return this;
  }
  conversion(conversion) {
    this._from = conversion.from;
    this._to = conversion.to;
    this.updateDisplay();
    return this;
  }
  updateDisplay() {
    const newV = super.getValue();
    // Yea, I know this should be `Math.round(v / step) * step
    // but try step = 0.1, newV = 19.95
    //
    // I get
    //     Math.round(19.95 / 0.1) * 0.1
    //     19.900000000000002
    // vs
    //     Math.round(19.95 / 0.1) / (1 / 0.1)
    //     19.9
    //
    const steppedV = Math.round(this._from(newV) / this._step) / (1 / this._step);
    if (!this._skipUpdateTextElem) {
      this._textElem.value = steppedV;
    }
    if (!this._skipUpdateRangeElem) {
      this._rangeElem.value = steppedV;
    }
    this._skipUpdateRangeElem = false;
    this._skipUpdateTextElem = false;
    return this;
  }
  setValue(v) {
    super.setValue(v);
    this.updateDisplay();
    return this;
  }
}

class Text extends ValueController {
  constructor(object, property) {
    super(object, property, 'muigui-checkbox');
    const root = this.contentElement;
    const id = this.id;

    this._textElem =  createElem('input', {
      type: 'text',
      id,
      onInput: (e) => {
        this.setValue(this._textElem.value);
      },
      onChange: (e) => {
        this.setFinalValue(this._textElem.value);
      },
    });
    this.updateDisplay();
    root.appendChild(this._textElem);
  }
  updateDisplay() {
    const newV = super.getValue();
    this._textElem.value = newV;
    return this;
  }
}

const isConversion = o => typeof o.to === 'function' && typeof o.from === 'function';

/**
 * possible inputs
 *    add(o, p, min: number, max: number)
 *    add(o, p, min: number, max: number, step: number)
 *    add(o, p, obj: key-value)
 *    add(o, p, array: [value])
 *    add(o, p, array: [[key, value]])
 * 
 * @param {*} object 
 * @param {string} property 
 * @param  {...any} args 
 * @returns 
 */
function createController(object, property, ...args) {
  const [arg1] = args;
  const arg1IsObject = typeof arg1 === 'object';
  if (arg1IsObject && !isConversion(arg1)) {
    return new Select(object, property, ...args);
  }

  const t = typeof object[property];
  switch (t) {
    case 'number':
      return args.length === 0 || (args.length <= 2 && typeof args[0] === 'object')
          ? new TextNumber(object, property, ...args)
          : new Slider(object, property, ...args);
    case 'boolean':
      return new Checkbox(object, property, ...args);
    case 'function':
      return new Button(object, property, ...args);
    case 'string':
      return new Text(object, property, ...args);
  }
}

// This feels like it should be something else like
// gui.addController({className: 'muigui-divider')};
class Divider extends Controller {
  constructor() {
    super('muigui-divider');
  }
}

// This feels like it should be something else like
// gui.addDividing = new Controller()
class Label extends Controller {
  constructor(text) {
    super('muigui-label');
    this.text(text);
  }
  text(text) {
    this.domElement.textContent = text;
    return this;
  }
}

// Clicking should only be first child
class Folder extends Controller {
  constructor(name = 'Controls', className = 'muigui-menu') {
    super(className);
    this._labelElem = createElem('label');
    this.domElement.appendChild(createElem('div', {
      onClick: () => { this.toggleOpen(); },
    }, [this._labelElem]));
    this._controllerElem = createElem('div');
    this._controllers = [];
    this.domElement.appendChild(this._controllerElem);
    this.name(name);
    this.open();
  }
  get children() {
    return this._controllers; // should we return a copy?
  }
  get controllers() {
    return this._controllers.filter(c => !(c instanceof Folder));
  }
  get folders() {
    return this._controllers.filter(c => c instanceof Folder);
  }
  reset(recursive = true) {
    for (const controller of this._controllers) {
      if (!(controller instanceof Folder) || recursive) {
        controller.reset(recursive);
      }
    }
    return this;
  }
  open(open = true) {
    this.domElement.classList.toggle('muigui-closed', !open);
    this.domElement.classList.toggle('muigui-open', open);
    return this;
  }
  close() {
    return this.open(false);
  }
  name(name) {
    this._labelElem.textContent = name;
    return this;
  }
  title(title) {
    return this.name(title);
  }
  toggleOpen() {
    this.open(!this.domElement.classList.contains('muigui-open'));
    return this;
  }
  remove(controller) {
    const ndx = this._controllers.indexOf(controller);
    if (ndx >= 0) {
      const c = this._controllers.splice(ndx, 1);
      const c0 = c[0];
      const elem = c0.domElement;
      elem.remove();
    }    
  }
  addController(controller) {
    this._controllerElem.appendChild(controller.domElement);
    this._controllers.push(controller);
    return controller;
  }
  add(object, property, ...args) {
    return this.addController(createController(object, property, ...args));
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
    return this.addController(new Folder(name));
  }
  addLabel(text) {
    return this.addController(new Label(text));
  }
}

const css = `
.muigui {
  --width: 250px;
  --label-width: 45%;

  --bg-color: #222222;
  --color: #dddddd;
  --value-color: #43e5f7;
  --value-bg-color: #444444;
  --disabled-color: #666666;
  --menu-bg-color: #000000;
  --menu-sep-color: #444444;
  --hover-bg-color: #666666;

  --button-bg-color: var(--value-bg-color);

  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-size: 11px;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --font-size-mono: 11px;

  --slider-width: 30px;

  --slider-left-color: var(--value-color);
  --slider-right-color: var(--value-bg-color);
  --slider-right-hover-color: var(--hover-bg-color);
  --line-height: 1.7em;

  width: var(--width);
  color: var(--color);
  background-color: var(--bg-color);
  font-family: var(--font-family);
  font-size: var(--font-size);
  box-sizing: border-box;
}
.muigui * {
  box-sizing: inherit;
}

.muigui-show { /* */ }
.muigui-hide { 
  display: none !important;
}
.muigui-disabled {
  pointer-events: none;
  --color: var(--disabled-color) !important;
  --value-color: var(--disabled-color) !important;
  --slider-left-color: var(--disabled-color) !important;
}

.muigui canvas {
  display: block;
  background-color: var(--value-bg-color);
}

.muigui-controller {
  word-wrap: initial;
  display: flex;
  align-items: stretch;
  min-width: 0;
  min-height: var(--line-height);
  margin: 0.4em 0 0.4em 0;
}
.muigui-root,
.muigui-menu {
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;
  height: fit-content;
  margin: 0;
  padding-bottom: 0.1em;
}
.muigui-menu {
  border-bottom: 1px solid var(--menu-sep-color);
}

.muigui-root>div:nth-child(1),
.muigui-menu>div:nth-child(1) {
  border-top: 1px solid var(--menu-sep-color);
  border-bottom: 1px solid var(--menu-sep-color);
  position: relative;
  background-color: var(--menu-bg-color);
  min-height: var(--line-height);
  padding-top: 0.2em;
  padding-bottom: 0.2em;
  cursor: pointer;
}
.muigui-root>div:nth-child(2),
.muigui-menu>div:nth-child(2) {
  flex: 1 1 auto;
}

.muigui-controller {
  margin-left: 0.2em;
  margin-right: 0.2em;
}
.muigui-root.muigui-controller,
.muigui-menu.muigui-controller {
  margin-left: 0;
  margin-right: 0;
}
.muigui-controller>*:nth-child(1) {
  flex: 1 0 var(--label-width);
  min-width: 0;
  white-space: pre;
}
.muigui-controller>label:nth-child(1) {
  place-content: center start;
  display: inline-grid;
}
.muigui-controller>*:nth-child(2) {
  flex: 1 1 75%;
  min-width: 0;
}
.muigui-value {
  display: flex;
  align-items: stretch;
}
.muigui-value>* {
  flex: 1 1 auto;
  min-width: 0;
}
.muigui-value>*:nth-child(1) {
  flex: 1 1 60%;
}
.muigui-value>*:nth-child(2) {
  flex: 1 1 40%;
  margin-left: 0.2em;
}

/* fix! */
.muigui-open>div>label::before,
.muigui-closed>div>label::before {
  width: 1.5em;
  height: var(--line-height);
  display: inline-grid;
  place-content: center;
  pointer-events: none;
}
.muigui-open>div>label::before {
  content: "▼";
}
.muigui-closed>div>label::before {
  content: "▶";
}
.muigui-open>*:nth-child(2) {
  transition: max-height 0.2s ease-out,
              opacity 0.5s ease-out;
  max-height: 100vh;
  overflow: auto;
  opacity: 1;
}

.muigui-closed>*:nth-child(2) {
  transition: max-height 0.2s ease-out,
              opacity 1s;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

.muigui select,
.muigui option,
.muigui input,
.muigui button {
  color: var(--value-color);
  background-color: var(--value-bg-color);
  font-family: var(--font-family);
  font-size: var(--font-size);
  border: none;
  margin: 0;
  border-radius: 0;
}
.muigui select {
  appearance: none;
  border-radius: 0;
  margin: 0;
  margin-left: 0; /*?*/
  overflow: hidden; /* Safari */
}

.muigui select:hover,
.muigui option:hover,
.muigui input:hover,
.muigui button:hover {
  background-color: var(--hover-bg-color);  
}

/* ------ [ label ] ------ */

.muigui-label {
  border-top: 1px solid var(--menu-sep-color);
  border-bottom: 1px solid var(--menu-sep-color);
  padding-top: 0.4em;
  padding-bottom: 0.3em;
  place-content: center start;
  background-color: var(--menu-bg-color);
  white-space: pre;
}

/* ------ [ divider] ------ */

.muigui-divider {
    min-height: 6px;
    border-top: 2px solid var(--menu-sep-color);
    margin-top: 6px;
}

/* ------ [ button ] ------ */

.muigui-button button {
  border: none;
  color: var(--value-color);
  background-color: var(--button-bg-color);
  cursor: pointer;
  place-content: center center;
}

/* ------ [ color ] ------ */

.muigui-color>div {
  overflow: hidden;
  position: relative;
  margin-left: 0;
  margin-right: 0; /* why? */
}

.muigui-color input[type=color] {
  border: none;
  padding: 0;
  background: inherit;
  cursor: pointer;
  position: absolute;
  width: 200%;
  left: -10px;
  top: -10px;
  height: 200%;
}
.muigui-disabled canvas,
.muigui-disabled .muigui-color input[type=color] {
  opacity: 0.3;
}

/* ------ [ checkbox ] ------ */

.muigui-checkbox>label:nth-child(2) {
  display: grid;
  place-content: center start;
  margin: 0;
}

.muigui-checkbox input[type=checkbox] {
  -webkit-appearance: none;
  appearance: none;
  width: auto;
  color: var(--value-color);
  background-color: var(--value-bg-color);
  cursor: pointer;

  display: grid;
  place-content: center;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1.7em;
  height: 1.7em;
  transform: translateY(-0.075em);
}

.muigui-checkbox input[type=checkbox]::before {
  content: "";
  color: var(--value-color);
  display: grid;
  place-content: center;
}

.muigui-checkbox input[type=checkbox]:checked::before {
  content: "✔";
}

.muigui input[type=number]::-webkit-inner-spin-button, 
.muigui input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none;
  appearance: none;
  margin: 0; 
}
.muigui input[type=number] {
  -moz-appearance: textfield;
}

/* ------ [ slider ] ------ */

/* fix below */
.muigui-slider input[type=range] {
  cursor: ew-resize;
  overflow: hidden;
}

.muigui-slider input[type=range] {
  -webkit-appearance: none;
  appearance: none;
  background-color: var(--slider-right-color);
  margin: 0;
}
.muigui-slider input[type=range]:hover {
  background-color: var(--slider-right-hover-color);
}

.muigui-slider input[type=range]::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  appearance: none;
  height: max-content;
  color: var(--slider-left-color);
  margin-top: -1px;
}
.muigui-slider input[type=range]::-webkit-slider-runnable-track {
  color: red;
}

.muigui-slider input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0px;
  height: max-content;
  box-shadow: -1000px 0 0 1000px var(--slider-left-color);
}

/* FF */
.muigui-slider input[type=range]::-moz-range-progress {
  background-color: var(--slider-left-color); 
}
.muigui-slider input[type=range]::-moz-range-thumb {
  height: max-content;
  width: 0;
  border: none;
  box-shadow: -1000px 0 0 1000px var(--slider-left-color);
  box-sizing: border-box;
}

/* needs to be at bottom to take precedence */
.muigui-auto-place {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 100001;
}
`;

let stylesInjected = false;
const styleElem = createElem('style');

class GUI extends Folder {
  constructor(options = {}) {
    super('Controls', 'muigui-root');
    if (options instanceof HTMLElement) {
      options = {parent: options};
    }
    let {
      parent,
      autoPlace = true,
      width,
      title = 'Controls',
      injectStyles = true,
    } = options;
    if (injectStyles && !stylesInjected) {
      stylesInjected = true;
      (document.head || document.documentElement).appendChild(styleElem);
      styleElem.textContent = css;
    }
    if (width) {
      this.domElement.style.width = /^\d+$/.test(width) ? `${width}px` : width;
    }
    if (parent === undefined && autoPlace) {
      parent = document.body;
      this.domElement.classList.add('muigui-auto-place');
    }
    if (parent) {
      parent.appendChild(this.domElement);
    }
    if (title) {
      this.title(title);
    }
    this.domElement.classList.add('muigui');
  }
}

export { GUI as default };
