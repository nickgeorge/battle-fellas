HeroListener = function(canvas) {
  this.canvas = canvas;
  this.keyMap = {};
  this.mouseIsLocked = false;
  this.sensitivityX = .0035;
  this.sensitivityY = .0035;

  this.hero = null;

  this.canLockPointer = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;

  this.canvas.requestFullScreen = canvas.requestFullScreen ||
      canvas.mozRequestFullScreen ||
      canvas.webkitRequestFullScreen;

  this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
      this.canvas.mozRequestPointerLock ||
      this.canvas.webkitRequestPointerLock;

  document.exitPointerLock = document.exitPointerLock ||
      document.mozExitPointerLock ||
      document.webkitExitPointerLock;
};


// Why would anyone expect the language to have this built in?
KeyCode = {
  CTRL: 17,
  SPACE: 32,

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  A: 65,
  D: 68,
  S: 83,
  W: 87,
  C: 67,
  F: 70,
  R: 82,
  P: 80
};

HeroListener.prototype.attachEvents = function() {
  document.addEventListener('keydown',
      Util.bind(this.onKey, this), true);
  document.addEventListener('keyup',
      Util.bind(this.onKey, this), true);
  document.addEventListener('mousedown',
      Util.bind(this.onMouseDown, this), true);

  document.addEventListener('pointerlockchange',
      Util.bind(this.onPointerLockChange, this), false);
  document.addEventListener('mozpointerlockchange',
      Util.bind(this.onPointerLockChange, this), false);
  document.addEventListener('webkitpointerlockchange',
      Util.bind(this.onPointerLockChange, this), false);

  document.addEventListener('mousemove',
      Util.bind(this.onMouseMove, this), false);
};

HeroListener.prototype.onMouseDown = function(e) {
  if (!document.webkitCurrentFullScreenElement) {
    //this.canvas.requestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  }
  if (!this.mouseIsLocked) {
    this.enableMouseLock();
    e.preventDefault();
    console.log("locked");
    return;
  }

  if (e.button == 0) {
    this.hero && this.hero.shootArrow();
  } else if (e.button == 2) {
    this.hero && this.hero.shootRail();
  }
};

HeroListener.prototype.enableMouseLock = function() {
  if (this.canLockPointer) {
    this.canvas.requestPointerLock();
  } else {
    // TODO: Something intelligent.
    console.log('Ye canna\' control that.');
  }
};

HeroListener.prototype.onMouseMove = function(event) {
  if (!this.hero) return;
  if (this.mouseIsLocked) {
    var movementX = event.movementX ||
        event.mozMovementX ||
        event.webkitMovementX ||
        0;
    var movementY = event.movementY ||
        event.mozMovementY ||
        event.webkitMovementY ||
        0;

    //console.log(movementX + " : " + movementY);
    this.hero.theta -= movementX * this.sensitivityX;
    this.hero.phi -= movementY * this.sensitivityY;
  }
};

HeroListener.prototype.onPointerLockChange = function(event) {
  if (document.pointerLockElement == this.canvas ||
    document.mozPointerLockElement == this.canvas ||
    document.webkitPointerLockElement == this.canvas) {
    this.mouseIsLocked = true;
  } else {
    this.mouseIsLocked = false;
  }
};

HeroListener.prototype.onKey = function(event) {
  var isKeydown = event.type == 'keydown';
  var keyCode = event.keyCode;
  if (isKeydown) {
    if (this.keyMap[keyCode]) return;
    this.keyMap[keyCode] = true;
  } else {
    this.keyMap[keyCode] = false;
  }

  var target = this.hero;
  switch (keyCode) {
    case KeyCode.A:
      target.vY = isKeydown ? -target.vRMag :
          (this.keyMap[KeyCode.D] ? target.vRMag : 0);
      break;
    case KeyCode.D:
      target.vY = isKeydown ? target.vRMag :
          (this.keyMap[KeyCode.A] ? -target.vRMag : 0);
      break;
    case KeyCode.W:
      target.vX = isKeydown ? -target.vRMag :
          (this.keyMap[KeyCode.S] ? target.vRMag : 0);
      break;
    case KeyCode.S:
      target.vX = isKeydown ? target.vRMag :
          (this.keyMap[KeyCode.W] ? -target.vRMag : 0);
      break;
    case KeyCode.UP:
      target.vPhi = isKeydown ? target.vPhiMag :
          (this.keyMap[KeyCode.DOWN] ? -target.vPhiMag : 0);
      break;
    case KeyCode.DOWN:
      target.vPhi = isKeydown ? -target.vPhiMag :
          (this.keyMap[KeyCode.UP] ? target.vPhiMag : 0);
      break;
    case KeyCode.LEFT:
      target.vTheta = isKeydown ? target.vThetaMag :
          (this.keyMap[KeyCode.RIGHT] ? -target.vThetaMag : 0);
      break;
    case KeyCode.RIGHT:
      target.vTheta = isKeydown ? -target.vThetaMag :
          (this.keyMap[KeyCode.LEFT] ? target.vThetaMag : 0);
      break;
    case KeyCode.SPACE:
      isKeydown && target.shoot();
      break;
    case KeyCode.P:
      isKeydown && world.pause();
      break;
    case KeyCode.F:
      this.canvas.requestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      break;
    case KeyCode.R:
      if (this.keyMap[KeyCode.CTRL]) return;
      isKeydown && (hud.isRendering = !hud.isRendering);
      hud.clear();
      break;
    default:
      console.log(event.keyCode);
      return;
  }
  event.preventDefault();
  event.stopPropagation();
}
