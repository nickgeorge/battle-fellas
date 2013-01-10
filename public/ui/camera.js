Camera = function() {
  this.position = [];
  this.inversePosition_ = [];
  this.vX = 0;
  this.vY = 0;
  this.vTheta = 0;
  this.vPhi = 0;
  this.theta = 0;
  this.phi = 0;

  this.vPhiMag = 1/2*Math.PI;
  this.vThetaMag = 1/2*Math.PI;
  this.vRMag = 20;

  this.bob = 0;

  this.anchor = null;
};

Camera.prototype.advance = function(dt) {
  this.phi += this.vPhi * dt;
  this.theta += this.vTheta * dt;

  if (this.vX || this.vY) this.bob += 3*pi * dt;

  this.position[0] -= Math.cos(this.theta)*this.vX*dt -
      Math.sin(camera.theta)*this.vY*dt;
  this.position[1] -= Math.sin(this.theta)*this.vX*dt + 
      Math.cos(camera.theta)*this.vY*dt;
};

Camera.prototype.transform = function() {
  mat4.rotate(gl.mvMatrix, -this.anchor.phi - pi/2, [1, 0, 0]);
  mat4.rotate(gl.mvMatrix, -this.anchor.theta + pi/2, [0, 0, 1]);
  var position = this.anchor.eyeLevel();
  mat4.translate(gl.mvMatrix, [
    -position[0], 
    -position[1], 
    -position[2]
  ]);
};

Camera.prototype.setPosition = function(xyz) {
  vec3.set(Vector.invert(xyz), this.position);
};

Camera.prototype.center = function() {
  return this.position;
};