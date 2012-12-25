Fireball = function(parent, speed) {
  this.super();
  this.size = 1;
  this.speed = speed;
  this.parent = parent;
  this.small = new ImageCross().
      setColor([1, 1, 1, 1]).
      setTexture(ImageManager.TEXTURES.SPARK, true);
};
Util.inherits(Fireball, Thing);

Fireball.prototype.advance = function(dt) {

  for (var i = 0; i < 3; i++) {
    this.position[i] += this.speed[i]*dt;
  };

  if (Math.random() > .25) {
    this.small.setColor([
      r = Math.random()*.6 + .4,
      g = Math.random()*.6 + .4,
      b = Math.random()*.6 + .4
    ]);
    this.size = Math.random() + .5;
    this.phi = Math.random() * 2*pi;
    this.theta = Math.random() * 2*pi
  }

};

Fireball.prototype.draw = function() {
  gl.enable(gl.BLEND);
  gl.pushMatrix();
  this.transform();

  gl.uniform3fv(shaderProgram.scaleUniform, 
    [this.size, this.size, this.size]); 
  this.small.draw();

  gl.popMatrix();  
  gl.enable(gl.DEPTH_TEST);
  shaderProgram.reset();
};

Fireball.prototype.dispose = function() {
  this.small.dispose();
};

Fireball.prototype.detonate = function(){};