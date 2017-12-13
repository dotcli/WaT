// threejs bouncer that uses bouncerSim
// TODO when the group's position, rotation, and scale changes,
// the simulation needs to update accordingly
import * as THREE from 'three';

const BouncerSim = require('./bouncerSim');

class Bouncer extends THREE.Group {
  constructor(x, y, z, seg, segLength, colors) {
    super();
    this.sim = new BouncerSim(x, y, z, seg, segLength);
    this.segments = [];
    for (let i = 0; i < seg; i += 1) {
      this.segments[i] = new THREE.Mesh(
        new THREE.SphereGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: colors[i % colors.length] }),
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
    for (let i = 0; i < this.segments.length; i += 1) {
      this.segments[i].position.set(
        this.sim.vertices[i].position[0],
        this.sim.vertices[i].position[1],
        this.sim.vertices[i].position[2],
      );
    }
  }
  jump(magnitude) {
    this.sim.jump(magnitude);
  }
  moveHead({ x, y, z }) {
    const arrPos = this.getHeadPos();
    if (x !== undefined) arrPos[0] = x;
    if (y !== undefined) arrPos[1] = y;
    if (z !== undefined) arrPos[2] = z;
    this.sim.move(arrPos, 0);
  }
  /**
   * @return Float32Array[3]
   */
  getHeadPos() {
    return this.sim.vertices[0].position;
  }
  changePalette(colors) {
    for (let i = 0; i < this.segments.length; i += 1) {
      const segment = this.segments[i];
      segment.material.color.set(colors[i % colors.length]);
    }
  }
}

module.exports = Bouncer;
