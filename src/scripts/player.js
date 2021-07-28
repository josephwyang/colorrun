import paper from "paper";
import Particle from "./particle";

export default class Player {
  constructor() {
    this.activeDirs = {};
    this.radius = 10;
    this.draw();
  }

  draw() {
    this.piece = new Path.Circle(new Point(75, view.bounds.height/2), this.radius);
    this.piece.fillColor = "white";
    this.piece.onFrame = e => {
      for(const dir in this.activeDirs) {
        if (this.activeDirs[dir]) { this.updatePos(dir); }
      }
    }
  }

  reset() {
    this.piece.position = new Point(75, view.bounds.height/2);
    paper.project.activeLayer.addChild(this.piece);
  }

  move(dir) { debugger
    this.activeDirs[dir] = true; }
  stop(dir) { this.activeDirs[dir] = false; }

  updatePos(dir) {
    const vel = 10;
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
  };

  gameOver() {
    this.activeDirs = {};
    for(let i = 0; i < 20; i++) {new Particle(this.piece.position, this.piece.fillColor)};
    this.piece.remove();
  }
}