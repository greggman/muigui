
import {GUI} from '../../src/muigui.js';
import {model} from './model.js';
import Logger from './logger.js';
import {
  getCSSRulesBySelector,
  resizeCanvasToDisplaySize,
  hsl,
} from './utils.js';

import Direction from '../../src/controllers/Direction.js';
import Vec2 from '../../src/controllers/Vec2.js';
import ColorChooser from '../../src/controllers/ColorChooser.js';
import RadioGrid from '../../src/controllers/RadioGrid.js';
import Slider from '../../src/controllers/Slider.js';
import Select from '../../src/controllers/Select.js';
// import Range from '../../src/controllers/Range.js';
import TextNumber from '../../src/controllers/TextNumber.js';

/* cut-here */

const uiElem = document.querySelector('#ui');

const logElem = document.querySelector('#log');
function logImpl(color, ...args) {
  const elem = document.createElement('pre');
  elem.textContent = args.join(' ');
  elem.style.color = color;
  logElem.appendChild(elem);
  if (logElem.children.length > 3) {
    logElem.children[0].remove();
  }
}
const log = (...args) => logImpl('inherit', ...args);

// Using an invisible GUI to get the colors
// In a real app we'd just use the GUI we created
// but I don't want to clutter the other examples.
let uiCSSColorVariableNames;
const getListOfUIColorCSSVariableNames = (() => {
  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI(div).hide();
  return function updateUIColors() {
    uiCSSColorVariableNames = gui.getColors();
  };
})();
getListOfUIColorCSSVariableNames();

const range = (n, fn) => new Array(n).fill(0).map((_, i) => fn(i));

// eslint-disable-next-line no-constant-condition
if (false) {
  const s = {
    speed: 0.5,
    color: [0.2, 0.9, 0.5],
  };
  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI(div);
  //gui.add(s, 'speed', {min: 0, max: 100, step: 1});
  gui.addColor(s, 'color');
}

