
import {GUI} from '../../src/muigui.js';
import {cube} from './cube.js';
import Logger from './logger.js'
import {
  getCSSRulesBySelector,
  resizeCanvasToDisplaySize,
  hsl,
} from './utils.js';

//import Pane from '../../src/layouts/pane.js';
//import Row from '../../src/layouts/row.js';
//import Tabs from '../../src/layouts/tab.js';
//import Column from '../../src/layouts/column.js';

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


//{
//  const div = document.createElement('div');
//  div.className = '.foobar';
//  uiElem.appendChild(div);
//
//  const outer = new Pane();
//  outer.domElement.style.width = '250px';
//
//  outer.add(new Row());
//  outer.add(new Row());
//  outer.add(new Row());
//  const row = outer.add(new Row());
//  const pane = row.add(new Pane());
//  const col1 = pane.add(new Column());
//  col1.domElement.style.flex = '0 0 auto';
//  const col2 = pane.add(new Column());
//  const col3 = pane.add(new Column());
//
//  div.appendChild(outer.domElement);
//}

{
  const s = {
    speed: 0.5,
    direction: 45,
    friction: 0.01,
    run: true,
    animal: 'Bird',
    viscosity: 0.5,
    shoes: 1,
    show: () => { log(JSON.stringify(s)); },
    background: '#123456',
    period1: 1,
    period2: 1.37,
    name: 'gman',
    hobby: 'coding',
    propertyWithLongName: 0,
  };

  for (let i = 0; i < 3; ++i) {
    const div = document.createElement('div');
    uiElem.appendChild(div);
    const gui = new GUI(div);
    gui.add(s, 'speed', 0, 100, 1); 
    gui.add(s, 'direction', 0, 360, 1).listen();
    gui.add(s, 'friction', 0, 1);
    gui.addDivider();
    gui.add(s, 'run');
    gui.addLabel('Pet');
    gui.add(s, 'animal', ['Cat', 'Bird', 'Dog']).listen();
    gui.add(s, 'viscosity', [['Slow', 0.1], ['Medium', 0.5], ['Fast', 1.0]]);
    gui.add(s, 'shoes', {"Loafers": 0, "Sandals": 1, "Sneakers": 2});
    gui.addColor(s, 'background').listen().onChange((e) => {
      document.body.style.backgroundColor = e.value;
    });
    gui.add(s, 'show').name('Show Current Values');

    if (i === 2) {
      gui.name('Disabled');
      gui.disable();
      if (false) {
        const g = gui;
        setTimeout(() => {
          g.enable();
        }, 3000);
      }
    }

    const f = gui.addFolder('Submenu');
    const c = f.addCanvas('signal');
    f.add(s, 'period1', 0.1, 4);
    f.add(s, 'period2', 0.1, 4);
    f.add(s, 'name').listen();  
    f.add(s, 'hobby').onFinishChange(e => log(new Date, e.value));
    f.add(s, 'propertyWithLongName', ['longNamedEnumThatWillPushSizeTooFar']);

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
      const width = ctx.canvas.width / res;
      const height = ctx.canvas.height / res;
      ctx.save();
      ctx.scale(res, res);
      ctx.globalCompositeOperation = 'copy';
      ctx.drawImage(
          ctx.canvas,
          1 * res, 0, (width - 1) * res, height * res,
          0, 0, width - 1, height);
      ctx.clearRect(width - 1, 0, 1, height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = uiColors.color;
      const s1 = Math.sin(lTime1 * 0.01);
      const s2 = Math.sin(lTime2 * 0.01);
      const newY = height / 2 + (s1 + s2) * (height - 1) / 4;
      ctx.beginPath();
      ctx.lineTo(width - 2, lastY);
      ctx.lineTo(width - 1, newY);
      ctx.stroke();
      //ctx.fillRect(width - 1, Math.min(lastY, newY), 1, Math.abs(lastY - newY) + 1);
      ctx.restore();
      lastY = newY;
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }
}

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

  gui.add([1], '0', 0, 1).name('0 ??? 1');
  gui.add([100], '0', 0, 200).name('0 ??? 200');
  gui.add([100000], '0', 0, 1000000).name('0 ??? 1000000');
  gui.add([1e+30], '0', -1e+50, 1e+50).name('-1e+50 ??? 1e+50');

  const degToRad = d => d * Math.PI / 180;
  const radToDeg = r => r * 180 / Math.PI;
  gui.add(s, 'angleRad', -360, 360, 1, {from: radToDeg, to: degToRad})
      .name('rad ??? deg')
      .onChange(v => log('rad:', v));
  gui.add(s, 'angleDeg', -Math.PI * 2, Math.PI * 2, 0.001, {from: degToRad, to: radToDeg})
      .name('deg ??? rad')
      .onChange(v => log('deg:', v));

  const cToF = c => (c * (212 - 32) / 100) + 32;
  const fToC = f => (f - 32) * 100 / (212 - 32);
  gui.add(s, 'tempC', 32, 212, 0.1, {from: cToF, to: fToC})
      .name('C?? ??? F??')
      .onChange(v => log(`${v}C??`));
  gui.add(s, 'tempF', 0, 100, 0.1, {from: fToC, to: cToF})
      .name('F?? ??? C??')
      .onChange(v => log(`${v}F??`));

  logger.setController(gui.addLabel(''));
}

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

  gui.add([123], '0')
     .name('xxx')
     .onChange(v => log(v));
  gui.add([456.78], '0')
     .name('xxx.xx')
     .onChange(v => log(v));

  const degToRad = d => d * Math.PI / 180;
  const radToDeg = r => r * 180 / Math.PI;
  gui.add(s, 'angleRad', {from: radToDeg, to: degToRad}, 1)
      .name('rad ??? deg')
      .onChange(v => log('rad:', v));
  gui.add(s, 'angleDeg', {from: degToRad, to: radToDeg}, 0.001)
      .name('deg ??? rad')
      .onChange(v => log('deg:', v));

  const cToF = c => (c * (212 - 32) / 100) + 32;
  const fToC = f => (f - 32) * 100 / (212 - 32);
  gui.add(s, 'tempC', {from: cToF, to: fToC}, 0.1)
      .name('C?? ??? F??')
      .onChange(v => log(`${v}C??`));
  gui.add(s, 'tempF', {from: fToC, to: cToF}, 0.1)
      .name('F?? ??? C??')
      .onChange(v => log(`${v}F??`));

  logger.setController(gui.addLabel(''));
}

