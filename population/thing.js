Thing = function(proto) {
  this.phi = proto.phi || 0;
  this.theta = proto.theta || 0;
  this.position = proto.position || [0, 0, 0];
  this.fulcrum = proto.fulcrum || null;;
  this.color = proto.color || [0, 0, 0, 0];
}

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
  throw "Set Color Internal unimplemented for type " +
      typeof this;
};

Thing.prototype.draw = function() {

};

Thing.prototype.advance = function() {

};