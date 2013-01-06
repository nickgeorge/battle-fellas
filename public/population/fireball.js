Fireball = function(parent, speed) {
  this.super();
  this.scale = 1;
  this.speed = speed;
  this.parent = parent;
  this.small = new ImageCross().
      setColor([1, 1, 1, 1]).
      setTexture(ImageManager.Textures.SPARK, true);
  this.small.size = [1, 1, 1];
  this.parts = [this.small];
  this.size = [1, 1, 1];
};
Util.inherits(Fireball, Thing);

Fireball.prototype.advance = function(dt) {

  for (var i = 0; i < 3; i++) {
    this.position[i] += this.speed[i]*dt;
  };

  if (Math.random() > .2) {
    this.scale = Math.random() + .5;
    this.phi = Math.random() * 2*pi;
    this.theta = Math.random() * 2*pi
  }
  if (Math.random() > .9) {

    this.small.setColor([
      Math.random(),
      Math.random(),
      Math.random(),
      1
    ]);
  }

};

Fireball.prototype.draw = function() {
  gl.enable(gl.BLEND);
  gl.pushMatrix();
  this.transform();

  gl.uniform3fv(shaderProgram.scaleUniform, 
    [this.scale, this.scale, this.scale]); 
  this.small.draw();

  gl.popMatrix();  
  gl.enable(gl.DEPTH_TEST);
  shaderProgram.reset();
};

Fireball.prototype.dispose = function() {
  this.small.dispose();
};

Fireball.prototype.detonate = function(){};