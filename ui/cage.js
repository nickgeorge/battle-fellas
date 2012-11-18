// POINTS:
//   0  1
//   2  3
//
// LINES:
//   01    12
//   03    32
Cage = function(point1, point4, theta) {
  this.theta = theta;
  console.log(theta);
  this.mousePoints = [
    point1,
    0,
    0,
    point4
  ];
  this.planarPoints = [];
  this.calcPlanarPoints();

  this.parts = [];
  this.buildParts();

};
Util.inherits(Cage, Thing);

Cage.prototype.advance = function(dt) {};

Cage.prototype.draw = function() {
  this.parts.apply("draw");
};

Cage.prototype.setMousePoint4 = function(mp4) {
  this.mousePoints[3] = mp4;
  this.calcPlanarPoints();
  this.buildParts();
};

Cage.prototype.calcPlanarPoints = function() {
  this.mousePoints[1] = {
    x: this.mousePoints[3].x,
    y: this.mousePoints[0].y
  };
  this.mousePoints[2] = {
    x: this.mousePoints[0].x,
    y: this.mousePoints[3].y
  };
  for (var i = 0, mp; mp = this.mousePoints[i]; i++) {
    this.planarPoints[i] = getPlanarCoords(mp, 0);
    this.planarPoints[i][2] = .5;
  }
};

Cage.prototype.buildParts = function() {
  var centers = [
    [
      (this.planarPoints[0][0] + this.planarPoints[2][0]) / 2,
      (this.planarPoints[0][1] + this.planarPoints[2][1]) / 2,
      .5
    ],
    [      
      (this.planarPoints[0][0] + this.planarPoints[1][0]) / 2,
      (this.planarPoints[0][1] + this.planarPoints[1][1]) / 2,
      .5
    ], 
    [
      (this.planarPoints[3][0] + this.planarPoints[1][0]) / 2,
      (this.planarPoints[3][1] + this.planarPoints[1][1]) / 2,
      .5
    ],
    [      
      (this.planarPoints[3][0] + this.planarPoints[2][0]) / 2,
      (this.planarPoints[3][1] + this.planarPoints[2][1]) / 2,
      .5
    ]
  ];
  var sizes = [
    [
      .5,
      Math.sqrt(
          Util.sqr(this.planarPoints[0][0] - this.planarPoints[2][0]) +
          Util.sqr(this.planarPoints[0][1] - this.planarPoints[2][1])),
      .5
    ],
    [
      Math.sqrt(
          Util.sqr(this.planarPoints[0][0] - this.planarPoints[1][0]) +
          Util.sqr(this.planarPoints[0][1] - this.planarPoints[1][1])),
      .5,
      .5
    ],
    [
      .5,
      Math.sqrt(
          Util.sqr(this.planarPoints[1][0] - this.planarPoints[3][0]) +
          Util.sqr(this.planarPoints[1][1] - this.planarPoints[3][1])),
      .5
    ],
    [
      Math.sqrt(
          Util.sqr(this.planarPoints[3][0] - this.planarPoints[2][0]) +
          Util.sqr(this.planarPoints[3][1] - this.planarPoints[2][1])),
      .5,
      .5
    ],
  ];
  var color = [0, 1, 0];
  this.parts = [];
  for (var i = 0; i < 4; i++) {
    this.parts.push(new Box([1,1,1]||sizes[i]).
        setPosition(this.planarPoints[i]).
        setColor(color).
        setTheta(this.theta));
  }
  for (var i = 0; i < 4; i++) {
    this.parts.push(new Box(sizes[i]).
        setPosition(centers[i]).
        setColor([1,0,0]).
        setTheta(this.theta));
  }
}