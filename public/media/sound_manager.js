var root_ = 'media/sounds/';

SoundManager = {
  play: function(sound) {
    new Audio(root_ + sound).play();
  }
}

Sounds = {
  ARROW: 'arrow_short.wav',
  METAL_EXPLOSION: 'metal_explosion.wav',
  GLASS: 'glass_short.wav',
  POP: 'pop_short.wav'
}