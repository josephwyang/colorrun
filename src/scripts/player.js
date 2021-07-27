import Particle from "./particle";

export default class Player {
  constructor(obstacles, removeListeners) {
    this.obstacles = obstacles;
    this.removeListeners = removeListeners;
    this.activeDirs = {};
    this.radius = 10;
    this.draw();
  }

  draw() {
    this.piece = new Path.Circle(new Point(75, (window.innerHeight/2)), this.radius);
    this.piece.fillColor = "white";
    this.piece.onFrame = () => {
      for(const dir in this.activeDirs) {
        if (this.activeDirs[dir]) { this.updatePos(dir); }
      }
    }
  }

  move(dir) { this.activeDirs[dir] = true; }
  stop(dir) {  this.activeDirs[dir] = false; }

  updatePos(dir) {
    for(const obstacle of this.obstacles) {
      if (this.piece.getIntersections(obstacle.ring).length) { this.gameOver(); }
    }
    
    const vel = 10;
    switch(dir) {
      case "ArrowUp":
        if(this.piece.position.y - vel > this.radius + 50) this.piece.position.y -= vel;
        break;
      case "ArrowLeft":
        if(this.piece.position.x - vel > this.radius) this.piece.position.x -= vel;
        break;
      case "ArrowRight":
        if(this.piece.position.x + vel < window.innerWidth - this.radius) this.piece.position.x += vel;
        break;
      case "ArrowDown":
        if(this.piece.position.y + vel < window.innerHeight - this.radius) this.piece.position.y += vel;
        break;
    }
  };

  gameOver() {
    this.activeDirs = {};
    this.removeListeners();
    for(let i = 0; i < 20; i++) {new Particle(this.piece.position, this.piece.fillColor)};
    this.piece.remove();
  }
}