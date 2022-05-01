export default class Powerup {
  constructor(pos, color) {
    this.pos = pos;
    this.color = color;
    this.type = ["timesTwo", "timesTwo"][Math.floor(Math.random() * 2)];
    this[`draw${this.type.slice(0,1).toUpperCase() + this.type.slice(1)}`]();
  }

  // shield
  drawShield() {
    const shield = new Path.Circle(this.pos, 20);
    shield.strokeColor = this.color;
    this.piece = shield;
  }

  // x2
  drawTimesTwo() {
    const timesTwoCircle = new Path.Circle(this.pos, 20);
    const timesTwo = new PointText(new Point(this.pos));

    
    this.piece = timesTwoCircle;
    this.piece.strokeColor = "white";
    this.piece.dashArray = [5, 7.5];
    this.piece.onFrame = () => this.piece.rotate(3);
    
    this.pieceText = timesTwo;
    this.pieceText.content = "\u00d72";

    this.runHue = 0;
    this.pieceText.fillColor = `hsl(${this.runHue}, 50%, 50%)`;
    this.pieceText.onFrame = () => {
      if (this.runHue === 360) this.runHue = 0;
      this.pieceText.fillColor = `hsl(${this.runHue}, 50%, 70%)`;
      this.runHue += 3;
    };

    this.piece.fontFamily = "raleway";
    this.piece.fontWeight = 700;
    const {_width: w, _height: h} = this.pieceText.getBounds();
    this.pieceText.translate(new Point(-w/2, h/2 - 3));
  }
}