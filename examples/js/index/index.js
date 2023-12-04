import * as twgl from '../../3rdParty/twgl-full.module.js';
import VSAEffect from './VSAEffect.js';
import effects from './effects.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GUI, { helpers, Direction, TextNumber } from '../../../src/esm.js';

const canvas = document.querySelector('#bg');
const gl = canvas.getContext('webgl');

const elements = [];

function render(time) {
  time *= 0.001;

  twgl.resizeCanvasToDisplaySize(canvas);

  canvas.style.transform = `translateX(${window.scrollX}px) translateY(${window.scrollY}px)`;

  for (const {render, elem} of elements) {
    const rect = elem.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top  > gl.canvas.clientHeight ||
        rect.right  < 0 || rect.left > gl.canvas.clientWidth) {
      continue;  // it's off screen
    }

    const width  = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const left   = rect.left;
    const bottom = gl.canvas.clientHeight - rect.bottom;

    render(gl, {
      time,
      width,
      height,
      left,
      bottom,
    });
  }
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

//const eff = Object.values(effects);
// eslint-disable-next-line no-underscore-dangle
//console.log(eff.map(e => `https://www.vertexshaderart.com/art/${e._id}`).join(' '));

const sections = {
  basic({uiElem}) {
    const gui = new GUI(uiElem);
    const vsaEffect = new VSAEffect(gl);
    const vsa = effects.discus;

    const settings = {
      numSides: 4,
      speed: 0,
      brightness: 0.1,
      opacity: 1,
      run: true,
      rotation: 0,
      split: 0.96,
      s1: 1,
      s2: 1,
      s3: 10,
      s4: 10,
      color1: [0.439, 0.463, 0.78],
      color2: [1, 1, 0],
    };
    gui.add(settings, 'run');
    gui.add(settings, 'numSides', {
      keyValues: {
        '△ triangle': 3,
        '□ square': 4,
        '⭔ pentagon': 5,
        '⬡ hexagon': 6,
        '○ circle': 48,
      },
    }).name('shape');
    //gui.add(settings, 'brightness', 0, 1);
    //gui.add(settings, 's1', 0, 1);
    //gui.add(settings, 's2', 0, 1);
    //gui.add(settings, 's3', 0, 50);
    //gui.add(settings, 's4', 0, 50);
    const degToRad = d => d * Math.PI / 180;
    const radToDeg = r => r * 180 / Math.PI;
    //gui.add(new Direction(settings, 'rotation', {
    //  converters: {
    //    to: v => { return radToDeg(v); },
    //    from: v => { const outV = degToRad(v); console.log(outV); return [true, outV]; },
    //  },
    //}));
    gui.add(settings, 'rotation', {
      min: -180,
      max: 180,
      converters: {
        to: radToDeg,
        from: v => [true, degToRad(v)],
      },
    });
    gui.add(settings, 'split', 0, 1);
    //gui.add(settings, 'count', 1, 100, 1);
    gui.addColor(settings, 'color1');
    gui.addColor(settings, 'color2');

    vsaEffect.setSettings(vsa);

    let time = 0;
    let then = 0;
    return function (gl, inputs) {
      const deltaTime = settings.run ? (inputs.time - then) : 0;
      then = inputs.time;
      time += deltaTime;
      vsaEffect.render(gl, {
        ...inputs,
        ...settings,
        time,
      }, {
        getTime() {
          return time * 44100 | 0;
        },
        getDesiredSampleRate() {
          return 44100;
        },
      }, [
        {
          frequencyBinCount: 4096,
          getByteFrequencyData(b) {
            const {s1, s2, s3, s4} = settings;
            for (let i = 0; i < b.length; ++i) {
              b[i] = (Math.sin(time * s1 + i * s3) + Math.sin(time * s2 + i * s4)) * 0.5 * 127 + 127;
            }
          },
        },
      ]);
    };
  },
  float({uiElem}) {
    const gui = new GUI(uiElem);
    gui.setTheme('float');
    const vsaEffect = new VSAEffect(gl);
    const vsa = effects.rollin;

    const settings = {
      period1: 9,
      period2: 8.17,
      p1: 1,
      p2: 1,
      heightMult: 4,
      baseColor: [0.02, 0.396, 1],
    };
    gui.add(settings, 'period1', 0.1, 20);
    gui.add(settings, 'period2', 0.1, 20);
    gui.add(settings, 'p1', 0.1, 20);
    gui.add(settings, 'p2', 0.1, 20);
    gui.add(settings, 'heightMult', 1, 10);
    gui.addColor(settings, 'baseColor');

    vsaEffect.setSettings(vsa);

    return function (gl, inputs) {
      vsaEffect.render(gl, {
        ...inputs,
        ...settings,
      }, {
        getTime() {
          return inputs.time * 44100 | 0;
        },
        getDesiredSampleRate() {
          return 44100;
        },
      }, [
        {
          frequencyBinCount: 4096,
          getByteFrequencyData(b) {
            for (let i = 0; i < b.length; ++i) {
              b[i] = Math.sin(inputs.time * 10 + i * 0.1) * 0.2 * 127 + 127;
            }
          },
        },
      ]);
    };
  },
  form({uiElem}) {
    const s = {
      name: "Jane Cheng",
      address1: "B 1, No. 5, Xuzhou R",
      address2: "Taipei 100218",
      email: "jane_c@notreally.notcom",
      receipt: true,
      currency: '$',
    };

    const gui = new GUI(uiElem).name('');
    gui.setTheme('form');
    gui.add(s, 'name');
    gui.add(s, 'address1');
    gui.add(s, 'address2');
    gui.add(s, 'email');
    gui.add(s, 'receipt');
    gui.add(s, 'currency', ['$', '¥', '€', '£', '₣']);
    gui.addButton('submit', () => {});
  },
};

