Board = function() {
  this.size = [100, 200];
  this.position = [0, 0, -.5];
  this.tileCount = [20, 40];

  this.tileHeights = [];
  this.vertexBuffer = null;
  this.indexBuffer = null;
  this.normalBuffer = null;

  this.colorOverride = [1, 1, 1];

  this.generateHeights();
  this.generateBuffers();
};

Board.prototype.generateHeights = function() {
  for (var i = 0; i < this.tileCount[0]; i++) {
    this.tileHeights[i] = [];
    for (var j = 0; j < this.tileCount[1]; j++) {
      this.tileHeights[i][j] = Math.random() * 3 - .5;
    }
  }
};

Board.prototype.generateBuffers = function() {
  var verticies = [];
  var indicies = [];
  var normals = [];
  var tileSize = [
    this.size[0] / this.tileCount[0],
    this.size[1] / this.tileCount[1]
  ];
  var count = 0;
  for (var i = 0; i < this.tileCount[0] - 1; i++) {
    for (var j = 0; j < this.tileCount[1] - 1; j++) {
      // console.log([
      //   i * tileSize[0],     j * tileSize[1],     this.tileHeights[i][j],
      //   (i+1) * tileSize[0], j * tileSize[1],     this.tileHeights[i][j],
      //   (i+1) * tileSize[0], (j+1) * tileSize[1], this.tileHeights[i][j],
      //   i * tileSize[0],     (j+1) * tileSize[1], this.tileHeights[i][j]
      // ]);
      verticies.pushAll([
        i * tileSize[0],     j * tileSize[1],     this.tileHeights[i][j],
        (i+1) * tileSize[0], j * tileSize[1],     this.tileHeights[i][j],
        (i+1) * tileSize[0], (j+1) * tileSize[1], this.tileHeights[i][j],
        i * tileSize[0],     (j+1) * tileSize[1], this.tileHeights[i][j]
      ]);
      normals.pushAll([
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
      ]);
      indicies.pushAll([
        count, count + 1, count + 2,
        count, count + 2, count + 3
      ]);
      count += 4;
    }
  }
  console.log(verticies)
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 
      new Float32Array(verticies), gl.STATIC_DRAW);
  this.vertexBuffer.itemSize = 3;
  this.vertexBuffer.numItems = 
      this.vertexBuffer.length / this.vertexBuffer.itemSize;

  this.normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 
      new Float32Array(normals), gl.STATIC_DRAW);
  this.normalBuffer.itemSize = 3;
  this.normalBuffer.numItems = 
      this.normalBuffer.length / this.normalBuffer.itemSize;

  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indicies), gl.STATIC_DRAW);
  this.indexBuffer.itemSize = 1;
  this.indexBuffer.numItems = this.indexBuffer.length;      
};

Board.prototype.draw = function() {
  gl.uniform4fv(shaderProgram.colorOverrideUniform, this.colorOverride);
  // if (this.texture) {
  //   if (!this.texture.loaded) return;
  //   gl.uniform1i(shaderProgram.useTextureUniform, true);
  //   ImageManager.bindTexture(this.texture);
  //   gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
  //   gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
  // };

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.setMatrixUniforms();

  gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  shaderProgram.reset();
};

Board.prototype.min = function(index) {
  return this.position[index] - this.size[index]/2;
};

Board.prototype.max = function(index) {
  return this.position[index] + this.size[index]/2;
};