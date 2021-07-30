export default class Score {
  constructor(initialX, speed) {
    this.initialX = initialX;
    this.speed = speed;
    this.draw();
  }

  draw() {
    this.piece = new Path.Line({
      from: new Point(this.initialX, 0),
      to: new Point(this.initialX, view.bounds.height)
    });
    this.piece.strokeColor = "transparent";
    this.piece.onFrame = () => {
      if(this.piece.position.x < -view.bounds.width) this.piece.remove();
      else { this.piece.position.x -= this.speed }
    }
  }
}