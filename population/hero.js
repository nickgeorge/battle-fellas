Hero = function(xyz, rgb) {
  Util.base(this, xyz, rgb);
  this.draw = function(){};
  world.theOne = this;

  this.vX = 0;
  this.vY = 0;
  this.vTheta = 0;
  this.vPhi = 0;
  this.theta = 0;
  this.phi = 0;

  this.vPhiMag = 5/12*pi;
  this.vThetaMag = 5/12*pi;
  this.vRMag = 20;

  this.bob = 0;
};
Util.inherits(Hero, Fella);

Hero.prototype.aquireTarget = function() {
  this.target = this.getClosestThing();
};

Hero.prototype.advance = function(dt) {
  if (this.alive) {
    this.advanceAlive(dt);
  } else { 
    this.advanceDead(dt);
  }
};

Hero.prototype.advanceAlive = function(dt) {
  this.phi += this.vPhi * dt;
  this.theta += this.vTheta * dt;

  if (this.vX || this.vY) this.bob += 3*pi * dt;

  this.position[0] -= Math.cos(this.theta)*this.vX*dt -
      Math.sin(this.theta)*this.vY*dt;
  this.position[1] -= Math.sin(this.theta)*this.vX*dt + 
      Math.cos(this.theta)*this.vY*dt;  

  if (this.position[0] > world.board.max(0)) {
    this.position[0] = world.board.max(0);
  }
  if (this.position[0] < world.board.min(0)) {
    this.position[0] = world.board.min(0);
  }
  if (this.position[1] > world.board.max(1)) {
    this.position[1] = world.board.max(1);
  }
  if (this.position[1] < world.board.min(1)) {
    this.position[1] = world.board.min(1);
  }
};

Hero.prototype.center = function() {
  var fellaCenter = Util.base(this, 'center');
  return [
    fellaCenter[0],
    fellaCenter[1],
    fellaCenter[2]
  ]; 
};

Hero.prototype.shoot = function() {
  var s = Arrow.DEFAULT_SPEED;
  var s_xy =  Math.cos(this.phi)*s;

  var v_shot = [
    s_xy*Math.cos(this.theta),
    s_xy*Math.sin(this.theta),
    s*Math.sin(this.phi)
  ];
  var shot = new Arrow(this, v_shot).
      setPosition([
        this.position[0],
        this.position[1],
        1.85 + Math.sin(this.bob)/3.5
      ]).
      setTheta(this.theta).
      setPhi(this.phi);

  world.projectiles.push(shot);
};

Hero.prototype.die = function() { 
  world.things = [];
  world.effects = [];
  world.projectiles = [];
  world.populate();
};

Hero.newRandom = function() {
  return new Hero().
      setColor([1, 1, 1]).
      setTheta(pi/2).
      setPosition([
          Math.random()*world.board.size[0] + world.board.min(0),
          world.board.min(1) + Math.random() * 15,
          0
      ]);
};