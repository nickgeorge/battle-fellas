ImageManager = function() {};

ImageManager.Textures = {};

ImageManager.bindTexture = function(texture) {
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
};

ImageManager.initTextures = function() {
  ImageManager.Textures = {
    CRATE: ImageManager.initTexture('media/crate.png'),
    THWOMP: ImageManager.initTexture('media/thwomp.png'),
    GRASS: ImageManager.initTexture('media/grass.png'),
    SPARK: ImageManager.initTexture('media/spark.png'),
    ENERGY: ImageManager.initTexture('media/energybwa.png'),
    QUESTION: ImageManager.initTexture('media/question.png')
  };
};

ImageManager.initTexture = function(src) {
  var texture = gl.createTexture();
  texture.image = new Image();
  texture.loaded = false;
  texture.image.onload = function() {
    ImageManager.packageTexture(texture);
  }
  texture.image.src = src;
  return texture;
};

ImageManager.packageTexture = function(texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.bindTexture(gl.TEXTURE_2D, null);
  texture.loaded = true;
};