SmartCrate = function(position) {
  Util.base(this);

  this.theta = Math.random()*2*pi;
  this.phi = 0;
  this.setPosition(position);
  this.range = Math.random() * 6;

  this.start = this.position;
  this.end = this.getEnd();
  this.maxProgress = .5 + Math.random() * 1.5;
  this.progress = Math.random();
  this.direction = 1;

  this.alive = true;
  this.box = new Box([1, 1, 1]).
      setColor([1, 1, 1]).
      setTexture(Textures.QUESTION, true);

  this.parts = [this.box];

  this.outerRadius = .867;
  this.klass = "SmartCrate";
};
Util.inherits(SmartCrate, Thing);

SmartCrate.DEFAULT_SPEED = 60;

SmartCrate.prototype.die = function() {
  Util.base(this, 'die');
  world.thingsToRemove.push(this);
  world.effects.push(this);
  this.box.setColor(Vector.WHITE);
  this.box.texture = null;
  this.alive = false;
  SoundManager.play(Sounds.METAL_EXPLOSION);

  var SmartCrate = this;
  world.effects.push(new DoubleExplosion(1.5, [0,0,1], [0, 1, 1], function() {
    world.effectsToRemove.push(SmartCrate);
  }).setPosition(this.position));
};

SmartCrate.prototype.advance = function(dt) {
  if (this.alive) {
    if (!this.target || !this.target.alive) this.aquireTarget();
    if (this.target && this.target.alive) {
      if (Math.random() < .007) this.shoot();
    }
    this.progress > this.maxProgress && (this.direction = -1);
    this.progress < 0 && (this.direction = 1);
    this.progress += this.direction * parseFloat(dt);
    // console.log(this.position);
    // vec3.add(this.position, this.start, [1,2,3]);

    this.position = Vector.sum(this.start,
        Vector.multiply(
            Vector.difference(this.start, this.end),
            this.progress));
    // console.log(this.position);
    // console.log("\n");
  }
};

SmartCrate.prototype.aquireTarget = function() {
  this.target = Tribe.getRandomEnemy(this.tribe);
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
  var s = 50;
  var theta = Vector.thetaTo(
      this.position, this.target.eyeLevel());
  var phi = Vector.phiTo(
      this.position, this.target.eyeLevel());
  var s_xy = Math.cos(pi/2 + phi)*s;

  var v_shot = [
    -s_xy*Math.cos(theta),
    -s_xy*Math.sin(theta),
    s*Math.sin(pi/2 + phi)
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

  var endX = this.start[0] + range_xy*Math.cos(theta);
  var endY = this.start[1] + range_xy*Math.sin(theta);

  var end = new Float32Array(3);
  end[0] = endX;
  end[1] = endY;
  end[2] = Math.max(
      world.board.getHeight(endX, endY) + 2,
      this.start[2] + this.range*Math.sin(phi));

  return end;
};

SmartCrate.newRandom = function() {
  var x = Math.random()*world.board.size[0] + world.board.min(0);
  var y = world.board.max(1) - Math.random() * world.board.size[1] / 1.5;
  return new SmartCrate([
    x,
    y,
    Math.random()*10 + 2 + world.board.getHeight(x, y)
  ]);
};
