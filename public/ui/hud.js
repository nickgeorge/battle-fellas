HUD = function(canvas, camera, listener, framerate) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.hero = null;
  this.camera = camera;
  this.listener = listener;
  this.framerate = framerate;
  this.isRendering = true;

  this.widgets = [];

  this.widgets.push(new GuysLeft(this.context, 25, 25));
  this.widgets.push(new Fraps(this.context, -100, 25, framerate));
};

HUD.prototype.render = function() {
  if (this.isRendering) {
    this.clear();
  }

  this.widgets.apply('render', this.hero);
};

HUD.prototype.clear = function() {
  this.context.clearRect(0, 0,
      this.canvas.width, this.canvas.height);
};

HUD.prototype.setHero = function(hero) {
  this.hero = hero;
  this.camera.hero = hero;
  this.listener.hero = hero;
  return this;
};


Widget = function(context, x, y) {
  this.context = context;
  this.x = x;
  this.y = y;
};

Widget.prototype.position = function() {
  return [
    this.x > 0 ? this.x : this.context.canvas.width + this.x,
    this.y > 0 ? this.y : this.context.canvas.height + this.y
  ];
};

GuysLeft = function(context, x, y) {
  Util.base(this, context, x, y);
};
Util.inherits(GuysLeft, Widget);

GuysLeft.prototype.render = function(hero) {
  this.context.font = '16px courier';
  this.context.fillStyle = '#F00';
  var position = this.position();
  this.context.fillText('Guys Left: ' + 
      (hero.tribe.getEnemyCount()),
      position[0], position[1]);
};

Fraps = function(context, x, y, framerate) {
  Util.base(this, context, x, y);
  this.framerate = framerate;
};
Util.inherits(Fraps, Widget);

Fraps.prototype.render = function(hero) {
  var fraps = this.framerate.rollingAverage;
  this.context.font = '16px courier';
  this.context.fillStyle = fraps < 45 ? '#F00' : '#0F0';
  var position = this.position();
  this.context.fillText('Fraps: ' + fraps,
      position[0], position[1]);
};