SmartCrate = function(position) {
  this.theta = Math.random()*2*pi;
  this.phi = Math.random()*2*pi;
  this.position = position;
  this.range = Math.random() * 6;

  this.start = this.position;
  this.end = this.getEnd();
  this.progress = Math.random()
  this.direction = 1;

  this.alive = true;
  this.box = new Box([1, 1, 1]).
      setColor([1, 1, 1]).
      setTexture(ImageManager.Textures.QUESTION, true);

  this.parts = [this.box];
};
Util.inherits(SmartCrate, Thing);

SmartCrate.DEFAULT_SPEED = 60;

SmartCrate.prototype.die = function() {
  world.thingsToRemove.push(this);
  world.effects.push(this);
  this.box.setColor([1, 1, 1, 1]);
  this.box.texture = null;
  this.alive = false;

  var SmartCrate = this;
  world.effects.push(new DoubleExplosion(2, null, null, function() {
    world.effectsToRemove.push(SmartCrate);
  }).setPosition(this.position));
};

SmartCrate.prototype.advance = function(dt) {
  if (this.alive) {
    if (!this.target || !this.target.alive) this.aquireTarget();
    if (this.target && this.target.alive) {
      this.theta = Vector.thetaTo(
          this.position, this.target.center());
      this.phi = Vector.phiTo(
          this.position, this.target.center());
      if (Math.random() < .005) this.shoot();
    }
    this.progress > 1 && (this.direction = -1);
    this.progress < 0 && (this.direction = 1);
    this.progress += this.direction * parseFloat(dt);
    this.position = Vector.sum(this.start, 
        Vector.multiply(
            Vector.difference(this.start, this.end),
            this.progress));
  }
};

SmartCrate.prototype.aquireTarget = function() {
  this.target = world.theOne || this.getClosestThing();
};

SmartCrate.prototype.draw = function() {
  gl.pushMatrix();

  this.transform();
  this.box.draw();

  gl.popMatrix();
};

SmartCrate.prototype.dispose = function() {
  this.box.dispose();
};

SmartCrate.prototype.shoot = function() {
  var s = 30;
  var s_xy = Math.cos(pi/2 + this.phi)*s;

  var v_shot = [
    -s_xy*Math.cos(this.theta),
    -s_xy*Math.sin(this.theta),
    s*Math.sin(pi/2 + this.phi)
  ];
  var shot = new Fireball(this, v_shot).
      setPosition([
        this.position[0],
        this.position[1],
        this.position[2]
      ]);

  world.projectiles.push(shot);
};

SmartCrate.prototype.getEnd = function() {
  var theta = Math.random() * 2 * pi;
  var phi = Math.random() * 2 * pi;
  var range_xy =  Math.cos(phi)*this.range;

  return [
    this.start[0] + range_xy*Math.cos(theta),
    this.start[1] + range_xy*Math.sin(theta),
    Math.max(2, this.start[2] + this.range*Math.sin(phi))
  ];
};

SmartCrate.newRandom = function() {
  return new SmartCrate([
    Math.random()*world.board.size[0] + world.board.min(0),
    world.board.max(1) - Math.random() * world.board.size[1] / 2,
    Math.random()*10 + 2
  ]);
};