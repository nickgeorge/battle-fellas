Tribe = function(name, leader, index) {
  this.name = name;
  this.leader = leader;
  this.index = index;
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

Tribe.get(index) {
  return Tribe.LIST_[index];
};