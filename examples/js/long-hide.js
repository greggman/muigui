import GUI from '../../dist/0.x/muigui.module.js';
//import {GUI} from '../../src/muigui.js';

const gui = new GUI();

function addFolder(gui, name) {
  const f = gui.addFolder(name);
  for (let i = 0; i < 50; ++i) {
    f.addButton(i.toString(), () => {});
  }
}

const degToRad = deg => deg * Math.PI / 180;

const settings = {
  translation: new Float32Array([0, 0, 0]),
  rotation: new Float32Array([0, 0, 0]),
  scale: new Float32Array([1, 1, 1]),
  baseRotation: degToRad(-45),
};

const radToDegOptions = { min: -180, max: 180, step: 1, converters: GUI.converters.radToDeg };
const cameraRadToDegOptions = { min: -180, max: 180, step: 1, converters: GUI.converters.radToDeg };

gui.add(settings, 'baseRotation', cameraRadToDegOptions);
const nodeLabel = gui.addLabel('node:');
const trsFolder = gui.addFolder('orientation');
trsFolder.add(settings.translation, '0', -50, 50, 1).name('translation x');
trsFolder.add(settings.translation, '1', -50, 50, 1).name('translation y');
trsFolder.add(settings.translation, '2', -50, 50, 1).name('translation z');
trsFolder.add(settings.rotation, '0', radToDegOptions).name('rotation x');
trsFolder.add(settings.rotation, '1', radToDegOptions).name('rotation y');
trsFolder.add(settings.rotation, '2', radToDegOptions).name('rotation z');
trsFolder.add(settings.scale, '0', 0.001, 2).name('scale x');
trsFolder.add(settings.scale, '1', 0.001, 2).name('scale y');
trsFolder.add(settings.scale, '2', 0.001, 2).name('scale z');

addFolder(gui, 'one');
addFolder(gui, 'two');
addFolder(gui, 'three');
