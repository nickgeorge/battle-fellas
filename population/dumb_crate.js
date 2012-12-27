DumbCrate = function(position) {
  this.theta = 0;
  this.phi = 0;
  this.position = position;
  this.alive = true;
  this.box = new Box([1, 1, 1]).
      setColor([1, 1, 1]).
      setTexture(ImageManager.Textures.CRATE, true);

  this.parts = [this.box];
};
Util.inherits(DumbCrate, Thing);

DumbCrate.DEFAULT_SPEED = 60;

DumbCrate.prototype.die = function() {
  world.thingsToRemove.push(this);
  world.effects.push(this);
  this.box.setColor([1, 1, 1, 1]);
  this.box.texture = null;
  this.alive = false;

  var dumbCrate = this;
  world.effects.push(new DoubleExplosion(1, null, null, function() {
    world.effectsToRemove.push(dumbCrate);
  }).setPosition(this.position));
};

DumbCrate.prototype.advance = function(dt) {};

DumbCrate.prototype.draw = function() {
  gl.pushMatrix();

  this.transform();
  this.box.draw();

  gl.popMatrix();
};
DumbCrate.prototype.dispose = function() {
  this.box.dispose();
};

DumbCrate.newRandom = function() {
  return new DumbCrate([1, 1, 1]).
      setTheta(Math.random() * Math.PI*2).
      setPosition([
        Math.random()*world.board.size[0] + world.board.min(0),
        Math.random()*world.board.size[1] + world.board.min(1),
        Math.random()*10 + 10
      ]);
};