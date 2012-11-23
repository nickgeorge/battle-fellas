Util = function(){};

Util.degToRad = function(degrees) {
  return degrees * Math.PI / 180;
};

Util.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;
  childCtor.prototype.super = parentCtor;
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

Util.sqr = function(x) {
  return x*x;
}

Array.prototype.apply = function(fnString, arg1, arg2, arg3) {
  for (var i = 0, elm; elm = this[i]; i++) {
    elm[fnString](arg1, arg2, arg3);
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
