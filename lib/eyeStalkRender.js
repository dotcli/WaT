// wraps eyestalkSim
// provides graphical elements
// using three.js
// TODO when the group's position, rotation, and scale changes, 
// the simulation needs to update accordingly
const EyeStalkSim = require('./eyeStalkSim');
class EyeStalkRender extends THREE.Group {
  constructor(x,y,z,seg,segLength) {
    super();
    this.sim = new EyeStalkSim(x,y,z,seg,segLength);
    this.segments = [];
    const colors = [0xffff00, 0xff00ff, 0x00ffff];
    for (var i = 0; i < seg; i++) {
      this.segments[i] = new THREE.Mesh(
        new THREE.SphereGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: colors[i%colors.length] })
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

module.exports = EyeStalkRender;
