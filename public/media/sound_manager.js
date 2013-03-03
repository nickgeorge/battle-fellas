SoundManager = {
  
  ROOT: 'media/sounds/',

  ARROW: 'bottle1.wav',
  


  play: function(sound) {
    new Audio(this.ROOT + sound).play();
  }
}