{
  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI({parent: div, title: 'Callbacks'});

  const changes = { onChange: 0, onFinishChange: 0 };
  const change = _ => changes.onChange++;
  const finishChange = _ => changes.onFinishChange++;
  
  const folder = gui.addFolder('Counts');
  folder.add(changes, 'onChange').disable().listen();
  folder.add(changes, 'onFinishChange').disable().listen();

  gui.add({Number: 0}, 'Number').onChange(change).onFinishChange(finishChange);
  gui.add({String: 'foo'}, 'String').onChange(change).onFinishChange(finishChange);
  gui.add({Boolean: true}, 'Boolean').onChange(change).onFinishChange(finishChange);
  gui.add({Slider: 0}, 'Slider', 0, 1).onChange(change).onFinishChange(finishChange);
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
    gui.addColor(c, 'color', format)
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
  addColor('Float32Array(3)', new Float32Array([0.9, 0.7, 0.5]), undefined, v => `[${v.join(', ')}]`);
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
  gui.add(s.material, 'shininess', 0, 300);
  gui.addColor(s.light, 'color').name('light color');
  gui.add(s.light, 'intensity', 0, 5, 0.01);
  gui.add(s.camera, 'fov', 1, 179).name('field of view');
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
    controllers.push(gui.add(periods, id, 0, 3).name(`input ${id +1}`));
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

    const width = ctx.canvas.width / res;
    const height = ctx.canvas.height / res;
    ctx.save();
    ctx.scale(res, res);
    ctx.globalCompositeOperation = 'copy';
    ctx.drawImage(
        ctx.canvas,
        res, 0, (width - 1) * res, height * res,
        0, 0, width - 1, height);
    ctx.globalCompositeOperation = 'source-over';
    const x = width - 1;
    ctx.fillStyle = ticks % 16 === 0 ? uiColors.menuSepColor : uiColors.menuBgColor;
    ctx.fillRect(x, 0, 1, height);
    ctx.fillStyle = uiColors.menuSepColor;
    for (let y = 8; y < height; y += 16) {
      ctx.fillRect(x, y, 1, 1);
    }
    let sum = 0;
    for (let i = 0; i < controllers.length; ++i) {
      const l = i / controllers.length;
      const scale = s.separate ? 1 / controllers.length : 1;
      ctx.save();
      if (s.separate) {
        ctx.translate(0, l * height);
        ctx.scale(1, scale);
      }
      times[i] += elapsedTime * periods[i];
      const sine = Math.sin(times[i] * 0.01)
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
    ctx.restore();
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

{
  function makeGUI(title, num) {
    const gui = new GUI({title}).hide();
    for (let i = 0; i < num; ++i) {
      gui.add([Math.random()], '0', 0, 1).name(`value ${i}`);
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

let depth = 0;
const updateAppearance = function() {

  const themeElem = document.createElement('style');
  document.head.appendChild(themeElem);
  const styleElem = document.createElement('style');
  document.head.appendChild(styleElem);

  const themes = {
    default: ``,
    light: `
        .muigui {
          --bg-color: #f6f6f6;
          --color: #3d3d3d;
          --value-bg-color: #e8e8e8;
          --value-color: #2b95a1;
          --hover-bg-color: #f0f0f0;
          --menu-bg-color: #eeeeee;
          --menu-sep-color: #bbbbbb;
          --disabled-color: #cccccc;
        }
    `,
    'solarized-light': `
        .muigui {
          --bg-color: #fdf6e3;
          --color: #657b83;
          --value-bg-color: #e8e8e8;
          --value-color: #2aa0f3;
          --hover-bg-color: #e7e1cf;
          --menu-bg-color: #f5efdc;
          --menu-sep-color: #bbbbbb;
          --disabled-color: #cccccc;
        }
    `,
    'solarized-dark': `
        .muigui {
          --bg-color: #002b36;
          --color: #b2c2c2;
          --value-bg-color: #094e5f;
          --value-color: #5abaff;
          --hover-bg-color: #0a6277;
          --menu-bg-color: #001f27;
          --menu-sep-color: #004e62;
          --disabled-color: #3876a1;
        }
    `,
  };

  const div = document.createElement('div');
  uiElem.appendChild(div);
  const gui = new GUI(div).name('Appearance');
  gui.add({theme: 'default'}, 'theme', [...Object.keys(themes)]).onChange(v => {
    themeElem.textContent = themes[v];
    styleElem.textContent = '';
    updateAppearance();
  });

  const temp = document.createElement('div');
  const cssStringToHexColor = s => s.length === 7
     ? s
     : `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`;

  const fns = {
    '--width': (v) => {
      uiElem.style.columnWidth = v;
      uiElem.parentElement.style.gridTemplateColumns = `repeat(auto-fit, ${v})`;
    },
  }

  const folder = gui.addFolder('Style');
  const rule = getCSSRulesBySelector('.muigui')[0];  // assuming the first one
  const varNames = Object.values(rule.style).filter(s => s.startsWith('--'));
  const obj = {};

  const updateStyles = () => {
    styleElem.textContent = `.muigui {\n${
      [...Object.entries(obj)].map(([key, value]) => {
        return `${key}: ${value};`
      }).join('\n')}\n}`;
    updateUIColors();
  };

  for (const key of varNames) {
    const value = rule.style.getPropertyValue(key).trim();
    if (value.startsWith('#')) {
      obj[key] = cssStringToHexColor(value);
      folder.addColor(obj, key).onChange(updateStyles);
    } else if (!value.startsWith('var')){
      obj[key] = value;
      folder.add(obj, key).onChange(v => {
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
    folder.controllers.forEach(c => {
      const key = c.property;
      const value = map.get(key);
      c.setValue(value);
    });
    updateUIColors();
  };
}();
