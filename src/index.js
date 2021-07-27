import * as paper from 'paper';
import Game from "./scripts/game";

document.addEventListener("DOMContentLoaded", () => {
  paper.install(window);
  paper.setup("canvas");
  const game = new Game();
});