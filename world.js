World = function(theOne) {
  this.things = [];
  this.projectiles = [];
  this.effects = [];
  this.lights = [];
  this.theta = 0;
  this.rotSpeed = 0;
  this.board = null;
  this.G = 30;
  this.clearColorRgba = [0, 0, 0, 1];

  this.theOne = theOne;

  this.thingsToRemove = [];
  this.effectsToRemove = [];
  this.projectilesToRemove = [];
};

World.prototype.add = function(thing) {
  this.things.push(thing);
};

World.prototype.draw = function() {
  mat4.rotate(gl.mvMatrix, this.theta, [0, 0, 1]);
  this.board.draw();
  this.things.apply("draw");
  this.effects.apply("draw");
  this.projectiles.apply("draw");
};

World.prototype.advance = function(dt) {
  this.addAndRemoveThings();
  this.theta += this.rotSpeed * dt;
  this.things.apply("advance", [dt]);
  this.projectiles.apply("advance", [dt]);
  this.effects.apply("advance", [dt]);
  this.checkCollisions();

  while (this.projectiles.length > 200) this.projectiles.shift().dispose();
  while (this.effects.length > 200) this.effects.shift().dispose();
};

World.prototype.addLight = function(light) {
  this.lights.push(light);
};

World.prototype.applyLights = function() {
  for (var i = 0, light; light = this.lights[i]; i++) {
    light.apply();
  }
};

World.prototype.populate = function() {
  var light = new Light();
  light.setDirection([0, -.5, -1]);
  light.setAmbientColor([.2, .2, .2]);
  light.setDirectionalColor([.8, .8, .8]);
  this.addLight(light);

  var numFellas = 0;
  var numDumbCrates = 10;
  var numSmartCrates = 0;

  this.board = new Box([100, 200, 1]).
      setColor([1, 1, 1]).
      setPosition([0, 0, -.5]).
      setTexture(ImageManager.TEXTURES.GRASS).
      createTextureBuffer({
        top: [0, 15, 0, 30]
      });

  //this.board = new Board();

  for (var i = 0; i < numFellas; i++) {
    this.add(Fella.newRandom());
  }
  for (var i = 0; i < numDumbCrates; i++) {
    this.add(DumbCrate.newRandom());
  }
  for (var i = 0; i < numSmartCrates; i++) {
    this.add(SmartCrate.newRandom());
  }

  if (isPlayer) {
    this.add(Hero.newRandom());
  }
};

World.prototype.inBounds = function(xyz) {
  return Math.abs(xyz[0]) < this.board.max(0) 
      && Math.abs(xyz[1]) < this.board.max(1);
};

World.prototype.addAndRemoveThings = function() {
  for (var i = 0, thing; thing = this.thingsToRemove[i]; i++) {
    this.things.remove(thing);
    thing = null;
  }
  for (var i = 0, effect; effect = this.effectsToRemove[i]; i++) {
    this.effects.remove(effect);
    effect = null;
  }
  for (var i = 0, projectile; projectile = this.projectilesToRemove[i]; i++) {
    this.projectiles.remove(projectile);
    projectile = null;
  }
  this.thingsToRemove = [];
  this.effectsToRemove = [];
  this.projectilesToRemove = [];
};

World.prototype.checkCollisions = function() {
  for (var i = 0, projectile; projectile = this.projectiles[i]; i++) {
    for (var j = 0, thing; thing = this.things[j]; j++) {
      if (projectile.parent == thing) continue;
      var thingCenter = thing.center();
      var projectileCenter = projectile.center();
      var d_x = thingCenter[0] - projectileCenter[0];
      var d_y = thingCenter[1] - projectileCenter[1];
      var d_z = thingCenter[2] - projectileCenter[2];
      if (Math.abs(d_x) < 2 && Math.abs(d_y) < 2 && Math.abs(d_z) < 2) {
        var d2 = d_x*d_x + d_y*d_y + d_z*d_z;
        if (d2 < 1) {
          if (thing.alive) {
            thing.die();
            projectile.detonate();
            //this.add(thing.constructor.newRandom());
          }
        }
      } 
    }
  }
};