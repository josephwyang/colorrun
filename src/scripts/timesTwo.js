export default class TimesTwo {
  constructor(pos, radius) {
    this.pos = pos;
    this.radius = radius;
    this.draw();
  }

  draw() {
    this.piece = new Path.Circle(this.pos, this.radius);
    this.runHue = 0;
    this.piece.fillColor = `hsl(${this.runHue}, 50%, 50%)`;
    this.piece.fillColor.alpha = 0;
    this.piece.onFrame = () => {
      this.piece.fillColor.alpha += 0.04;
      if (this.piece.fillColor.alpha === 1) {
        this.piece.onFrame = () => {
          if (this.runHue === 360) this.runHue = 0;
          this.piece.fillColor = `hsl(${this.runHue}, 50%, 70%)`;
          this.runHue += 3;
        };
        setTimeout(() => {
          let rad = 0
          this.piece.onFrame = () => {
            rad += 0.23
            this.piece.fillColor.alpha = Math.cos(rad)
          }
        }, 6000)
      }
    }
  }

  updatePos(pos) {
    this.piece.position = pos;
  }
}