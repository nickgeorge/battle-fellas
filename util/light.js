Light = function() {
  this.ambientColor = vec3.create();
  this.directionalColor = vec3.create();
  this.position = vec3.create();
  this.direction = vec3.create();
};

Light.prototype.setDirection = function(direction) {
  vec3.normalize(direction, this.direction);
  vec3.scale(this.direction, -1);
};

Light.prototype.setAmbientColor = function(rgb) {
  vec3.set(rgb, this.ambientColor);
};

Light.prototype.setDirectionalColor = function(rgb) {
  vec3.set(rgb, this.directionalColor);
};

Light.prototype.apply = function() {
  gl.uniform3fv(shaderProgram.ambientColorUniform, this.ambientColor);
  gl.uniform3fv(shaderProgram.lightingDirectionUniform, this.direction);
  gl.uniform3fv(shaderProgram.directionalColorUniform, this.directionalColor);
};