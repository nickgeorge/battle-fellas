Box = function(point1, point2) {
  this.super();
  if (!Box.normalBuffer) Box.initBuffers();

  this.point1 = point1;
  this.point2 = point2;

  if (!point2) {
    point2 = Vector.multiply(point1, .5);
    point1 = Vector.multiply(point2, -1);
  }

  this.size = Vector.difference(point1, point2);
  this.fulcrum = null;

  this.colorBuffer = null;
  this.vertexBuffer = null;
  this.texture = null;
  this.textureBuffer = null;

  this.createVertexBuffer(point1, point2);

  this.alive = true;
};
Util.inherits(Box, Thing);

Box.normalBuffer = null;
Box.indexBuffer = null;

Box.prototype.advance = function(dt) {};

Box.prototype.draw = function() {
  gl.pushMatrix();
  if (this.fulcrum) {
    mat4.translate(gl.mvMatrix, vec3.add(this.position, this.fulcrum, []));
    mat4.rotate(gl.mvMatrix, this.theta, [0, 0, 1]);
    mat4.rotate(gl.mvMatrix, this.phi, [0, 1, 0]);
    mat4.translate(gl.mvMatrix, vec3.scale(this.fulcrum, -1, []));
  } else {
    mat4.translate(gl.mvMatrix, this.position);

    mat4.rotate(gl.mvMatrix, this.theta, [0, 0, 1]);
    mat4.rotate(gl.mvMatrix, this.phi, [0, 1, 0]);
  }
  this.render();
  gl.popMatrix();

};

Box.prototype.render = function() {

  if (this.texture) {
    if (!this.texture.loaded) return;
    gl.uniform1i(shaderProgram.useTextureUniform, true);
    Media.bindTexture(this.texture);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
  };
  //gl.uniform1i(shaderProgram.useTextureUniform, false);  

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, Box.normalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, Box.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Box.indexBuffer);
  gl.setMatrixUniforms();

  gl.drawElements(gl.TRIANGLES, Box.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  shaderProgram.reset();
}

Box.prototype.setRandomPosition = function(var_args) {
  var dp = null;
  if (arguments.length == 1) {
    dp = [arguments[0], arguments[0], arguments[0]];
  }
  if (arguments.length == 3) {
    dp = [arguments[0], arguments[1], arguments[2]];
  }
  this.position = [
    (2*Math.random() - 1)*dp[0],
    (2*Math.random() - 1)*dp[1],
    (2*Math.random() - 1)*dp[2]
  ];
  return this;
};

Box.prototype.setColorInternal = function() {
  var unpackedColors = [];
  for (var j = 0; j < 24; j++) {
    unpackedColors = unpackedColors.concat(this.color);
  }
  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
  this.colorBuffer.itemSize = 4;
  this.colorBuffer.numItems = 24;
  return this;
};

Box.prototype.setSwirl = function(rgba1, rgba2) {
  var unpackedColors = [];
  for (var j = 0; j < 24; j++) {
    unpackedColors = Math.random() > .5 ? unpackedColors.concat(rgba1) : unpackedColors.concat(rgba2);
  }
  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
  this.colorBuffer.itemSize = 4;
  this.colorBuffer.numItems = 24;
  return this;
};

Box.prototype.min = function(index) {
  return this.position[index] - this.size[index]/2;
};

Box.prototype.max = function(index) {
  return this.position[index] + this.size[index]/2;
};

Box.prototype.setTexture = function(texture, opt_buildBuffer) {
  this.texture = texture;
  if (opt_buildBuffer) this.createTextureBuffer();
  return this;
};

Box.prototype.die = function() {
  //world.thingsToRemove.push(this);
  this.setColor([1, 1, 1]);
  this.texture = null;
  this.alive = false;
};

