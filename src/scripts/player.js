import Particle from "./particle";
import Shield from "./shield";
import TimesTwo from "./timesTwo";

export default class Player {
  constructor(color) {
    this.color = color;
    this.activeDirs = {};
    this.radius = 10;
    this.draw();
  }

  draw() {
    this.piece = new Path.Circle(new Point(75, view.bounds.height/2), this.radius);
    this.piece.fillColor = this.color;
    this.piece.onFrame = () => {
      for(const dir in this.activeDirs) {
        if (this.activeDirs[dir]) { this.updatePos(dir); }
      }
    }
  }

  reset() {
    this.piece.position = new Point(75, view.bounds.height/2);
    paper.project.activeLayer.addChild(this.piece);
  }

  move(dir) { this.activeDirs[dir] = true; }
  stop(dir) { this.activeDirs[dir] = false; }

  updatePos(dir) {
    const vel = 8;
    switch(dir) {
      case "ArrowUp":
        if(this.piece.position.y - vel >= this.radius) this.piece.position.y -= vel;
        else { this.piece.position.y = this.radius; }
        break;
      case "ArrowLeft":
        if(this.piece.position.x - vel > this.radius) this.piece.position.x -= vel;
        else { this.piece.position.x = this.radius; }
        break;
      case "ArrowRight":
        if(this.piece.position.x + vel < view.bounds.width - this.radius) this.piece.position.x += vel;
        else { this.piece.position.x = view.bounds.width - this.radius; }
        break;
      case "ArrowDown":
        if(this.piece.position.y + vel < view.bounds.height - this.radius) this.piece.position.y += vel;
        else { this.piece.position.y = view.bounds.height - this.radius; }
        break;
    }
    if (this.shield) this.shield.updatePos(this.piece.position);
    if (this.timesTwo) this.timesTwo.updatePos(this.piece.position);
  };

  powerup(type) {
    switch(type) {
      case "shield":
        if (!this.shield) this.shield = new Shield(this.piece.position, this.color);
        break;
      case "timesTwo":
        if (this.timesTwo) {
          clearTimeout(this.oldTimesTwo);
          this.timesTwo.piece.remove();
          delete this.timesTwo;
        }
        this.timesTwo = new TimesTwo(this.piece.position, this.radius);
        this.oldTimesTwo = setTimeout(() => {
          if(this.timesTwo) {
            this.timesTwo.piece.remove();
            delete this.timesTwo;
          }
        }, 9000)
        break;
    }
  }

  shatter() { for(let i = 0; i < 20; i++) {new Particle(this.piece.position, this.piece.fillColor)}; }

  useShield() {
    this.shatter();
    this.shield.piece.remove();
    delete this.shield;
  }

  gameOver() {
    this.activeDirs = {};
    this.shatter();
    this.piece.remove();
    if (this.timesTwo) this.timesTwo.piece.remove();
    delete this.timesTwo;
  }
}