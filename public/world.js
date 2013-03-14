World = function() {
  this.things = [];
  this.projectiles = [];
  this.effects = [];
  this.lights = [];
  this.theta = 0;
  this.rotSpeed = 0;
  this.board = null;
  this.G = 30;
  this.clearColorRgba = [0, 0, 0, 1];

  this.thingsToRemove = [];
  this.effectsToRemove = [];
  this.projectilesToRemove = [];

  this.paused = false;
};

World.prototype.add = function(thing) {
  this.things.push(thing);
};

World.prototype.draw = function() {
  mat4.rotate(gl.mvMatrix, this.theta, [0, 0, 1]);
  shaderProgram.reset();
  this.board.draw();
  this.things.apply('draw');
  this.effects.apply('draw');
  this.projectiles.apply('draw');
};

World.prototype.advance = function(dt) {
  this.addAndRemoveThings();

  if (this.paused) return;

  this.theta += this.rotSpeed * dt;
  this.things.apply('advance', [dt]);
  this.projectiles.apply('advance', [dt]);
  this.effects.apply('advance', [dt]);
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

  var haveBadGuys = true;
  var numSmartCrates = haveBadGuys && 10;
  var numFellas = haveBadGuys && 15;
  var numDumbCrates = 40;

  this.board = new Board();

  Tribe.MOON_BROTHERS.neutral = true;
  for (var i = 0; i < numDumbCrates; i++) {
    this.add(DumbCrate.newRandom().setTribe(Tribe.MOON_BROTHERS));
  }

  for (var i = 0; i < numFellas; i++) {
    this.add(Fella.newRandom().setTribe(Tribe.BURNED_MEN));
  }
  for (var i = 0; i < numSmartCrates; i++) {
    this.add(SmartCrate.newRandom().setTribe(Tribe.BURNED_MEN));
  }

  //this.add(Killball.newRandom().setTribe(Tribe.BURNED_MEN));

  var hero = Hero.newRandom().setTribe(Tribe.STONE_CROWS);
  this.add(hero);
  hud.setHero(hero);
  camera.anchor = hero;
};

World.prototype.reset = function() {
  world.things = [];
  world.effects = [];
  world.projectiles = [];
  Tribe.clear();

  world.populate();
}

World.prototype.inBounds = function(xyz) {
  return this.board.inBounds(xyz);
};

World.prototype.pause = function() {
  this.paused = !this.paused;
};

World.prototype.addAndRemoveThings = function() {
  for (var i = 0, thing; thing = this.thingsToRemove[i]; i++) {
    this.things.remove(thing);
  }
  for (var i = 0, effect; effect = this.effectsToRemove[i]; i++) {
    this.effects.remove(effect);
  }
  for (var i = 0, projectile; projectile = this.projectilesToRemove[i]; i++) {
    this.projectiles.remove(projectile);
  }
  this.thingsToRemove = [];
  this.effectsToRemove = [];
  this.projectilesToRemove = [];
};

World.prototype.checkCollisions = function() {
  for (var i = 0; this.projectiles[i]; i++) {
    for (var j = 0; this.things[j]; j++) {
      var projectile = this.projectiles[i];
      var thing = this.things[j];
      if (projectile.parent == thing) {
        continue;
      }
      if (Collision.check(projectile, thing)) {
        if (projectile.parent.tribe == thing.tribe) {
          this.projectilesToRemove.push(this);
        } else {
          if (thing.alive) {
            if (thing instanceof DumbCrate &&
                projectile.parent instanceof Hero) {
              projectile.parent.ammo.arrows += 3;
              logger.log("Picked up 3 arrows.");
            }
            thing.die();
            projectile.detonate();
          }
        }
      }
    }
  }
  for (var i = 0, thingA; thingA = this.things[i]; i++) {
    for (var j = i + 1, thingB; thingB = this.things[j]; j++) {
      if (Collision.closeEnough(thingA, thingB)) {
        var vectorTo = Vector.difference(thingA.position, thingB.position);
        var distance = Vector.mag(vectorTo);
        var outerRadiusA = thingA.getOuterRadius();
        var outerRadiusB = thingB.getOuterRadius();
        var delta = distance -
            Math.sqrt(outerRadiusA*outerRadiusA + outerRadiusB*outerRadiusB);

        var push = Vector.multiply(vectorTo, delta/distance);
        thingA.position = Vector.minus(thingA.position, push);
        thingB.position = Vector.sum(thingB.position, push);
      }
    }
  }
};
