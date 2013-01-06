Tribe = function(name, leader, index) {
  this.name = name;
  this.leader = leader;
  this.index = index;
  this.members = [];
};

Tribe.BURNED_MEN = new Tribe('Burned Men',
    'Timett, son of Timett', 0);
Tribe.STONE_CROWS = new Tribe('Stone Crow',
    'Shagga, son of Dolf', 1);
Tribe.BLACK_EARS = new Tribe('Black Ears', 
    'Chella, daughter of Cheyk', 2);
Tribe.MOON_BROTHERS = new Tribe('Moon Brothers',
    'Ulf, son of Umar', 3);

Tribe.LIST_ = [
  Tribe.BURNED_MEN,
  Tribe.STONE_CROWS,
  Tribe.BLACK_EARS,
  Tribe.MOON_BROTHERS
];

Tribe.get = function(index) {
  return Tribe.LIST_[index];
};

Tribe.getRandomEnemy = function(allies) {
  var total = 0;
  for (var i = 0, tribe; tribe = Tribe.LIST_[i]; i++) {
    if (tribe != allies) total += tribe.members.length;
  }
  var index = parseInt(Math.random() * total);
  var tribeIndex = 0;
  var totalSoFar = 0;
  var enemy;
  while (index >= totalSoFar) {
    var tribe = Tribe.LIST_[tribeIndex++];
    if (tribe == allies) continue;
    if (enemy = tribe.members[index - totalSoFar]) {
      break;
    }
    totalSoFar += tribe.members.length;
  }
  return enemy;
};

Tribe.prototype.add = function(thing) {
  this.members.push(thing);
};

Tribe.prototype.remove = function(thing) {
  this.members.remove(thing);
};