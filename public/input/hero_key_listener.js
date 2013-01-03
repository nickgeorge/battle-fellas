HeroKeyListener = function() {};

HeroKeyListener.keyMap = {};

HeroKeyListener.onKey = function(event) {
  var isKeydown = event.type == 'keydown';
  var keyCode = event.keyCode;
  if (isKeydown) {
    if (HeroKeyListener.keyMap[keyCode]) return;
    HeroKeyListener.keyMap[keyCode] = true;
  } else {
    HeroKeyListener.keyMap[keyCode] = false;
  }

  var target = world.theOne;
  switch (keyCode) {
    case 65: 
      target.vY = isKeydown ? -target.vRMag : 0;
      break;
    case 68: 
      target.vY = isKeydown ? target.vRMag : 0;
      break;
    case 87: 
      target.vX = isKeydown ? -target.vRMag : 0;
      break;
    case 83: 
      target.vX = isKeydown ? target.vRMag : 0;
      break;
    case 38: 
      target.vPhi = isKeydown ? target.vPhiMag : 0;
      break;
    case 40: 
      target.vPhi = isKeydown ? -target.vPhiMag : 0;
      break;
    case 37: 
      target.vTheta = isKeydown ? target.vThetaMag : 0;
      break;
    case 39: 
      target.vTheta = isKeydown ? -target.vThetaMag : 0;
      break;
    case 32: //space
      isKeydown && target.shoot();
      break;
    default:
      console.log(event.keyCode); 
      return;
  }
  event.preventDefault();
  event.stopPropagation();
}