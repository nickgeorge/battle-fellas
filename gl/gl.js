GL = function(){}

GL.createGL = function(canvas) {
  var gl;
  try {
    gl = canvas.getContext('experimental-webgl');
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {console.log('Didn\'t init GL')}
  gl.mvMatrix = mat4.create();
  gl.pMatrix = mat4.create();

  gl.stack = [];
  gl.stackIndex = -1;
  
  gl.normalMatrix = mat3.create();

  for (var key in GL.prototype) {
    gl[key] = GL.prototype[key];
  }
  return gl;
}

GL.prototype.pushMatrix = function() {
  this.stackIndex++;
  if (!this.stack[this.stackIndex]) {
    var copy = mat4.create();
    this.stack.push(copy);      
  }
  mat4.set(this.mvMatrix, this.stack[this.stackIndex]);
};

GL.prototype.popMatrix = function() {
  if (this.stackIndex == -1) {
    throw 'Invalid popMatrix!';
  }
  mat4.set(this.stack[this.stackIndex], this.mvMatrix);
  this.stackIndex--;
};

GL.prototype.setMatrixUniforms = function() {
  this.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, this.pMatrix);
  this.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, this.mvMatrix);

  mat4.toInverseMat3(this.mvMatrix, this.normalMatrix);
  mat3.transpose(this.normalMatrix);
  this.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, this.normalMatrix);
};

GL.prototype.rotate = function (angle, axis) {
  mat4.rotate(this.mvMatrix, angle, axis);
};

GL.prototype.translate = function(xyz) {
  mat4.translate(this.mvMatrix, xyz);
};
