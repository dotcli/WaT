// wraps bouncerSim
// provides graphical elements
// using three.js
// TODO when the group's position, rotation, and scale changes, 
// the simulation needs to update accordingly
const bouncerSim = require('./bouncerSim');
class Bouncer extends THREE.Group {
  constructor(x,y,z,seg,segLength, colors) {
    super();
    this.sim = new bouncerSim(x,y,z,seg,segLength);
    this.segments = [];
    for (var i = 0; i < seg; i++) {
      this.segments[i] = new THREE.Mesh(
        new THREE.SphereGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: colors[i%colors.length] }),
        // new THREE.MeshStandardMaterial({
        //   color: colors[i%colors.length],
        //   roughness: 0.7,
        //   metalness: 1.0,
        //   emissive: colors[i%colors.length],
        //   emissiveIntensity: 0.8,
        // }),
      );
      this.segments[i].scale.setScalar(0.1);
      this.add(this.segments[i]);
    }
  }
  update(dt) {
    this.sim.update(dt);
    // update graphics according to simulation
    for (var i = 0; i < this.segments.length; i++) {
      this.segments[i].position.set(
        this.sim.vertices[i].position[0],
        this.sim.vertices[i].position[1],
        this.sim.vertices[i].position[2]
      );
    }
  }
  jump(magnitude) {
    this.sim.jump(magnitude);
  }
  /*
   * @param position array[3]
   */
  move(position, index) {
    this.sim.move(position, index);
  }
}

module.exports = Bouncer;
