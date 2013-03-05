HUD = function(canvas, camera, listener, framerate) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.hero = null;
  this.camera = camera;
  this.listener = listener;
  this.framerate = framerate;
  this.isRendering = true;
  this.logger = new Logger(this.context, 25, -300);

  this.widgets = [];

  this.widgets.push(this.logger);
  this.widgets.push(new GuysLeft(this.context, 25, -200));
  this.widgets.push(new Fraps(this.context, -250, 25, framerate));
  this.widgets.push(new AmmoCounter(this.context, 25, -175));
};

HUD.prototype.render = function() {
  if (this.isRendering) {
    this.clear();
    this.widgets.apply('render', this.hero);
  }
};

HUD.prototype.clear = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

HUD.prototype.setHero = function(hero) {
  this.hero = hero;
  this.camera.hero = hero;
  this.listener.hero = hero;
  return this;
};

HUD.prototype.getLogger = function() {
  return this.logger;
};


Widget = function(context, x, y, font, fillStyle) {
  this.context = context;
  this.x = x;
  this.y = y;
  this.font = font;
  this.fillStyle = fillStyle;

  this.position = [
    this.x > 0 ? this.x : this.context.canvas.width + this.x,
    this.y > 0 ? this.y : this.context.canvas.height + this.y
  ];
};

Widget.prototype.setFont = function(opt_font, opt_fillStyle) {
  this.context.font = opt_font || this.font;
  this.context.fillStyle = opt_fillStyle || this.fillStyle;
};

GuysLeft = function(context, x, y) {
  Util.base(this, context, x, y, 'bold 28px courier', '#FF1493');
};
Util.inherits(GuysLeft, Widget);

GuysLeft.prototype.render = function(hero) {
  this.setFont();
  var text = 'Guys Left: ' + hero.tribe.getEnemyCount();
  this.context.fillText(text, this.position[0], this.position[1]);
  this.context.strokeText(text, this.position[0], this.position[1]);
};

Fraps = function(context, x, y, framerate) {
  Util.base(this, context, x, y, 'bold 16px courier');
  this.framerate = framerate;
};
Util.inherits(Fraps, Widget);

Fraps.prototype.render = function() {
  var fraps = this.framerate.rollingAverage;
  this.setFont(null, fraps < 45 ? '#F00' : '#0F0');
  this.context.fillText('Fraps: ' + fraps,
      this.position[0], this.position[1]);
};

AmmoCounter = function(context, x, y) {
  Util.base(this, context, x, y, 'bold 28px courier', '#F0F');
};
Util.inherits(AmmoCounter, Widget);

AmmoCounter.prototype.render = function(hero) {
  this.setFont();
  var text = 'Arrows: ' + hero.ammo.arrows;
  this.context.fillText(text, this.position[0], this.position[1]);
  this.context.strokeText(text, this.position[0], this.position[1]);
};

Logger = function(context, x, y) {
  Util.base(this, context, x, y, 'bold 20px courier', '#0F0');

  this.activeLines = 0;
  this.maxLinesToShow = 3;
  this.index = 0;
  this.lines = [];
};
Util.inherits(Logger, Widget);

Logger.prototype.log = function(line) {
  this.lines.push(line);
  this.activeLines++;
  setTimeout(Util.bind(this.fade, this), 5000);
};

Logger.prototype.fade = function() {
  this.activeLines--;
};

Logger.prototype.render = function() {
  if (!this.activeLines) return;
  this.setFont();
  var length = this.lines.length;

  this.context.fillText(this.lines[length - 1],
      this.position[0], this.position[1] - 25*(this.activeLines - 1));
  this.setFont('16px courier', '#AAA');
  for (var i = 1; i < this.activeLines && i < this.maxLinesToShow; i++) {
    var line = this.lines[length - i - 1];
    if (!line) return;
    this.context.fillText(line,
        this.position[0], this.position[1] - 25*(this.activeLines - 1 - i));
  }
};
