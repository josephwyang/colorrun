export default class Player {
  constructor() {
    this.activeDirs = {};
    this.radius = 10;
    this.draw();
  }

  draw() {
    this.circle = new Path.Circle(new Point(75, (window.innerHeight/2)), this.radius);
    this.circle.fillColor = "white";
    this.circle.onFrame = e => {
      for(const dir in this.activeDirs) {
        if (this.activeDirs[dir]) { this.updatePos(dir); }
      }
    }
  }

  move(dir) { this.activeDirs[dir] = true; }
  stop(dir) { this.activeDirs[dir] = false; }

  updatePos(dir) {
    const vel = 10;
    switch(dir) {
      case "ArrowUp":
        if(this.circle.position.y - vel > this.radius + 50) this.circle.position.y -= vel;
        break;
      case "ArrowLeft":
        if(this.circle.position.x - vel > this.radius) this.circle.position.x -= vel;
        break;
      case "ArrowRight":
        if(this.circle.position.x + vel < window.innerWidth - this.radius) this.circle.position.x += vel;
        break;
      case "ArrowDown":
        if(this.circle.position.y + vel < window.innerHeight - this.radius) this.circle.position.y += vel;
        break;
    }
  };
}