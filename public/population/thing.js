Thing = function(proto) {
  !proto && (proto = {});
  this.phi = proto.phi || 0;
  this.theta = proto.theta || 0;
  this.position = proto.position || [0, 0, 0];
  this.fulcrum = proto.fulcrum || null;
  this.color = proto.color || [0, 0, 0, 0];
};

Thing.prototype.setTheta = function(theta) {
  this.theta = theta;
  return this;
};


Thing.prototype.setPhi = function(phi) {
  this.phi = phi;
  return this;
};

Thing.prototype.setPosition = function(xyz) {
  this.position = [xyz[0], xyz[1], xyz[2]];
  return this;
};

Thing.prototype.setFulcrum = function(xyz) {
  this.fulcrum = xyz;
  return this;
};

Thing.prototype.setColor = function(rgba) {
  rgba[3] || (rgba[3] = 1);
  this.color = rgba;
  this.setColorInternal(); 
  return this;
};

Thing.prototype.setColorInternal = function() {
  throw 'Set Color Internal unimplemented for ' + this
};

Thing.prototype.setTribe = function(tribe) {
  tribe.add(this);
  this.tribe = tribe;
  return this;
};

Thing.prototype.draw = function() {
  throw 'Draw unimplemented for type ' +
      this.constructor;

};

Thing.prototype.advance = function() {
  throw 'Advance unimplemented for type ' +
      this.constructor;
};

Thing.prototype.transform = function() {
  gl.translate(this.position);
  gl.rotate(this.theta, [0, 0, 1]);
  gl.rotate(this.phi, [0, 1, 0]);
};

Thing.prototype.getClosestThing = function() {
  var minDistance = Number.MAX_VALUE;
  var closestThing = null;
  for (var i = 0, thing; thing = world.things[i]; i++) {
    if (!thing.alive || this == thing) continue;
    var d = Vector.distanceSquared(this.position, thing.position);
    if (d < minDistance) {
      minDistance = d;
      closestThing = thing;
    }
  }
  return closestThing;
};

Thing.prototype.center = function() {
  return this.position;
};

Thing.prototype.die = function() {
  this.tribe.remove(this);
};