Media = function() {};

Media.TEXTURES = {};

Media.bindTexture = function(texture) {
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(shaderProgram.samplerUniform, 0);
};

Media.initTextures = function() {
  Media.TEXTURES.CRATE = Media.initTexture("media/crate.png");
};

Media.initTexture = function(src) {
  var texture = gl.createTexture();
  texture.image = new Image();
  texture.loaded = false;
  texture.image.onload = function() {
    Media.packageTexture(texture);
  }
  texture.image.src = src;
  return texture;
};

Media.packageTexture = function(texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.bindTexture(gl.TEXTURE_2D, null);
  texture.loaded = true;
};