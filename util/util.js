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

Util.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (caller.superClass_) {
    // This is a constructor. Call the superclass constructor.
    return caller.superClass_.constructor.apply(
        me, Array.prototype.slice.call(arguments, 1));
  }

  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for (var ctor = me.constructor;
       ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else if (foundCaller) {
      return ctor.prototype[opt_methodName].apply(me, args);
    }
  }

  // If we did not find the caller in the prototype chain,
  // then one of two things happened:
  // 1) The caller is an instance method.
  // 2) This method was not called by the right caller.
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error(
        'goog.base called from a method of one name ' +
        'to a method of a different name');
  }
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
