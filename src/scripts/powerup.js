export default class Powerup {
  constructor(pos, color) {
    this.pos = pos;
    this.color = color;
    this.type = ["shield"][Math.floor(Math.random()*1)];
    this[`draw${this.type.slice(0,1).toUpperCase() + this.type.slice(1)}`]();
  }

  // shield
  drawShield() {
    const shield = new Path.Circle(this.pos, 20);
    shield.strokeColor = this.color;
    this.piece = shield;
  }
}