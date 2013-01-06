HeroKeyListener = function() {
  this.keyMap = {};
};

KeyCode = {
  SPACE: 32,
  P: 80,
  
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  A: 65,
  D: 68,
  S: 83,
  W: 87
};  

HeroKeyListener.prototype.onKey = function(event) {
  var isKeydown = event.type == 'keydown';
  var keyCode = event.keyCode;
  if (isKeydown) {
    if (this.keyMap[keyCode]) return;
    this.keyMap[keyCode] = true;
  } else {
    this.keyMap[keyCode] = false;
  }

  var target = world.theOne;
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
      world.paused = !world.paused;
    default:
      console.log(event.keyCode); 
      return;
  }
  event.preventDefault();
  event.stopPropagation();
}