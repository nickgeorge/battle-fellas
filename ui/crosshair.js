Crosshair = function() {
  this.vertexBuffer = null;
  this.indexBuffer = null;
  this.color = [1, 0, 0, 1];

  this.generateBuffers();
};

Crosshair.prototype.generateBuffers = function() { 
  var verticies = [
    -.001, 0, -.1,
    .001, 0,  -.1,
    0, .001,  -.1,
    0, -.001, -.1
  ];
  var indicies = [
    0, 1,
    2, 3
  ];

  this.vertexBuffer = Util.generateBuffer(verticies, 3);
  this.indexBuffer = Util.generateIndexBuffer(indicies);

};

Crosshair.prototype.draw = function() {

  Util.setUseLighting(false);
  Util.setColorOverride(this.color);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute,
      this.vertexBuffer.itemSize,
      gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  
  gl.setMatrixUniforms();
  gl.drawElements(gl.LINES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  shaderProgram.reset();
};