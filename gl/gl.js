GL = function(){}

GL.createGL = function(canvas) {
  var gl;
  try {
    gl = canvas.getContext('experimental-webgl');
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {console.log("Didn't init GL")}
  gl.mvMatrix = mat4.create();
  gl.pMatrix = mat4.create();

  gl.stack = [];
  gl.stackIndex = -1;
  
  gl.clearColorRgba = [0, 0, 0, 1];
  gl.normalMatrix = mat3.create();

  gl.pushMatrix = function() {
    gl.stackIndex++;
    if (!gl.stack[gl.stackIndex]) {
      var copy = mat4.create();
      gl.stack.push(copy);      
    }
    mat4.set(gl.mvMatrix, gl.stack[gl.stackIndex]);
  };

  gl.popMatrix = function() {
    if (gl.stackIndex == -1) {
      throw 'Invalid popMatrix!';
    }
    mat4.set(gl.stack[gl.stackIndex], gl.mvMatrix);
    gl.stackIndex--;
  };

  gl.setMatrixUniforms = function() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, gl.pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, gl.mvMatrix);

    mat4.toInverseMat3(gl.mvMatrix, gl.normalMatrix);
    mat3.transpose(gl.normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, gl.normalMatrix);
  };

  gl.rotate = function (angle, axis) {
    mat4.rotate(gl.mvMatrix, angle, axis);
  };

  gl.translate = function(xyz) {
    mat4.translate(gl.mvMatrix, xyz);
  };
  return gl;
}
