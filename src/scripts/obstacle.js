export default class Obstacle {
  constructor(type) {
    this.radius = 100;
    this[`draw${type}`]();
  }

  draw1() {
    this.piece = new Path.Star(new Point(400, 400), 5, 80, 150);
    this.piece.strokeColor = "red";
    this.piece.splitAt(0);
    this.piece.removeSegments(0,2);
    this.piece.onFrame = e => {
      this.piece.rotate(1);
    }
  }

  draw2() {
    this.piece = new Path.Arc({
      from: [500, 800],
      through: [500, 1000],
      to: [600, 900],
      strokeColor: "red"
    });
    this.piece.onFrame = e => {
      this.piece.rotate(1, new Point(500, 900));
    }
  }

  draw3() {
    this.piece = new Path.Line({
      from: [800, 300],
      to: [1000, 500],
      strokeColor: "red"
    });
    this.piece.onFrame = e => {
      this.piece.rotate(1);
    }
  }
}