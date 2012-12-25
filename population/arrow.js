Arrow = function(parent, speed) {
  this.super();
  this.speed = speed;
  this.parent = parent;
  this.position = [0, 0, 0];
  this.shaft = new Box([1.5, .0625, .0625]).
      setColor([.7, 1, .7]);
};
Util.inherits(Arrow, Thing);

Arrow.DEFAULT_SPEED = 60;

Arrow.prototype.advance = function(dt) {

  for (var i = 0; i < 3; i++) {
    this.position[i] += this.speed[i]*dt;
  }
  if (this.position[2] > 0) {
    this.phi = -Math.atan2(this.speed[2], this.groundspeed());
    this.speed[2] -= world.G*dt;
  } else {
    this.speed = [0, 0, 0];
    this.position[2] = 0
  }
};

Arrow.prototype.draw = function() {
  gl.pushMatrix();

  gl.translate(this.position);
  gl.rotate(this.theta, [0, 0, 1]);
  gl.rotate(this.phi, [0, 1, 0]);
  this.shaft.render();

  gl.popMatrix();
};

Arrow.prototype.groundspeed = function() {
  return Math.sqrt(
    this.speed[1]*this.speed[1] + this.speed[0]*this.speed[0]);
};

Arrow.prototype.active = function() {
  return this.position[2] > 0;
};

Arrow.prototype.dispose = function() {
  this.shaft.dispose();
};

Arrow.prototype.detonate = function() {
  world.effects.push(new DoubleExplosion(.25, [1, 1, 0], [1, 1, 1]).
      setPosition(this.position));
  world.projectilesToRemove.push(this); 
};