ShaderProgram = function() {}

ShaderProgram.USE_TEXTURE_DEFAULT = false;
ShaderProgram.SCALE_DEFAULT = [1, 1, 1];

ShaderProgram.getShader = function(gl, id) {
  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }

  var str = '';
  var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }

  var shader;
  if (shaderScript.type == 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
};

ShaderProgram.getShaderProgram = function() {
  var shaderProgram = gl.createProgram();
  var fragmentShader = ShaderProgram.getShader(gl, 'shader-fs');
  var vertexShader = ShaderProgram.getShader(gl, 'shader-vs');

  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Could not initialise shaders');
  }

  gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
      shaderProgram, 'aVertexPosition');
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(
      shaderProgram, 'aVertexColor');
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(
      shaderProgram, 'aVertexNormal');
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  shaderProgram.textureCoordAttribute = gl.getAttribLocation(
      shaderProgram, 'aTextureCoord');
  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute); 

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

  shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
  shaderProgram.lightingDirectionUniform = gl.getUniformLocation(
      shaderProgram, "uLightingDirection");
  shaderProgram.directionalColorUniform = gl.getUniformLocation(
      shaderProgram, "uDirectionalColor");
  shaderProgram.useTextureUniform = gl.getUniformLocation(
      shaderProgram, "uUseTexture");
  shaderProgram.scaleUniform = gl.getUniformLocation(
      shaderProgram, "uScale");
  
  console.log(shaderProgram);
  shaderProgram.reset = ShaderProgram.prototype.reset;
  shaderProgram.reset();

  return shaderProgram;
};

ShaderProgram.prototype.reset = function() {
  gl.uniform1i(this.useTextureUniform, false);
  gl.uniform1i(this.useTextureUniform, ShaderProgram.USE_TEXTURE_DEFAULT); 
  gl.uniform3fv(this.scaleUniform, ShaderProgram.SCALE_DEFAULT); 
};