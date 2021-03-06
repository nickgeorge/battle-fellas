Arrow = function(parent, speed) {
  Util.base(this);
  this.speed = speed;
  this.parent = parent;
  this.shaft = new Box(Arrow.SHAFT_SIZE);

  this.parts = [this.shaft];

  this.klass = "Arrow";
  this.outerRadius = 1.51;
};
Util.inherits(Arrow, Thing);

Arrow.DEFAULT_SPEED = 60;
Arrow.SHAFT_SIZE = [1.5, .0625, .0625];

Arrow.prototype.advance = function(dt) {
  for (var i = 0; i < 3; i++) {
    this.position[i] += this.speed[i]*dt;
  }
  var groundLevel = world.board.getHeight(this.position[0], this.position[1]);
  if (this.position[2] > groundLevel || !world.inBounds(this.position) ) {
    this.phi = -Math.atan2(this.speed[2], this.groundspeed());
    this.speed[2] -= world.G*dt;
  } else {
    this.speed = [0, 0, 0];
    // TODO: pull this up to ground level.
    //this.position[2] = groundLevel;
  }
};

Arrow.prototype.setColor = function(rgba) {
  this.shaft.setColor(rgba);
  return this;
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
