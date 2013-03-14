DoubleExplosion = function(size, smallColor, bigColor, callback) {
  this.super();
  this.initialSize = size;
  this.size = size;
  this.small = new ImageCross().
      setColor(smallColor || [1, 0, 0]).
      setTexture(Textures.SPARK, true);

  this.big = new ImageCross().
      setColor(bigColor || [1, 1, 0]).
      setTexture(Textures.ENERGY, true);

  this.callback = callback;
};
Util.inherits(DoubleExplosion, Thing);

DoubleExplosion.prototype.advance = function(dt) {
  this.size += this.initialSize*20 * dt;
  if (this.size > this.initialSize*5) {
    world.effectsToRemove.push(this);
    this.callback && this.callback();
  }

  this.size = this.size + Math.random()*dt*40;
  console.log(this.size);
  this.phi = Math.random() * 2*pi;
  this.theta = Math.random() * 2*pi
};

DoubleExplosion.prototype.draw = function() {

  gl.enable(gl.BLEND);
  gl.depthMask(false);

  gl.pushMatrix();
  this.transform();

  gl.uniform3fv(shaderProgram.scaleUniform,
      [this.size, this.size, this.size]);
  this.small.draw();

  gl.uniform3fv(shaderProgram.scaleUniform, [
    this.size*1.5,
    this.size*1.5,
    this.size*1.5
  ]);
  this.big.draw();

  gl.depthMask(true);
  gl.popMatrix();
  shaderProgram.reset();
};
