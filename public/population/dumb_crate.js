DumbCrate = function(position) {
  Util.base(this);
  this.setPosition(position);
  this.alive = true;
  this.box = new Box([1, 1, 1]).
      setColor([1, 1, 1]).
      setTexture(Textures.CRATE, true);

  this.parts = [this.box];

  this.outerRadius = .867;
  this.klass = "DumbCrate";
};
Util.inherits(DumbCrate, Thing);

DumbCrate.DEFAULT_SPEED = 60;

DumbCrate.prototype.die = function() {
  Util.base(this, 'die');

  world.thingsToRemove.push(this);
  world.effects.push(this);
  this.box.setColor([1, 1, 1, 1]);
  this.box.texture = null;
  this.alive = false;
  SoundManager.play(Sounds.POP);

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
  var x = Math.random()*world.board.size[0] + world.board.min(0);
  var y = Math.random()*world.board.size[1] + world.board.min(1);
  return new DumbCrate([1, 1, 1]).
      setTheta(Math.random() * Math.PI*2).
      setPosition([
        x,
        y,
        world.board.getHeight(x, y) + Math.random(10) + 5
      ]);
};