// eslint-disable-next-line no-constant-condition
const showUI = true;
if (showUI) {
  const s = {
    speed: 0.5,
    direction: 45,
    friction: 0.01,
    fStop: 5.6,
    focalLength: 50,
    iso: 100,
    frame: 200,
    run: true,
    animal: 'Bird',
    dessert: 'Pie',
    viscosity: 0.5,
    shoes: 1,
    hour: 2,
    show: () => {
     log(JSON.stringify(s));
    },
    background: '#123456',
    period1: 1,
    period2: 1.37,
    name: 'gman',
    hobby: 'coding',
    propertyWithLongName: 0,
    vec: [10, 20],
    c2: '#123456',
  };

  for (let i = 0; i < 3; ++i) {
    const div = document.createElement('div');
    uiElem.appendChild(div);
    const gui = new GUI(div);
    gui.add(s, 'speed', 0, 100, 1);
    gui.add(s, 'direction', {min: 0, max: 360, step: 1}).listen();
    gui.add(s, 'friction', {min: 0, max: 1});
    gui.addController(new Slider(s, 'fStop', {
      min: 0.7,
      max: 40,
      step: 0.01,
      unit: 0.1,
      unitSize: 30,
      ticksPerUnit: 10,
      tickHeight: 0.5,
      orientation: 'up',
    }));
    gui.addController(new Slider(s, 'focalLength', {
      min: 6,
      max: 800,
      step: 1,
      unit: 10,
      unitSize: 40,
      ticksPerUnit: 5,
    }));
    gui.addController(new Slider(s, 'iso', {
      min: 100,
      max: 25000,
      step: 100,
      unit: 200,
      unitSize: 4,
      ticksPerUnit: 1,
      limits: false,
      labelFn: () => '',
      thicksColor: 'var(--range-color)',
    }));
    gui.addController(new Slider(s, 'frame', {
      min: 100,
      max: 25000,
      step: 0.5,
      unit: 10,
      unitSize: 30,
      ticksPerUnit: 15,
      thicksColor: 'transparent',
    }));

    gui.addDivider();
    gui.add(s, 'run');
    gui.addLabel('Pet');
    gui.addController(new Select(s, 'animal', {keyValues: ['Cat', 'Bird', 'Dog']})).listen();
    gui.addController(new RadioGrid(s, 'dessert', {keyValues: ['Cake', 'Pie', 'Ice Cream', 'Cupcake', 'Brownie'], cols: 2})).listen();
    gui.addController(new Select(s, 'viscosity', {keyValues: [['Slow', 0.1], ['Medium', 0.5], ['Fast', 1.0]]}));
    gui.addController(new Select(s, 'shoes', {keyValues: {'Loafers': 0, 'Sandals': 1, 'Sneakers': 2}}));
    gui.addColor(s, 'background').onChange((v) => {
      document.body.style.backgroundColor = v;
    }).listen();
    gui.add(s, 'show', {name: 'Show Current Values'});
    gui.add({updateDisplay: () => gui.updateDisplay()}, 'updateDisplay');

    if (i === 2) {
      gui.name('Disabled');
      gui.disable();
    }

    {
      const f = gui.addFolder('Submenu');
      const c = f.addCanvas('signal');
      f.add(s, 'period1', {min: 0.1, max: 4});
      f.add(s, 'period2', {min: 0.1, max: 4});
      f.add(s, 'name').listen();
      f.add(s, 'hobby').onFinishChange(e => log(new Date(), e.value));
      f.add(s, 'propertyWithLongName', ['longNamedEnumThatWillPushSizeTooFar']);
      f.addController(new Direction(s, 'direction')).listen();
      f.addController(new Direction(s, 'hour', {
        step: 360 / 12, conversion: {
          to: v => {
            const newV = (v - 3) * 360 / 12;
            console.log('to:', v, newV);
            return newV;
          },
          from: v => {
            const newV = v * 12 / 360 + 3;
            console.log('from:', v, newV);
            return [true, newV];
          },
        },
      })).listen();
      f.addController(new Vec2(s, 'vec', {range: 100})).listen();
      f.addController(new ColorChooser(s, 'c2'));//.listen();

      const ctx = c.canvas.getContext('2d');
      let lastY = 0;
      let lTime1 = 0;
      let lTime2 = 0;
      let then = 0;
      // eslint-disable-next-line no-loop-func
      const draw = (now) => {
        const elapsedTime = now - then;
        then = now;
        lTime1 += elapsedTime * s.period1;
        lTime2 += elapsedTime * s.period2;
        const res = 2;
        resizeCanvasToDisplaySize(ctx.canvas, res);

        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        if (width && height) {
          ctx.save();
          ctx.globalCompositeOperation = 'copy';
          ctx.drawImage(
              ctx.canvas,
              res, 0, width - res, height,
              0, 0, width - res, height);
          ctx.clearRect(width - res, 0, res, height);
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = uiCSSColorVariableNames.color;
          const s1 = Math.sin(lTime1 * 0.01);
          const s2 = Math.sin(lTime2 * 0.01);
          const newY = height / 2 + (s1 + s2) * (height - 1) / 4;
          ctx.beginPath();
          ctx.lineTo(width - res * 2, lastY);
          ctx.lineTo(width - 1, newY);
          ctx.stroke();
          lastY = newY;
        }
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
    }

    {
      const f = gui.addFolder('Folder with a long long long long long long long name');
      f.addButton('button with a long long long long long long long name', () => {});
    }
  }

}

if (showUI) {
  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI({parent: div, title: 'Disabled Folder'});

  const folders = range(3, (i) => {
    const settings = {
      name: 'test',
      speed: 45,
      toggle: true,
      animal: 'bird',
    };
    const folder = gui.addFolder(`folder:${i}`);
    folder.add(settings, 'name');
    folder.add(settings, 'speed', 0, 100);
    folder.add(settings, 'toggle');
    folder.add(settings, 'animal', ['bird', 'cat', 'dog']);
    return folder;
  });

  folders[1].enable(false);
}

// Using Sliders
if (showUI) {
  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI({parent: div, title: 'Sliders'});

  const s = {
    angleRad: Math.PI,
    angleDeg: 180,
    tempC: 20,
    tempF: 72,
    ticks: 7,
  };
  const logger = new Logger(3);
  const log = logger.log;

  gui.add([1], '0', {min: 0, max: 1}).name('0 ↔ 1');
  gui.add([100], '0', {min: 0, max: 200}).name('0 ↔ 200');
  gui.add([100000], '0', {min: 0, max: 1000000}).name('0 ↔ 1000000');
  gui.add([1e+30], '0', {min: -1e+50, max: 1e+50}).name('-1e+50 ↔ 1e+50');

  const degToRad = d => d * Math.PI / 180;
  const radToDeg = r => r * 180 / Math.PI;
  gui.add(s, 'angleRad', {min: -360, max: 360, step: 1, converters: {to: radToDeg, from: v => [true, degToRad(v)]}})
      .name('rad ↔ deg')
      .onChange(v => log('rad:', v));
  gui.add(s, 'angleDeg', {min: -Math.PI * 2, max: Math.PI * 2, step: 0.001, converters: {to: degToRad, from: v => [true, radToDeg(v)]}})
      .name('deg ↔ rad')
      .onChange(v => log('deg:', v));

  const cToF = c => (c * (212 - 32) / 100) + 32;
  const fToC = f => (f - 32) * 100 / (212 - 32);
  gui.add(s, 'tempC', {min: 32, max: 212, step: 0.1, converters: {to: cToF, from: v => [true, fToC(v)]}})
      .name('C° ↔ F°')
      .onChange(v => log(`${v}C°`));
  gui.add(s, 'tempF', {min: 0, max: 100, step: 0.1, converters: {to: fToC, from: v => [true, cToF(v)]}})
      .name('F° ↔ C°')
      .onChange(v => log(`${v}F°`));
  logger.setController(gui.addLabel(''));
}

// Using TextNumber
if (showUI) {
  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI({parent: div, title: 'Numbers'});

  const s = {
    angleRad: Math.PI,
    angleDeg: 180,
    tempC: 20,
    tempF: 72,
  };
  const logger = new Logger(3);
  const log = logger.log;

  gui.addController(new TextNumber([123], '0'))
     .name('xxx')
     .onChange(v => log(v));
  gui.add(new TextNumber([456.78], '0'))
     .name('xxx.xx')
     .onChange(v => log(v));

  const degToRad = d => d * Math.PI / 180;
  const radToDeg = r => r * 180 / Math.PI;
  gui.add(new TextNumber(s, 'angleRad', {converters: {to: radToDeg, from: v => [true, degToRad(v)]}, step: 1}))
      .name('rad ↔ deg')
      .onChange(v => log('rad:', v));
  gui.add(new TextNumber(s, 'angleDeg', {converters: {to: degToRad, from: v => [true, radToDeg(v)]}, step: 0.001}))
      .name('deg ↔ rad')
      .onChange(v => log('deg:', v));

  const cToF = c => (c * (212 - 32) / 100) + 32;
  const fToC = f => (f - 32) * 100 / (212 - 32);
  gui.add(new TextNumber(s, 'tempC', {converters: {to: cToF, from: v => [true, fToC(v)]}, step: 0.1}))
      .name('C° ↔ F°')
      .onChange(v => log(`${v}C°`));
  gui.add(new TextNumber(s, 'tempF', {converters: {to: fToC, from: v => [true, cToF(v)]}, step: 0.1}))
      .name('F° ↔ C°')
      .onChange(v => log(`${v}F°`));

  logger.setController(gui.addLabel(''));
}

if (showUI) {
  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI({parent: div, title: 'Callbacks'});

  const changes = { onChange: 0, onFinishChange: 0 };
  const change = () => changes.onChange++;
  const finishChange = () => {
    console.log('fiinsh change');
    changes.onFinishChange++;
  };

  const folder = gui.addFolder('Counts');
  folder.add(changes, 'onChange').disable().listen();
  folder.add(changes, 'onFinishChange').disable().listen();

  // gui.add(objectToEdit, propName, ...)
  gui.add({Number: 0}, 'Number').onChange(change).onFinishChange(finishChange);
  gui.add({String: 'foo'}, 'String').onChange(change).onFinishChange(finishChange);
  gui.add({Boolean: true}, 'Boolean').onChange(change).onFinishChange(finishChange);
  gui.add({Slider: 0}, 'Slider', {min: 0, max: 1}).onChange(change).onFinishChange(finishChange);
  gui.add({Select: 'pear'}, 'Select', ['apple', 'banana', 'pear']).onChange(change).onFinishChange(finishChange);
  gui.addColor({Color: '#FEDCBA'}, 'Color').onChange(change).onFinishChange(finishChange);
  gui.add({func() {}}, 'func').onChange(change).onFinishChange(finishChange);
}

if (showUI) {
  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI(div).name('Colors');

  const logger = new Logger(3);
  const log = logger.log;
  const f3 = v => +v.toFixed(3);

  const addColor = (label, color, format, formatter = JSON.stringify) => {
    const c = {color};
    gui.addColor(c, 'color', {format})
        .name(label)
        .onChange(v => log(formatter(v)));
  };

  addColor('"#RRGGBB"', '#569AEF');
  addColor('"RRGGBB"', 'EF569A');
  addColor('"#RGB"', '#F88');
  addColor('"RGB"', '8F8');
  addColor('"rgb(r, g, b)"', 'rgb(170,68,240)');
  addColor('"hsl(h, s, l)"', 'hsl(170,100%,50%)');
  addColor('0xRRGGBB', 0xFEA956, 'uint32-rgb', v => `0x${v.toString(16).padStart(6, '0')}`);
  addColor('[r(u8), b(u8), c(u8)]', [255, 192, 255], 'uint8-rgb');
  addColor('Uint8Array(3)', new Uint8Array([75, 150, 225]), undefined, v => `[${v.join(', ')}]`);
  // note: Because it's Float32Array, if we just use  map  it won't work because
  // map of a Float32Array creates a new Float32Array where as we want an array
  // of strings so we can format them for the log.
  addColor('Float32Array(3)', new Float32Array([0.9, 0.7, 0.5]), undefined, v => `[${Array.from(v).map(v => f3(v)).join(', ')}]`);
  addColor('[r(f), g(f), b(f)]', [0.2, 0.9, 0.5], undefined, v => `[${v.map(v => f3(v))}]`);
  addColor('{r, g, b}',  {r: 0, g: 0, b: 1}, undefined, v => `{r: ${f3(v.r)}, g: ${f3(v.g)}, b: ${f3(v.b)}}`);
  gui.addLabel('rgba');
  addColor('#RRGGBBAA', '#5438a180');
  addColor('0xRRGGBBAA', 0xEF569A80, 'uint32-rgba');
  addColor('rgba(r, g, b, a)', 'rgba(64, 128, 255, 0.25)');
  addColor('hsl(h, s, l / a)', 'hsl(180 100% 50% / 0.75)');
  logger.setController(gui.addLabel(''));
}

if (showUI) {
  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI(div).name('Material');

  const s = model(gui.addCanvas('canvas').canvas);
  gui.addColor(s.material, 'color').name('material color');
  gui.add(s.material, 'shininess', {min: 0, max: 300});
  gui.addColor(s.light, 'color').name('light color');
  gui.add(s.light, 'intensity', {min: 0, max: 5, step: 0.01});
  gui.add(s.camera, 'fov', {min: 1, max: 179}).name('field of view');
}

if (showUI) {
  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI({parent: div, title: 'Add/Remove'});
  const c = gui.addCanvas('waves');
  const controllers = [];
  const periods = [];

  const addRow = () => {
    const id = controllers.length;
    periods.push(Math.random() * 2.5 + 0.5);
    controllers.push(gui.add(periods, id, 0, 3).name(`input ${id + 1}`));
  };

  const delRow = () => {
    const row = controllers.pop();
    if (row) {
      periods.pop();
      gui.remove(row);
    }
  };

  const s = {separate: true};
  gui.add(s, 'separate');
  gui.add({Add: addRow}, 'Add');
  gui.add({Del: delRow}, 'Del');
  addRow();
  addRow();
  addRow();

  const ctx = c.canvas.getContext('2d');
  let then = 0;
  let ticks = 0;
  const lastYs = [];
  const times = [];

  const draw = (now) => {
    ++ticks;
    const elapsedTime = now - then;
    then = now;

    const res = 2;
    resizeCanvasToDisplaySize(ctx.canvas, 2);

    const rowsNeeded = controllers.length - lastYs.length;
    if (rowsNeeded > 0) {
      lastYs.push(...(new Array(rowsNeeded).fill(0)));
      times.push(...(new Array(rowsNeeded).fill(0)));
    }

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    if (width && height) {
      ctx.globalCompositeOperation = 'copy';
      ctx.drawImage(
          ctx.canvas,
          res, 0, width - res, height,
          0, 0, width - res, height);
      ctx.globalCompositeOperation = 'source-over';
      const x = width - res;
      ctx.fillStyle = ticks % 16 === 0 ? uiCSSColorVariableNames.menuSepColor : uiCSSColorVariableNames.menuBgColor;
      ctx.fillRect(x, 0, res, height);
      ctx.fillStyle = uiCSSColorVariableNames.menuSepColor;
      for (let y = 8; y < height; y += 16) {
        ctx.fillRect(x, y, 1, 1);
      }
      for (let i = 0; i < controllers.length; ++i) {
        const l = i / controllers.length;
        const scale = s.separate ? 1 / controllers.length : 1;
        ctx.save();
        if (s.separate) {
          ctx.translate(0, l * height);
          ctx.scale(1, scale);
        }
        times[i] += elapsedTime * periods[i];
        const sine = Math.sin(times[i] * 0.01);
        const lastY = lastYs[i];
        const newY = height / 2 + sine * (height - 2) / 2;

        ctx.strokeStyle = hsl(l, 1, 0.7);
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.lineTo(x - 1, lastY);
        ctx.lineTo(x, newY);
        ctx.stroke();
        //ctx.fillRect(x, Math.min(lastY, newY), 1, Math.abs(lastY - newY) + 1 / scale);
        lastYs[i] = newY;
        ctx.restore();
      }
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}

if (showUI) {
  const makeGUI = (title, num) => {
    const gui = new GUI({title}).hide();
    for (let i = 0; i < num; ++i) {
      gui.add([Math.random()], '0', {min: 0, max: 1}).name(`value ${i}`);
    }
    return gui;
  };

  const guis = {
    short: makeGUI('Short', 5),
    long: makeGUI('Long', 150),
  };

  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI({parent: div, title: 'AutoPlace'});
  gui.add({option: 'none'}, 'option', ['none', 'short', 'long'])
      .onChange(v => {
        for (const [name, gui] of Object.entries(guis)) {
          gui.show(name === v);
        }
      });
}

{
  const pageCSS = `
      #ui-helper {
        display: grid;
        grid-template-columns: repeat(auto-fit, 250px); /* as as column width */
        gap: 10px; /* same as column gap */
      }
      #ui {
        columns: 250px;
        column-gap: 10px;
        orphans: 1;
        widows: 1;
        grid-column: 1 / -1; /* take all the columns of the grid*/
      }
      #ui>div {
        break-inside: avoid-column;
        margin-bottom: 1em;
        display: inline-block;
      }
  `;
  const themes = {
    default: {
      muigui: '/* empty */',
      page: '',
    },
    'default-mono': {
      muigui: `
        .muigui {
           --font-family: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
        }
      `,
      page: pageCSS,
    },
    light: {
      muigui: `
        .muigui-colors {
          --bg-color: #f6f6f6;
          --color: #3d3d3d;
          --value-color: #2b95a1;
          --value-bg-color: #e8e8e8;
          --disabled-color: #cccccc;
          --menu-bg-color: #eeeeee;
          --menu-sep-color: #bbbbbb;
          --hover-bg-color: #f0f0f0;
          --invalid-color: #FF0000;
          --selected-color: rgba(0, 0, 0, 0.1);
        }
      `,
      page: '',
    },
    'solarized-light': {
      muigui: `
        .muigui-colors {
          --bg-color: #fdf6e3;
          --color: #657b83;
          --value-color: #2aa0f3;
          --value-bg-color: #e8e8e8;
          --disabled-color: #cccccc;
          --menu-bg-color: #f5efdc;
          --menu-sep-color: #bbbbbb;
          --hover-bg-color: #e7e1cf;
          --invalid-color: #FF0000;
          --selected-color: rgba(0, 0, 0, 0.1);
        }
      `,
      page: pageCSS,
    },
    'solarized-dark': {
      muigui: `
        .muigui-colors {
          --bg-color: #002b36;
          --color: #b2c2c2;
          --value-color: #5abaff;
          --value-bg-color: #094e5f;
          --disabled-color: #3876a1;
          --menu-bg-color: #001f27;
          --menu-sep-color: #004e62;
          --hover-bg-color: #0a6277;
          --invalid-color: #FF6666;
        }
      `,
      page: '',
    },
    'bubble-dark': {
      muigui: `
        .muigui {
          --border-radius: 1em;
        }
      `,
      page: pageCSS,
    },
    'float': {
      muigui: `
        :root {
          color-scheme: light dark,
        }

        .muigui {
          --width: 400px;
          --bg-color: inherit;
          --color: inherit;
          --label-width: 25%;
        }

        input {
            text-shadow:
             -1px -1px 0 #FFF,
              1px -1px 0 #FFF,
             -1px  1px 0 #FFF,
              1px  1px 0 #FFF;
        }
        .muigui-label-controller>label {
            text-shadow:
             -1px -1px 0 #000,
              1px -1px 0 #000,
             -1px  1px 0 #000,
              1px  1px 0 #000;
        }

        .muigui-root>*:nth-child(1) {
            display: none;
        }

        .muigui-range input[type=range]::-webkit-slider-thumb {
          border-radius: 1em;
        }

        .muigui-range input[type=range]::-webkit-slider-runnable-track {
          -webkit-appearance: initial;
          appearance: none;
          border: 1px solid rgba(0, 0, 0, 0.25);
          height: 2px;
        }

        .muigui-colors {
          --value-color: #000000;
          --value-bg-color: rgba(0, 0, 0, 0.1);
          --disabled-color: #cccccc;
          --menu-bg-color: rgba(0, 0, 0, 0.1);
          --menu-sep-color: #bbbbbb;
          --hover-bg-color: rgba(0, 0, 0, 0);
          --invalid-color: #FF0000;
          --selected-color: rgba(0, 0, 0, 0.3);
          --range-color: rgba(0, 0, 0, 0.125);
        }
      `,
      page: `
      #ui-helper {
        display: block;
      }
      #ui {
        columns: none;
      }
      #ui>div {
        break-inside: avoid-column;
        margin-bottom: 1em;
        display: block;
      }

      body {
        background: rgb(34,193,195);
        background: linear-gradient(209deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%);
      }
      `,
    },
    'form': {
      muigui: `
        :root {
          color-scheme: light dark,
        }
        .muigui {
          --width: 600px;
          --font-family: inherit;
          --font-size: medium;
          --font-family-mono: inherit;
          --font-size-mono: medium;
          --bg-color: inherit;
          --color: inherit;
        }

        .muigui-colors {
          --value-color: #2b95a1;
          --value-bg-color: #e8e8e8;
          --disabled-color: #cccccc;
          --menu-bg-color: #eeeeee;
          --menu-sep-color: #bbbbbb;
          --hover-bg-color: #f0f0f0;
          --invalid-color: #FF0000;
          --selected-color: rgba(0, 0, 0, 0.1);
        }
      `,
      page: pageCSS,
    },
  };

  const cssColorRE = /^\s*(#|rgb|hsl|lab|hwb|lab|lch|oklch|oklab)/;
  const looksLikeCSSColor = s => cssColorRE.test(s);

  const cssColorToRGBA8 = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    return cssColor => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = cssColor;
      ctx.fillRect(0, 0, 1, 1);
      return Array.from(ctx.getImageData(0, 0, 1, 1).data);
    };
  })();

  const cssStringToHexColor = s => `#${cssColorToRGBA8(s).slice(0, 3).map(v => v.toString(16).padStart(2, '0')).join('')}`;


  // --------------- [ get list of CSS variables that affect GUI ] -----------------
  const selectors = ['.muigui', '.muigui-colors'];
  const varNamesBySelector = selectors.map(selector => ({
    selector,
    vars: getCSSRulesBySelector(selector, GUI.getBaseStyleSheet())
           .map(rule => Object.values(rule.style)
              .filter(s => s.startsWith('--') && !rule.style.getPropertyValue(s).trim().startsWith('var'))
              .map(s => ({key: s, rule}))).flat(),
    }));

  const showStyles = false;

  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI(div).name('Appearance');
  gui.addController(new Select({theme: 'default'}, 'theme', {keyValues: [...Object.keys(themes)]})).onChange(v => {
    GUI.setUserStyles(themes[v].muigui);
    document.querySelector('#theme').innerText = themes[v].page;
    if (showStyles) {
      updateGUIValuesWithCurrentCSSValues();
    }
  });

  const controllersByKey = {};
  if (showStyles) {
    const fns = {
      '--width': (v) => {
        uiElem.style.columnWidth = v;
        uiElem.parentElement.style.gridTemplateColumns = `repeat(auto-fit, ${v})`;
      },
    };

    // --------------- [ make a GUI for each CSS variable that affects GUI ] -----------------
    const obj = {};

    const folder = gui.addFolder('Style');
    for (const {vars} of varNamesBySelector) {
      for (const {key, rule} of vars) {
        const value = rule.style.getPropertyValue(key).trim();
        if (looksLikeCSSColor(value)) {
          obj[key] = cssStringToHexColor(value);
          controllersByKey[key] = folder.addColor(obj, key).onChange(updateMuiguiCSSStyles);
        } else if (!value.startsWith('var')){
          obj[key] = value;
          controllersByKey[key] = folder.add(obj, key).onChange(v => {
            const fn = fns[key];
            if (fn) {
              fn(v);
            }
            updateMuiguiCSSStyles();
          });
        }
      }
    }

    // --------------

    const updateMuiguiCSSStyles = () => {
      const css = varNamesBySelector.map(({selector, vars}) => `
      ${selector} {
        ${
          vars.map(({key}) => `${key}: ${obj[key]};`).join('\n')
        }
      }
      `).join('\n');
      GUI.setUserStyles(css);
    };
  }

  // --------------
  const updateGUIValuesWithCurrentCSSValues = () => {
    const map = new Map();
    for (const selector of selectors) {
      for (const rule of getCSSRulesBySelector(selector, GUI.getBaseStyleSheet())) {
        const varNames = Object.values(rule.style).filter(s => s.startsWith('--'));
        for (const key of varNames) {
          const value = rule.style.getPropertyValue(key).trim();
          map.set(key, value);
        }
      }
      map.forEach((value, key) => {
        const controller = controllersByKey[key];
        if (controller) {
          controller.setValue(looksLikeCSSColor(value) ? cssStringToHexColor(value) : value);
        } else {
          console.warn(`no setting in this theme for: ${key}`);
        }
      });
    }
    getListOfUIColorCSSVariableNames();
  };
}
