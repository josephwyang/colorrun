import Player from "./player";
import Obstacle from "./obstacle";

export default class Level {
  constructor(endGame) {
    this.player = new Player();
    this.obstacles = [];
    this.endGame = endGame;

    view.onFrame = e => {
      if(e.count % 600 === 0) this.obstacles.push(new Obstacle());
      for(const i in this.obstacles) {
        if (this.obstacles[i].group.children.some(child => this.player.piece.getIntersections(child).length)) { this.gameOver(); }
        if (!window.paper.project.activeLayer.isChild(this.obstacles[i].group)) { delete this.obstacles[i] }
      }
    }
  }

  reset() {
    this.draw();
    this.obstacles.forEach(obstacle => obstacle.group.remove());
    this.obstacles = [new Obstacle()];
    this.player.reset();
  }

  gameOver() {
    this.endGame();
    this.player.gameOver();
  }
}