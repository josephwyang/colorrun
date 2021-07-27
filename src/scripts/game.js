import Player from "./player";
import Obstacle from "./obstacle";

export default class Game {
  constructor() {
    this.player = new Player();
    this.obstacles = [];

    view.onFrame = e => {
      if(e.count % 300 === 0) this.obstacles.push(new Obstacle());
      for(const i in this.obstacles) {
        if (this.obstacles[i].group.children.some(child => this.player.piece.getIntersections(child).length)) { this.gameOver(); }
        this.obstacles[i].move();
        if (!window.paper.project.activeLayer.isChild(this.obstacles[i].group)) { delete this.obstacles[i] }
      }
    }

    this.movePlayer = this.movePlayer.bind(this);
    this.stopPlayer = this.stopPlayer.bind(this);
    this.reset = this.reset.bind(this);

    window.addEventListener("keydown", this.movePlayer);
    window.addEventListener("keyup", this.stopPlayer);
    document.querySelector("#restart-btn").onclick = this.reset;
  }
  
  setRestartModal(display) { document.querySelector(".modal").style.display = display; }
  movePlayer(e) { if (e.key.slice(0, 5) === "Arrow") this.player.move(e.key); }
  stopPlayer(e) { if (e.key.slice(0, 5) === "Arrow") this.player.stop(e.key); }

  gameOver() {
    window.removeEventListener("keydown", this.movePlayer);
    window.removeEventListener("keyup", this.stopPlayer);

    window.addEventListener("keydown", this.reset)
    this.setRestartModal("block");
    view.onFrame = null;
    this.player.gameOver();
    this.obstacles.forEach(obstacle => obstacle.stop());
  }

  reset(e) {
    e.preventDefault();
    window.removeEventListener("keydown", this.reset)
    this.setRestartModal("none");

    this.player.reset();
    this.obstacles.forEach(obstacle => obstacle.group.remove());

    view.onFrame = e => {
      if(e.count % 300 === 0) this.obstacles.push(new Obstacle());
      for(const i in this.obstacles) {
        if (this.obstacles[i].group.children.some(child => this.player.piece.getIntersections(child).length)) { this.gameOver(); }
        this.obstacles[i].move();
        if (!window.paper.project.activeLayer.isChild(this.obstacles[i].group)) { delete this.obstacles[i] }
      }
    }
    
    window.addEventListener("keydown", this.movePlayer);
    window.addEventListener("keyup", this.stopPlayer);
  }
}