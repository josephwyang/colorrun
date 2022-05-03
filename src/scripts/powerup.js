export default class Powerup {
  constructor(pos, color) {
    this.pos = pos;
    this.color = color;
    
    const types = ["shield", "timesTwo", "shrink"];
    this.type = types[Math.floor(Math.random() * types.length)];
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

    const {_width: w, _height: h} = this.pieceText.getBounds();
    this.pieceText.translate(new Point(-w/2, h/2 - 3));
  }

  //shrink
  drawShrink() {
    const shrinkCircle = new Path.Circle(this.pos, 20);
    const leftArrow = new PointText(new Point(this.pos));
    const rightArrow = new PointText(new Point(this.pos));

    leftArrow.content = "\u2B00"
    leftArrow.fillColor = "white";
    leftArrow.fontSize = 25;
    
    rightArrow.content = "\u2B03";
    rightArrow.fillColor = "white";
    rightArrow.fontSize = 25;

    const {_width: wLeft, _height: hLeft} = leftArrow.getBounds();
    leftArrow.translate(new Point(-wLeft/2 - 6, hLeft/2 - 4));
    const {_width: wRight, _height: hRight} = rightArrow.getBounds();
    rightArrow.translate(new Point(-wRight/2 + 6, hRight/2 - 16));
    
    this.piece = shrinkCircle;
    this.piece.strokeColor = "white";

    this.pieceText = new Group([leftArrow, rightArrow]);
    this.rad = 0;
    this.pieceText.onFrame = () => {
      this.rad += 0.15;
      const delta = Math.sin(this.rad) * 0.2;
      leftArrow.translate(new Point(-delta, delta));
      rightArrow.translate(new Point(delta, -delta));
    };
  }
}