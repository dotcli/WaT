// TODO add more boiletplate (e.g. dat.gui control)

const randomColor = require('randomcolor');
global.THREE = require('three');
const createOrbitViewer = require('three-orbit-viewer')(THREE)
const VerletSystem3D = require('verlet-system/3d');
const EyeStalk = require('./lib/eyeStalkRender');

/* Scene */
const app = createOrbitViewer({
  clearColor: 0x000000,
  clearAlpha: 1,
  fov: 65,
  position: new THREE.Vector3(0, 0, 1), // camera
})

const eyeStalks = [];
const EYESTALK_COUNT = 13;
for (var i = 0; i < EYESTALK_COUNT; i++) {
  const x = -0.5*(EYESTALK_COUNT-1)+i; // spawn eyeStalks from the middle, with 1 unit in between;
  let eyeStalk = new EyeStalk(
    x,0,0, // position
    10, // seg
    0.01 // segLength
  );
  eyeStalks.push(eyeStalk);
  app.scene.add(eyeStalk);
}

const system = VerletSystem3D({
  gravity: [0, -1, 0],
  // min? max?
});

document.addEventListener('mousemove', (e)=>{
  let x = e.screenX / window.innerWidth - 0.5;
  let y = e.screenY / window.innerHeight - 0.5;
  y *= -1;
  for (var i = 0; i < eyeStalks.length; i++) {
    let newPos = new THREE.Vector3(x, y, 0);
    newPos.applyAxisAngle((new THREE.Vector3(0,1,0)), Math.PI/(eyeStalks.length/2)*i);
    eyeStalks[i].move(newPos.toArray(), 0);
  }
  // newPos.multiplyScalar(10);
  // eyeStalks[0].move(newPos.toArray(), 0);
  // eyeStalks[1].move(newPos.toArray(), 0);
  // newPos.applyAxisAngle((new THREE.Vector3(0,1,0)), Math.PI/2);
  // eyeStalks[2].move(newPos.toArray(), 0);
  // newPos.applyAxisAngle((new THREE.Vector3(0,1,0)), Math.PI/2);
  // eyeStalks[3].move(newPos.toArray(), 0);
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
