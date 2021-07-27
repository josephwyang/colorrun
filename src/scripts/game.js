import Player from "./player";

export default class Game {
  constructor() {
    this.player = new Player();

    window.addEventListener("keydown", e => {
      if (e.key.slice(0, 5) === "Arrow") { this.player.move(e.key); }
    });

    window.addEventListener("keyup", e => {
      if (e.key.slice(0, 5) === "Arrow") { this.player.stop(e.key); }
    });
  }
}