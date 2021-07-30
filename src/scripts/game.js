import Player from "./player";
import Obstacle from "./obstacle";

export default class Game {
  constructor(color) {
    this.color = color;
    this.player = new Player(this.color);
    this.player.piece.remove();
    this.highScore = 0;
    this.speed = 7;

    this.setRestartModal("none");
    this.setCurrentScore("none");
    
    this.movePlayer = this.movePlayer.bind(this);
    this.stopPlayer = this.stopPlayer.bind(this);
    this.easyStart = this.easyStart.bind(this);
    this.hardStart = this.hardStart.bind(this);
    this.reset = this.reset.bind(this);
    this.spaceReset = this.spaceReset.bind(this);

    document.querySelector("#easy-start").onclick = this.easyStart;
    document.querySelector("#hard-start").onclick = this.hardStart;
    document.querySelector("#restart-btn").onclick = this.reset;
    this.run = document.querySelector("#run");
    this.runHue = 0;
    
    view.onFrame = e => {
      if (this.runHue === 360) this.runHue = 0;
      this.run.style.color = `hsl(${this.runHue}, 50%, 70%)`
      this.runHue += 0.7;

      if (this.active) {

        if(e.count % 300 === 0) this.obstacles.push(new Obstacle(this.speed));
        for(const i in this.obstacles) {
          const obstacle = this.obstacles[i];
          obstacle.move();

          if (obstacle.score && obstacle.score.piece.getIntersections(this.player.piece).length) {
            this.setScore();
            obstacle.score.piece.remove();
            delete obstacle.score;
          }

          if (obstacle.powerup && obstacle.powerup.piece.getIntersections(this.player.piece).length) {
            this.player.powerup(obstacle.powerup.type);
            obstacle.powerup.piece.remove();
            delete obstacle.powerup;
            break;
          }

          for (let child of obstacle.group.children) {
            if(this.player.piece.getIntersections(child).length) {
              if (this.player.shield) {
                this.player.useShield();
                child.shatter();
              } else { this.gameOver(); }
            }
          }

          if (!window.paper.project.activeLayer.isChild(obstacle.group)) { delete this.obstacles[i] }
        }
      }
    }
  }

  init() {
    this.player.reset();
    this.obstacles = [];
    this.powerups = [];
    this.setScore(0);
    this.active = true;
    window.addEventListener("keydown", this.movePlayer);
    window.addEventListener("keyup", this.stopPlayer);
    this.setStartModal("none");
    this.setRestartModal("none");
    this.setCurrentScore("block");
  }

  easyStart(e) {
    e.preventDefault();
    this.speed = 6;
    this.init();
  }

  hardStart(e) {
    e.preventDefault();
    this.speed = 8;
    this.init();
  }

  setStartModal(display) { document.querySelector("#start").style.display = display; }
  setRestartModal(display) { document.querySelector("#restart").style.display = display; }
  setCurrentScore(display) { document.querySelector("#current-score").style.display = display; }

  newHighScore() {
    this.highScore = this.score;
    document.querySelector("#high-score").innerText = `high score: ${this.highScore}`;
  }
  
  setScore(score = this.score + 10) {
    this.score = score;
    document.querySelectorAll(".score").forEach(score => score.innerText = `SCORE: ${this.score}`);
  }

  movePlayer(e) { if (e.key.slice(0, 5) === "Arrow") this.player.move(e.key); }
  stopPlayer(e) { if (e.key.slice(0, 5) === "Arrow") this.player.stop(e.key); }

  gameOver() {
    window.removeEventListener("keydown", this.movePlayer);
    window.removeEventListener("keyup", this.stopPlayer);

    window.addEventListener("keydown", this.spaceReset)
    this.setRestartModal("block");
    this.setCurrentScore("none");
    this.player.gameOver();
    this.obstacles.forEach(obstacle => obstacle.group.remove());
    this.active = false;

    if(this.highScore < this.score) { this.newHighScore(); };
  }

  spaceReset(e) {
    if(e.key === " ") this.reset(e);
  }

  reset(e) {
    e.preventDefault();
    window.removeEventListener("keydown", this.spaceReset)
    this.init();
  }
}