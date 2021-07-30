export default class Shield {
  constructor(pos, color) {
    this.pos = pos;
    this.color = color;
    this.draw();
  }

  draw() {
    this.piece = new Path.Circle(this.pos, 15);
    this.piece.strokeColor = this.color;
    this.piece.strokeColor.alpha = 0;
    this.piece.onFrame = () => {
      this.piece.strokeColor.alpha += 0.1;
      if (this.piece.strokeColor.alpha === 1) this.piece.onFrame = undefined;
    }
  }

  updatePos(pos) {
    this.piece.position = pos;
  }
}