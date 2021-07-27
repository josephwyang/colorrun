import Player from "./player";
import Obstacle from "./obstacle";

export default class Game {
  constructor() {
    this.obstacles = [new Obstacle()];
    this.player = new Player(this.obstacles, this.removeListeners.bind(this));
    this.movePlayer = this.movePlayer.bind(this);
    this.stopPlayer = this.stopPlayer.bind(this);

    window.addEventListener("keydown", this.movePlayer);

    window.addEventListener("keyup", this.stopPlayer);
  }
  
  movePlayer(e) {
    if (e.key.slice(0, 5) === "Arrow") { this.player.move(e.key); }
  }

  stopPlayer(e) {
    if (e.key.slice(0, 5) === "Arrow") { this.player.stop(e.key); }
  }

  removeListeners() {
    window.removeEventListener("keydown", this.movePlayer);
    window.removeEventListener("keyup", this.stopPlayer);
  }
}