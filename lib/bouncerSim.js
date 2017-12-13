// physics simulation 
// bounce when needed
const Point3D = require('verlet-point/3d');
const Constraint3D = require('verlet-constraint/3d');

function createConstraints(vertices, seglength) {
    //make our connections
    var points = []
    for (var i=0; i<vertices.length-1; i++) {
        points.push([ vertices[i], vertices[i+1] ]);
    }

    //turn each into a constraint
    return points.map(function(p) {
        return Constraint3D(p, { restingDistance: seglength, stiffness: 0.5 })
    })
}

class BouncerSim {
  constructor(x,y,z,seg,seglength) {
    this.position = [x,y,z]; // ? format needs thought
    this.vertices = [];
    for (var i = 0; i < seg; i++) {
      let p = Point3D({
        position: [x,y - (seglength*0.5)*i,z],
        mass: 0.5,
      });
      this.vertices.push(p);
    }
    // root is immovable
    this.vertices[0].mass = 0;
    this.vertices[this.vertices.length-1].mass = 5;
    // create constraints between each vertices
    this.constraints = createConstraints(this.vertices, seglength);
  }
  update(dt) {
    this.constraints.forEach((c)=>{ c.solve(); });
  }
  jump(magnitude) {
    this.vertices[this.vertices.length-1].addForce( [0,magnitude,0] );
  }
  move(position, index) {
    this.vertices[index].place(position);
  }
}

module.exports = BouncerSim;
