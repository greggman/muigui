
import {cube} from './cube.js';
import Logger from './logger.js';
import {
  getCSSRulesBySelector,
  resizeCanvasToDisplaySize,
  hsl,
} from './utils.js';

const Direction = GUI.Direction; // from '../../src/controllers/Direction.js';
const Vec2 = GUI.Vec2; // from '../../src/controllers/Vec2.js';
const ColorChooser = GUI.ColorChooser; // from '../../src/controllers/ColorChooser.js';
const RadioGrid = GUI.RadioGrid; // from '../../src/controllers/RadioGrid.js';
const Slider = GUI.Slider; // from '../../src/controllers/Slider.js';
const Select = GUI.Select; // from '../../src/controllers/Select.js';
const Range = GUI.Range; // from '../../src/controllers/Range.js';
const TextNumber = GUI.TextNumber; // from '../../src/controllers/TextNumber.js';

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
let uiColors;
const updateUIColors = (() => {
  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI(div).hide();
  return function updateUIColors() {
    uiColors = gui.getColors();
  };
})();
updateUIColors();

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

if (true) {
{
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

    if (i === 2) {
      gui.name('Disabled');
      gui.disable();
    }

    const f = gui.addFolder('Submenu');
    const c = f.addCanvas('signal');
    f.add(s, 'period1', {min: 0.1, max: 4});
    f.add(s, 'period2', {min: 0.1, max: 4});
    f.add(s, 'name').listen();
    f.add(s, 'hobby').onFinishChange(e => log(new Date(), e.value));
    f.add(s, 'propertyWithLongName', ['longNamedEnumThatWillPushSizeTooFar']);
    f.addController(new Direction(s, 'direction')).listen();
    f.addController(new Direction(s, 'hour', {step: 360 / 12, conversion: {
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
    }})).listen();
    f.addController(new Vec2(s, 'vec', {range: 100})).listen();
    f.addController(new ColorChooser(s, 'c2')).listen();

    const ctx = c.canvas.getContext('2d');
    let lastY = 0;
    let lTime1 = 0;
    let lTime2 = 0;
    let then = 0;
    function draw(now) {
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
        ctx.strokeStyle = uiColors.color;
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
    }
    requestAnimationFrame(draw);
  }
}

