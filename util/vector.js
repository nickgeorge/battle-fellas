Vector = {};

Vector.randomColor = function() {
  return [Math.random(), Math.random(), Math.random(), 1];
};

Vector.reverseColor = function(rgba) {

  return [1 - rgba[0], 1 - rgba[1], 1 - rgba[2], rgba[3]];
};

Vector.distanceSquared = function(v1, v2) {
  return (v1[0]-v2[0])*(v1[0]-v2[0]) +
      (v1[1]-v2[1])*(v1[1]-v2[1]) +
      (v1[2]-v2[2])*(v1[2]-v2[2]);
};

Vector.thetaTo = function(v1, v2) {
  return Math.atan2(v2[1] - v1[1], v2[0] - v1[0]);
};

Vector.multiply = function(v, c) {
  return [c*v[0], c*v[1], c*v[2]];
};

Vector.invert = function(v) {
  return Vector.multiply(v, -1);
};

Vector.difference = function(v1, v2) {
  return [
    v2[0] - v1[0],
    v2[1] - v1[1],
    v2[2] - v1[2]
  ];
};

Vector.sum = function(v1, v2) {
  return [
    v2[0] + v1[0],
    v2[1] + v1[1],
    v2[2] + v1[2]
  ];
};

Vector.average = function(v1, v2) {
  return Vector.multiply(Vector.sum(v1, v2), .5);
}