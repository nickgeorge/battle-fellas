Fella = function(xyz, rgb) {
  this.position = xyz;
  this.theta = 0;
  this.phi = 0;

  this.speed = 5;
  this.alive = true;
  this.target = null;
  this.parts = [];

  this.buildBody(rgb || Util.randomColor());
};

Fella.MAX_LEG_ANGLE = Util.degToRad(30);

Fella.prototype.advance = function(dt) {
  if (this.alive) {
    if (!this.target || !this.target.alive) this.aquireTarget();
    this.theta = Util.thetaTo(this.position, this.target.position);
    this.advanceAlive(dt);
    if (Math.random() < .015) this.shoot();
  } else { 
    this.advanceDead(dt);
  }
};

Fella.prototype.aquireTarget = function() {
  this.target = this.getClosestThing();
};

Fella.prototype.getClosestThing = function() {
  var minDistance = Number.MAX_VALUE;
  var closestThing = null;
  for (var i = 0, thing; thing = world.things[i]; i++) {
    if (this == thing) continue;
    var d = Util.distanceSquared(this.position, thing.position);
    if (d < minDistance) {
      minDistance = d;
      closestThing = thing;
    }
  }
  return closestThing;
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
  var deathSpeed = 3.5;
  for (var i = 0, part; part = this.parts[i]; i++) {
    var vTheta = Math.random()*2*Math.PI;

    part.vX = this.speed + Math.cos(vTheta)*deathSpeed;
    part.vY = Math.sin(vTheta)*deathSpeed;
    part.vZ = Math.random()*6;
    part.bodyPosition = this.position;
    part.advance = function(dt) {
      if (this.position[2] > 0 || !world.inBounds(
          this.bodyPosition)) {
        this.position[0] += this.vX*dt;
        this.position[1] += this.vY*dt;
        this.position[2] += this.vZ*dt;
        this.vZ -= 12*dt;
      }
    }
  }
  this.alive = false;
};

Fella.prototype.draw = function() {
  gl.pushMatrix();

  gl.translate(this.position);
  gl.rotate(this.theta, [0, 0, 1]);
  gl.rotate(this.phi, [0, 1, 0]);

  for (var i = 0, part; part = this.parts[i]; i++) {
    part.draw();
  }

  gl.popMatrix();
};

Fella.prototype.advanceDead = function(dt) {
  for (var i = 0, part; part = this.parts[i]; i++) {
    part.advance(dt);
  }
};

Fella.prototype.setPosition = function(xyz) {
  this.position = xyz;
  return this;
};

Fella.prototype.setTheta = function(theta) {
  this.theta = theta;
  return this;
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
      setColor(rgb);
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
  var d_x = this.target.position[0] - this.position[0];
  var d_y = this.target.position[1] - this.position[1];
  var d_z = this.target.position[2] - this.position[2] - 1.5;
  var d_xy = Math.sqrt(d_x*d_x + d_y*d_y);
  var s = Arrow.DEFAULT_SPEED;

  var a = -world.G * d_xy*d_xy / (2*s*s);
  var b = d_xy;
  var c = a - d_z;

  var disc = b*b - 4*a*c;
  if (disc < 0) return;

  var phi = -Math.atan((-b + Math.sqrt(disc))/(2*a));
  var theta = Util.thetaTo(this.position, this.target.position);
  var s_xy =  Math.cos(phi)*s;

  var v_shot = [
    s_xy*Math.cos(theta),
    s_xy*Math.sin(theta),
    -s*Math.sin(phi)
  ];
  // console.log ( a + " : " + b + " : " + c + " : " + phi + " : " + theta);
  var shot = new Arrow(this, v_shot).
      setPosition([this.position[0], this.position[1], 1.5]).
      setTheta(theta).
      setPhi(phi);

  world.projectiles.push(shot);
};