Box.prototype.createVertexBuffer = function(point1, point2) {
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  var vertices = [
    // Top face
    point1[0], point1[1], point2[2],
    point2[0], point1[1], point2[2],
    point2[0], point2[1], point2[2],
    point1[0], point2[1], point2[2],

    // Back face
    point1[0], point1[1], point1[2],
    point1[0], point2[1], point1[2],
    point2[0], point2[1], point1[2],
    point2[0], point1[1], point1[2],

    // Top face
    point1[0], point2[1], point1[2],
    point1[0], point2[1], point2[2],
    point2[0], point2[1], point2[2],
    point2[0], point2[1], point1[2],

    // Bottom face
    point1[0], point1[1], point1[2],
    point2[0], point1[1], point1[2],
    point2[0], point1[1], point2[2],
    point1[0], point1[1], point2[2],

    // Right face
    point2[0], point1[1], point1[2],
    point2[0], point2[1], point1[2],
    point2[0], point2[1], point2[2],
    point2[0], point1[1], point2[2],

    // Left face
    point1[0], point1[1], point1[2],
    point1[0], point1[1], point2[2],
    point1[0], point2[1], point2[2],
    point1[0], point2[1], point1[2]
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  this.vertexBuffer.itemSize = 3;
  this.vertexBuffer.numItems = 24;
};

Box.ALL_FACES = {
  front: [0, 1, 0, 1],
  back: [0, 1, 0, 1],
  left: [0, 1, 0, 1],
  right: [0, 1, 0, 1],
  top: [0, 1, 0, 1],
  bottom: [0, 1, 0, 1]
};

Box.prototype.createTextureBuffer = function(opt_faces){
  var faces = opt_faces || Box.ALL_FACES;
  for (var face in Box.ALL_FACES) {
    if (!faces[face]) faces[face] = [-1, -1, -1, -1];
  };
  this.textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
  var textureCoords = [
    // Top' face
    faces.top[0], faces.top[2],
    faces.top[1], faces.top[2],
    faces.top[1], faces.top[3],
    faces.top[0], faces.top[3],

    // Bottom' face
    faces.bottom[1], faces.bottom[2],
    faces.bottom[1], faces.bottom[3],
    faces.bottom[0], faces.bottom[3],
    faces.bottom[0], faces.bottom[2],

    // Left' face
    faces.left[0], faces.left[3],
    faces.left[0], faces.left[2],
    faces.left[1], faces.left[2],
    faces.left[1], faces.left[3],

    // Right' face
    faces.right[1], faces.right[3],
    faces.right[0], faces.right[3],
    faces.right[0], faces.right[2],
    faces.right[1], faces.right[2],

    // Front face
    faces.front[0], faces.front[2],
    faces.front[1], faces.front[2],
    faces.front[1], faces.front[3],
    faces.front[0], faces.front[3],

    // Back' face
    faces.back[0], faces.back[2],
    faces.back[1], faces.back[2],
    faces.back[1], faces.back[3],
    faces.back[0], faces.back[3]
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
  this.textureBuffer.itemSize = 2;
  this.textureBuffer.numItems = textureCoords.length/2;
  return this;
};

Box.initBuffers = function() {
  Box.normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, Box.normalBuffer);
  var vertexNormals = [
    // Front face
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // Back face
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // Top face
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom face
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right face
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left face
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
  Box.normalBuffer.itemSize = 3;
  Box.normalBuffer.numItems = 24;

  Box.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Box.indexBuffer);
  var vertexIndices = [
    0, 1, 2,    0, 2, 3,  // Front face
    4, 5, 6,    4, 6, 7,  // Back face
    8, 9, 10,   8, 10, 11,  // Top face
    12, 13, 14,   12, 14, 15, // Bottom face
    16, 17, 18,   16, 18, 19, // Right face
    20, 21, 22,   20, 22, 23  // Left face
  ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
  Box.indexBuffer.itemSize = 1;
  Box.indexBuffer.numItems = 36;
};

Box.prototype.dispose = function() {
  this.colorBuffer = null;
  this.vertexBuffer = null;
  this.texture = null;
};