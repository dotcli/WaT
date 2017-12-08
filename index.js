// TODO add more boiletplate (e.g. dat.gui control)

const randomColor = require('randomcolor');
global.THREE = require('three');
const createOrbitViewer = require('three-orbit-viewer')(THREE)
const VerletSystem3D = require('verlet-system/3d');
const WAGNER = require('@superguigui/wagner');
const NoisePass = require('@superguigui/wagner/src/passes/noise/noise');
const RGBSplitPass = require('@superguigui/wagner/src/passes/rgbsplit/rgbsplit');
const VignettePass = require('@superguigui/wagner/src/passes/vignette/VignettePass');
const ZoomBlurPass = require('@superguigui/wagner/src/passes/zoom-blur/ZoomBlurPass');
const EyeStalk = require('./lib/eyeStalkRender');

/* Scene */
const app = createOrbitViewer({
  clearColor: 0x7b548b,
  clearAlpha: 1,
  fov: 65,
  position: new THREE.Vector3(0, 1, 0), // camera
})
app.camera.rotation.z = 90 * Math.PI / 180;

// effects
app.renderer.autoClearColor = true;
const composer = new WAGNER.Composer(app.renderer);
composer.setSize( window.innerWidth, window.innerHeight );
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

const eyeStalks = [];
const EYESTALK_COUNT = 13;
const INIT_RADIUS = 0.5;
const INIT_Y = 0.5;
for (var i = 0; i < EYESTALK_COUNT; i++) {
  const x = -0.5*(EYESTALK_COUNT-1)+i; // spawn eyeStalks from the middle, with 1 unit in between;

  // place eyestalks in a circle from the middle
  let pos = new THREE.Vector3(INIT_RADIUS, INIT_Y, 0);
  pos.applyAxisAngle((new THREE.Vector3(0,1,0)), Math.PI/(EYESTALK_COUNT/2)*i);

  let eyeStalk = new EyeStalk(
    pos.x,pos.y,pos.z, // position
    10, // seg
    0.01, // segLength
    // [0xffff00, 0xff00ff, 0x00ffff], // yellow, magenta, cyan. pair with black bg
    // [0xde5a33, 0x00b0d4, 0xdeebf0], // color from http://acko.net. pair with 0x495e77
    // [0xf7e73f, 0xa1dfb3, 0xea7dce], // color from graffiti. pair with 0x8a6288
    // [0xd850c3, 0x5c02b8, 0x89ff42], // color from graffiti. pair with 0x1d232c
    // [0xedf9f5, 0xfa8fc0, 0x09f8f9], // color from graffiti. pair with 0xb8ece5
    // [0xffffff, 0xCBE86B, 0x1C140D], // color from http://www.colourlovers.com/palette/359978/w_o_r_d_l_e_s_s_. pair with 0xffffff
    // [0xEDE574, 0xFC913A, 0xE1F5C4], // color from http://www.colourlovers.com/palette/937624/Dance_To_Forget pair with 0xFF4E50
    // [0xF4FAD2, 0xFF4242, 0xE1EDB9, 0xD4EE5E], // color from http://www.colourlovers.com/palette/937624/Dance_To_Forget pair with 0xF0F2EB
    [0xed5742, 0xf9c600, 0xbacf33, 0x0178ad, 0xffffff], // pair with 0x7b548b
  );
  eyeStalks.push(eyeStalk);
  app.scene.add(eyeStalk);
}

// lighting
const directional = new THREE.DirectionalLight( 0xffffff, 1 );
app.scene.add(directional);

const system = VerletSystem3D({
  gravity: [0, -1, 0],
  // min? max?
});

document.addEventListener('mousemove', (e)=>{
  let x = e.pageX / window.innerWidth - 0.5;
  let y = e.pageY / window.innerHeight - 0.5;
  y *= -1;
  for (var i = 0; i < eyeStalks.length; i++) {
    let newPos = new THREE.Vector3(x, y, 0);
    newPos.applyAxisAngle((new THREE.Vector3(0,1,0)), Math.PI/(eyeStalks.length/2)*i);
    eyeStalks[i].move(newPos.toArray(), 0);
  }
});
document.addEventListener('click', (e)=>{
  for (var i = 0; i < eyeStalks.length; i++) {
    eyeStalks[i].jump(0.1);
  }
});

app.on('tick', function(dt) {
  //.. handle pre-render updates
  for (var i = 0; i < eyeStalks.length; i++) {
    system.integrate(eyeStalks[i].sim.vertices, dt/1000);
    eyeStalks[i].update(dt/1000);
  }
})
app.on('render', function(dt) {
  renderPass();
})