document.querySelectorAll('[data-section]').forEach(elem => {
  const uiElem = elem.querySelector('.ui');
  const effectElem = elem.querySelector('.effect');
  const fn = sections[elem.dataset.section];
  if (!fn) {
    console.error(`no effect: '${elem.dataset.section}'`);
    return;
  }
  const render = fn({elem, uiElem, effectElem});
  if (render) {
    elements.push({
      elem: effectElem,
      render,
    });
  }
});

const getNextId = (() => {
  let nextId = 0;
  return function getNextId() {
    return `gui-${nextId++}`;
  };
})();

window.GUI = GUI;
window.TextNumber = TextNumber;
window.randElem = (arr) => arr[Math.random() * arr.length | 0];
window.helpers = helpers;

function getSupportCode({logId, code}) {
  return `
${code}

function log(...args) {
  const logElem = document.querySelector('#${logId}');
  logElem.className = 'log';
  const lineNo = parseInt(logElem.dataset.lineNo || 1);
  const lines = logElem.textContent.split('\\n');
  lines.push(\`\${lineNo}: \${args.join(' ')}\`);
  if (lines.length > 3) {
    lines.shift();
  }
  logElem.textContent = lines.join('\\n');
  logElem.dataset.lineNo = lineNo + 1;
}
`;
}

document.querySelectorAll('[data-example]').forEach(elem => {
  const pre = elem.querySelector('pre');
  const div = document.createElement('div');
  const id = getNextId();
  div.id = id;
  div.className = 'ui';
  elem.appendChild(div);

  const logElem = document.createElement('pre');
  const logId = getNextId();
  logElem.id = logId;
  elem.appendChild(logElem);

  const extra = elem.dataset.extraCode || '';
  const code = elem.querySelector('code').textContent
     .replace('GUI()', `GUI(document.querySelector('#${id}'))`)
     .replace(/import(.*?)'(\/.*?)'/g, `import$1'${window.location.origin}$2'`);
  const script = document.createElement('script');
  script.type = 'module';
  script.text = getSupportCode({logId, code: `${code}\n${extra}`});
  pre.appendChild(script);
});

/* global hljs */
document.querySelectorAll('pre>code').forEach(elem => {
  elem.textContent = elem.textContent.trim();
});
hljs.highlightAll();

// show min/max

// show slider
// show direction
// show vec2
// show folder
// show onChange
  // show onChange of folder
// make button function so no need for prop

// save/restore?
// show float
// show form
