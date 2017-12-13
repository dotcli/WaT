import * as THREE from 'three';

import getPalette from './palette';

const createOrbitViewer = require('three-orbit-viewer')(THREE);
const VerletSystem3D = require('verlet-system/3d');
const WAGNER = require('@superguigui/wagner');
const NoisePass = require('@superguigui/wagner/src/passes/noise/noise');
const RGBSplitPass = require('@superguigui/wagner/src/passes/rgbsplit/rgbsplit');
const VignettePass = require('@superguigui/wagner/src/passes/vignette/VignettePass');
const ZoomBlurPass = require('@superguigui/wagner/src/passes/zoom-blur/ZoomBlurPass');
const Bouncer = require('./bouncer');

const Y_AXIS = new THREE.Vector3(0, 1, 0);

const PALETTE = getPalette();

/* Scene */
const app = createOrbitViewer({
  clearColor: PALETTE.background,
  clearAlpha: 1,
  fov: 65,
  position: new THREE.Vector3(0, 1, 0), // camera
});
app.camera.rotation.z = 0.5 * Math.PI; // 90 degrees

// effects
app.renderer.autoClearColor = true;
const composer = new WAGNER.Composer(app.renderer);
composer.setSize(window.innerWidth, window.innerHeight);
const noisePass = new NoisePass({
  amount: 0.2,
  speed: 0,
});
const rgbSplitPass = new RGBSplitPass({
  delta: {
    x: 50,
    y: 50,
  },
});
const vignettePass = new VignettePass({
  boost: 1.2,
  reduction: 0.2,
});
const zoomBlurPass = new ZoomBlurPass({
  strength: 0.02,
});
function renderPass() {
  composer.reset();
  composer.render(app.scene, app.camera);
  // NOTE vignette pass changes color too much
  // composer.pass(vignettePass);
  composer.pass(rgbSplitPass);
  composer.pass(noisePass);
  composer.pass(zoomBlurPass);
  composer.toScreen();
}

const bouncers = [];
const BOUNCER_COUNT = 13;
const INIT_RADIUS = 0.5;
const INIT_Y = 0.5;
for (let i = 0; i < BOUNCER_COUNT; i += 1) {
  // place bouncers in a circle from the middle
  const pos = new THREE.Vector3(INIT_RADIUS, INIT_Y, 0);
  pos.applyAxisAngle(Y_AXIS, (((Math.PI * 2) / BOUNCER_COUNT) * i));

  const bouncer = new Bouncer(
    pos.x, pos.y, pos.z, // position
    10, // seg
    0.01, // segLength
    PALETTE.bouncer,
  );
  bouncers.push(bouncer);
  app.scene.add(bouncer);
}

// lighting
const directional = new THREE.DirectionalLight(0xffffff, 1);
app.scene.add(directional);

const system = VerletSystem3D({
  gravity: [0, -1, 0],
  // min? max?
});

// move up and down Y axis
function bouncerSling(y) {
  for (let i = 0; i < bouncers.length; i += 1) {
    bouncers[i].moveHead({ y });
  }
}

let lastRadius = INIT_RADIUS;
function bouncerSpread(radius) {
  const sign = Math.sign(radius);
  const lastSign = Math.sign(lastRadius);
  const needFlip = (sign !== lastSign);
  for (let i = 0; i < bouncers.length; i += 1) {
    const oldPos = bouncers[i].getHeadPos();
    // 'project' the position onto a x-z plane
    const xzPos = new THREE.Vector3().fromArray([
      oldPos[0],
      0,
      oldPos[2],
    ]);
    // set magnitude to radius
    xzPos.normalize().multiplyScalar(Math.abs(radius));
    if (needFlip) xzPos.multiplyScalar(-1);
    // apply x and z back to bouncer
    bouncers[i].moveHead({
      x: xzPos.x,
      z: xzPos.z,
    });
  }
  lastRadius = radius;
}

function bouncerRotate(rotation) {
  for (let i = 0; i < bouncers.length; i += 1) {
    // bouncer placement degree's predetermined.
    // add rotation (delta yaw) to it
    const oldPos = bouncers[i].getHeadPos();
    const newPos = new THREE.Vector3().fromArray(oldPos);
    newPos.applyAxisAngle(Y_AXIS, rotation);
    bouncers[i].moveHead({
      x: newPos.x,
      z: newPos.z,
    });
  }
}

function bouncerJump(amt = 0.1) {
  for (let i = 0; i < bouncers.length; i += 1) {
    bouncers[i].jump(amt);
  }
}

app.on('tick', (dt) => {
  // .. handle pre-render updates
  for (let i = 0; i < bouncers.length; i += 1) {
    system.integrate(bouncers[i].sim.vertices, dt / 1000);
    bouncers[i].update(dt / 1000);
  }
});
app.on('render', (dt) => {
  renderPass();
});

function changePalette() {
  // choose a palette
  const newPalette = getPalette();
  // change bg
  app.scene.background = new THREE.Color(newPalette.background); // example
  // change bouncer colors
  for (let i = 0; i < bouncers.length; i += 1) {
    bouncers[i].changePalette(newPalette.bouncer);
  }
}

export { app, bouncerJump, bouncerSpread, bouncerSling, bouncerRotate, changePalette };
