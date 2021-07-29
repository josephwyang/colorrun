import Player from "./player";
import Obstacle from "./obstacle";

export default class Game {
  constructor() {
    this.player = new Player();
    this.active = true;
    
    this.movePlayer = this.movePlayer.bind(this);
    this.stopPlayer = this.stopPlayer.bind(this);
    this.reset = this.reset.bind(this);
    this.spaceReset = this.spaceReset.bind(this);

    document.querySelector("#restart-btn").onclick = this.reset;
    this.init();
    
    view.onFrame = e => {
      if (this.active) {
        if(e.count % 300 === 0) this.obstacles.push(new Obstacle());
        for(const i in this.obstacles) {
          if (this.obstacles[i].group.children.some(child => this.player.piece.getIntersections(child).length)) { this.gameOver(); }
          this.obstacles[i].move();
          if (!window.paper.project.activeLayer.isChild(this.obstacles[i].group)) { delete this.obstacles[i] }
        }
      }
    }
  }

  init() {
    this.obstacles = [];
    this.active = true;
    window.addEventListener("keydown", this.movePlayer);
    window.addEventListener("keyup", this.stopPlayer);
  }

  setRestartModal(display) { document.querySelector(".modal").style.display = display; }
  movePlayer(e) { if (e.key.slice(0, 5) === "Arrow") this.player.move(e.key); }
  stopPlayer(e) { if (e.key.slice(0, 5) === "Arrow") this.player.stop(e.key); }

  gameOver() {
    window.removeEventListener("keydown", this.movePlayer);
    window.removeEventListener("keyup", this.stopPlayer);

    window.addEventListener("keydown", this.spaceReset)
    this.setRestartModal("block");
    this.player.gameOver();
    this.obstacles.forEach(obstacle => obstacle.group.remove());
    this.active = false;
  }

  spaceReset(e) {
    if(e.key === " ") this.reset(e);
  }

  reset(e) {
    e.preventDefault();
    window.removeEventListener("keydown", this.spaceReset)
    this.setRestartModal("none");

    this.player.reset();
    this.init();
  }
}