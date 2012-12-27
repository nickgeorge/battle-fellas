DoubleExplosion = function(size, smallColor, bigColor, callback) {
  this.super();
  this.initialSize = size;
  this.size = size;
  this.small = new ImageCross().
      setColor(smallColor || [1, 0, 0]).
      setTexture(ImageManager.Textures.SPARK, true);

  this.big = new ImageCross().
      setColor(bigColor || [1, 1, 0]).
      setTexture(ImageManager.Textures.ENERGY, true);

  this.callback = callback;
};
Util.inherits(DoubleExplosion, Thing);

DoubleExplosion.prototype.advance = function(dt) {
  this.size += this.initialSize*20 * dt;
  if (this.size > this.initialSize*5) {
    world.effectsToRemove.push(this);
    if (this.callback) this.callback();
  }
};

DoubleExplosion.prototype.draw = function() {

  gl.enable(gl.BLEND)
  gl.disable(gl.DEPTH_TEST);

  gl.pushMatrix();
  this.transform();

  gl.uniform3fv(shaderProgram.scaleUniform,
      [this.size, this.size, this.size]); 
  this.small.draw();

  gl.uniform3fv(shaderProgram.scaleUniform, [
    this.size*1.2, 
    this.size*1.2, 
    this.size*1.2
  ]); 
  this.big.draw();

  gl.popMatrix();  
//  gl.disable(gl.BLEND)
  gl.enable(gl.DEPTH_TEST);
  shaderProgram.reset();
};