// Using Sliders
{
  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI({parent: div, title: 'Sliders'});

  const s = {
    angleRad: Math.PI,
    angleDeg: 180,
    tempC: 20,
    tempF: 72,
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
{
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

{
  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI({parent: div, title: 'Callbacks'});

  const changes = { onChange: 0, onFinishChange: 0 };
  const change = () => changes.onChange++;
  const finishChange = () => changes.onFinishChange++;

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

{
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
  addColor('0xRRGGBB', 0xFEA956, undefined, v => `0x${v.toString(16).padStart(6, '0')}`);
  addColor('[r(u8), b(u8), c(u8)]', [255, 192, 255], 'uint8-rgb');
  addColor('Uint8Array(3)', new Uint8Array([75, 150, 225]), undefined, v => `[${v.join(', ')}]`);
  // note: Because it's Float32Array, if we just use  map  it won't work because
  // map of a Float32Array creates a new Float32Array where as we want an array
  // of strings so we can format them for the log.
  addColor('Float32Array(3)', new Float32Array([0.9, 0.7, 0.5]), undefined, v => `[${Array.from(v).map(v => f3(v)).join(', ')}]`);
  addColor('[r(f), g(f), b(f)]', [0.2, 0.9, 0.5], undefined, v => `[${v.map(v => f3(v))}]`);
  addColor('{r, g, b}',  {r: 0, g: 0, b: 1}, undefined, v => `{r: ${f3(v.r)}, g: ${f3(v.g)}, b: ${f3(v.b)}}`);
  logger.setController(gui.addLabel(''));
}

{
  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI(div).name('Material');

  const s = cube(gui.addCanvas('canvas').canvas);
  gui.addColor(s.material, 'color').name('material color');
  gui.add(s.material, 'shininess', {min: 0, max: 300});
  gui.addColor(s.light, 'color').name('light color');
  gui.add(s.light, 'intensity', {min: 0, max: 5, step: 0.01});
  gui.add(s.camera, 'fov', {min: 1, max: 179}).name('field of view');
}

{
  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI({parent: div, title: 'Add/Remove'});
  const c = gui.addCanvas('waves');
  const controllers = [];
  const periods = [];

  function addRow() {
    const id = controllers.length;
    periods.push(Math.random() * 2.5 + 0.5);
    controllers.push(gui.add(periods, id, 0, 3).name(`input ${id + 1}`));
  }

  function delRow() {
    const row = controllers.pop();
    if (row) {
      periods.pop();
      gui.remove(row);
    }
  }

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

  function draw(now) {
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
      ctx.fillStyle = ticks % 16 === 0 ? uiColors.menuSepColor : uiColors.menuBgColor;
      ctx.fillRect(x, 0, res, height);
      ctx.fillStyle = uiColors.menuSepColor;
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
  }
  requestAnimationFrame(draw);
}

{
  function makeGUI(title, num) {
    const gui = new GUI({title}).hide();
    for (let i = 0; i < num; ++i) {
      gui.add([Math.random()], '0', {min: 0, max: 1}).name(`value ${i}`);
    }
    return gui;
  }

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

const updateAppearance = function() {

  const themeElem = document.createElement('style');
  document.head.appendChild(themeElem);
  const styleElem = document.createElement('style');
  document.head.appendChild(styleElem);

  const themes = {
    default: '',
    'default-mono': `
        .muigui {
           --font-family: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
        }
    `,
    light: `
        .muigui {
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
    'solarized-light': `
        .muigui {
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
    'solarized-dark': `
        .muigui {
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
    'bubble-dark': `
        .muigui {
          --border-radius: 1em;
        }
    `,
    'form': `
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
  };

  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI(div).name('Appearance');
  gui.addController(new Select({theme: 'default'}, 'theme', {keyValues: [...Object.keys(themes)]})).onChange(v => {
    themeElem.textContent = themes[v];
    styleElem.textContent = '';
    updateAppearance();
  });

  const cssStringToHexColor = s => s.length === 7
     ? s
     : `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`;

  const fns = {
    '--width': (v) => {
      uiElem.style.columnWidth = v;
      uiElem.parentElement.style.gridTemplateColumns = `repeat(auto-fit, ${v})`;
    },
  };

  const folder = gui.addFolder('Style');
  const rule = getCSSRulesBySelector('.muigui')[0];  // assuming the first one
  const varNames = Object.values(rule.style).filter(s => s.startsWith('--'));
  const obj = {};
  const controllersByKey = {};

  const updateStyles = () => {
    styleElem.textContent = `.muigui {\n${
      [...Object.entries(obj)].map(([key, value]) => {
        return `${key}: ${value};`;
      }).join('\n')}\n}`;
    updateUIColors();
  };

  for (const key of varNames) {
    const value = rule.style.getPropertyValue(key).trim();
    if (value.startsWith('#')) {
      obj[key] = cssStringToHexColor(value);
      controllersByKey[key] = folder.addColor(obj, key).onChange(updateStyles);
    } else if (!value.startsWith('var')){
      obj[key] = value;
      controllersByKey[key] = folder.add(obj, key).onChange(v => {
        const fn = fns[key];
        if (fn) {
          fn(v);
        }
        updateStyles();
      });
    }
  }

  return function() {
    const map = new Map();
    for (const rule of getCSSRulesBySelector('.muigui')) {
      const varNames = Object.values(rule.style).filter(s => s.startsWith('--'));
      for (const key of varNames) {
        const value = rule.style.getPropertyValue(key).trim();
        map.set(key, value);
      }
    }
    map.forEach((value, key) => {
      const controller = controllersByKey[key];
      if (controller) {
        controller.setValue(value);
      } else {
        console.warn(`no setting in this theme for: ${key}`);
      }
    });
    updateUIColors();
  };
}();

}
