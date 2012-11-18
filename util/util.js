Util = function(){};

Util.degToRad = function(degrees) {
  return degrees * Math.PI / 180;
};

Util.randomColor = function() {
  return [Math.random(), Math.random(), Math.random(), 1];
};

Util.reverseColor = function(rgba) {

  return [1 - rgba[0], 1 - rgba[1], 1 - rgba[2], rgba[3]];
};

Util.distanceSquared = function(v1, v2) {
  return (v1[0] - v2[0])*(v1[0] - v2[0]) +
      (v1[1]-v2[1])*(v1[1]-v2[1]) +
      (v1[2]-v2[2])*(v1[2]-v2[2]);
};

Util.thetaTo = function(v1, v2) {
  return Math.atan2(v2[1] - v1[1], v2[0] - v1[0]);
};

Util.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;
};

Util.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    // Prepend the bound arguments to the current arguments.
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.unshift.apply(newArgs, args);
    return fn.apply(this, newArgs);
  };
};

Array.prototype.apply = function(fnString, arg) {
  for (var i = 0, elm; elm = this[i]; i++) {
    elm[fnString](arg);
  }
};

Array.prototype.remove = function(removee){
  var index;
  while((index = this.indexOf(removee)) != -1){
      this.splice(index, 1);
  }
  return this;
};

Framerate = function(id) {
  this.lastTime = 0;
  this.numFramerates = 10;
  this.framerateUpdateInterval = 500;
  this.id = id;

  this.renderTime = -1;
  this.framerates = [ ];
  self = this;
  var fr = function() { self.updateFramerate() }
  setInterval(fr, this.framerateUpdateInterval);
};

Framerate.prototype.updateFramerate = function() {
  var tot = 0;
  for (var i = 0; i < this.framerates.length; ++i)
    tot += this.framerates[i];

  var framerate = tot / this.framerates.length;
  framerate = Math.round(framerate);
  document.getElementById(this.id).innerHTML = "Framerate:"+framerate+"fps";
};

Framerate.prototype.snapshot = function() {
  if (this.renderTime < 0)
    this.renderTime = new Date().getTime();
  else {
    var newTime = new Date().getTime();
    var t = newTime - this.renderTime;
    if (t == 0)
      return;
    var framerate = 1000/t;
    this.framerates.push(framerate);
    while (this.framerates.length > this.numFramerates)
      this.framerates.shift();
    this.renderTime = newTime;
  }
};