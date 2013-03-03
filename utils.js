bind = function(fn, selfObj, var_args) {
  return fn.call.apply(fn.bind, arguments);
};

Array.prototype.remove = function(removee){
  var index;
  while((index = this.indexOf(removee)) != -1){
      this.splice(index, 1);
  }
  return this;
};