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

  this.bobbing = true;
  this.bob = 0;
};

Camera.prototype.advance = function(dt) {
  this.phi += this.vPhi * dt;
  this.theta += this.vTheta * dt;

  if (this.vX || this.vY) this.bob += 3*pi * dt;

  this.position[0] -= Math.cos(this.theta)*this.vX*dt +
      -Math.sin(camera.theta)*this.vY*dt;
  this.position[1] -= Math.sin(this.theta)*this.vX*dt + 
      Math.cos(camera.theta)*this.vY*dt;
};

Camera.prototype.transform = function() {
  mat4.identity(gl.mvMatrix);

  mat4.rotate(gl.mvMatrix, -this.phi, [1, 0, 0]);
  mat4.rotate(gl.mvMatrix, -this.theta, [0, 0, 1]);
  mat4.translate(gl.mvMatrix, 
      [
        this.position[0], 
        this.position[1], 
        this.position[2] + Math.sin(this.bob)/3.5
      ]);
};

Camera.prototype.setPosition = function(xyz) {
  vec3.set(Vector.invert(xyz), this.position);
};