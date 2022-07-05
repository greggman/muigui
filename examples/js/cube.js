import * as THREE from '../3rdParty/threejs/build/three.module.js';
import {TrackballControls} from '../3rdParty/threejs/examples/jsm/controls/TrackballControls.js';

export function cube(canvas) {
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true});

  const scene = new THREE.Scene();

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 1, 2);
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  const controls = new TrackballControls(camera, canvas);

  const light = (() => {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    camera.add(light);
    return light;
  })();

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({color: 'red'});
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  function update(time, rect) {
    mesh.rotation.y = time * .1;
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    controls.handleResize();
    controls.update();
    renderer.render(scene, camera);
  };

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    resizeRendererToDisplaySize(renderer);

    const {width, height} = canvas;
    update(time, {width, height});
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  return {
    camera,
    light,
    material,
  };
}
