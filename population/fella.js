Fella = function(xyz, rgb) {

  Util.base(this);
  this.position = xyz;
  this.theta = 0;
  this.phi = 0;
  this.speed = Fella.SPEED;
  this.alive = true;
  this.target = null;
  this.parts = [];

  this.buildBody(rgb || Vector.randomColor());
};
Util.inherits(Fella, Thing);

Fella.SPEED = 5;
Fella.MAX_LEG_ANGLE = Util.degToRad(30);

Fella.prototype.advance = function(dt) {
  if (this.alive) {
    if (!this.target || !this.target.alive) this.aquireTarget();
    if (this.target && this.target.alive) {
      this.theta = Vector.thetaTo(this.position, this.target.position);
      if (Math.random() < .015) this.shoot();
    }
    this.advanceAlive(dt);
  } else { 
    this.advanceDead(dt);
  }
};

Fella.prototype.aquireTarget = function() {
  this.target = world.theOne || this.getClosestThing();
};

Fella.prototype.setColorInternal = function(rgb) {
  this.parts.apply('setColorInternal', rgb);
};


Fella.prototype.advanceAlive = function(dt) {
  this.parts.legAngle += this.speed * this.parts.stepDirection * dt;

  if (this.parts.legAngle >= Fella.MAX_LEG_ANGLE) {
    this.parts.stepDirection = -1;
  }
  if (this.parts.legAngle <= -Fella.MAX_LEG_ANGLE) {
    this.parts.stepDirection = 1;
  }

  this.parts.leftLeg.phi = this.parts.legAngle;
  this.parts.rightLeg.phi = -this.parts.legAngle;

  this.position[0] += Math.cos(this.theta)*this.speed*dt;
  this.position[1] += Math.sin(this.theta)*this.speed*dt;

  if (this.position[0] > world.board.max(0)) {
    this.position[0] = world.board.max(0);
    this.theta += Math.PI;
  }
  if (this.position[0] < world.board.min(0)) {
    this.position[0] = world.board.min(0);
    this.theta += Math.PI;
  }
  if (this.position[1] > world.board.max(1)) {
    this.position[1] = world.board.max(1);
    this.theta += Math.PI;
  }
  if (this.position[1] < world.board.min(1)) {
    this.position[1] = world.board.min(1);
    this.theta += Math.PI;
  }
};

Fella.prototype.die = function() {
  if (!this.alive) return;
  var deathSpeed = 3.5;
  for (var i = 0, part; part = this.parts[i]; i++) {
    var vTheta = Math.random()*2*Math.PI;

    part.vX = this.speed + Math.cos(vTheta)*deathSpeed;
    part.vY = Math.sin(vTheta)*deathSpeed;
    part.vZ = Math.random()*6;
    part.bodyPosition = this.position;
    part.advance = function(dt) {
      if (this.position[2] > this.size[2]/2.1 || !world.inBounds(
          this.bodyPosition)) {
        this.position[0] += this.vX*dt;
        this.position[1] += this.vY*dt;
        this.position[2] += this.vZ*dt;
        if (this.position[2] < this.size[2]/2.1) {
          this.position[2] = this.size[2]/2.5
        }
        this.vZ -= world.G*dt;
      }
    }
  }
  this.alive = false;
  world.things.remove(this);
  world.effects.push(this);
};

Fella.prototype.draw = function() {
  gl.pushMatrix();

  this.transform();

  this.parts.apply("draw");

  gl.popMatrix();
};

Fella.prototype.advanceDead = function(dt) {
  this.parts.apply("advance", dt);
};

Fella.prototype.buildBody = function(rgb) {
  this.parts.leftLeg = new Box([.25, .25, 1]).
      setPosition([0, .1875, .5]).
      setColor(rgb).
      setFulcrum([0, 0, .5]);
  this.parts.rightLeg = new Box([.25, .25, 1]).
      setPosition([0, -.1875, .5]).
      setColor(rgb).
      setFulcrum([0, 0, .5]);
  this.parts.head = new Box([.5, .5, .5]).
      setPosition([0, 0, 2.125]).
      setColor(rgb).
      setTexture(ImageManager.Textures.THWOMP).
      createTextureBuffer({
        front: [0, 1, 0, 1]
      });
  this.parts.torso = new Box([.3, .75, 1]).
      setPosition([0, 0, 1.5]).
      setColor(rgb);

  this.parts.push(this.parts.leftLeg);
  this.parts.push(this.parts.rightLeg);
  this.parts.push(this.parts.head);
  this.parts.push(this.parts.torso);

  this.parts.legAngle = 0;
  this.parts.stepDirection = 1;
};

Fella.prototype.shoot = function() {
  var thisCenter = this.center();
  var targetCenter = this.target.center();
  var d_x = targetCenter[0] - thisCenter[0];
  var d_y = targetCenter[1] - thisCenter[1];
  var d_z = targetCenter[2] - thisCenter[2];
  var d_xy = Math.sqrt(d_x*d_x + d_y*d_y);
  var s = Arrow.DEFAULT_SPEED;

  var a = -world.G * d_xy*d_xy / (2*s*s);
  var b = d_xy;
  var c = a - d_z;

  var disc = b*b - 4*a*c;
  if (disc < 0) return;

  var phi = -Math.atan((-b + Math.sqrt(disc))/(2*a));
  var theta = Vector.thetaTo(this.position, this.target.position);
  var s_xy =  Math.cos(phi)*s;

  var v_shot = [
    s_xy*Math.cos(theta),
    s_xy*Math.sin(theta),
    -s*Math.sin(phi)
  ];

  var shot = new Arrow(this, v_shot).
      setPosition([this.position[0], this.position[1], 1.5]).
      setTheta(theta).
      setPhi(phi);

  world.projectiles.push(shot);
};

Fella.prototype.dispose = function() {
  this.parts.apply('dispose');
};

Fella.newRandom = function() {
  return new Fella().
      setTheta(Math.random() * Math.PI*2).
      setPosition([
        Math.random()*world.board.size[0] + world.board.min(0),
        world.board.max(1) - Math.random() * 45,
        0
      ]);
};

Fella.prototype.center = function() {
  return [
    this.position[0],
    this.position[1],
    this.position[2] + 1.187
  ];
};
