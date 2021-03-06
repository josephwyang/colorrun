import Player from "./player";
import Obstacle from "./obstacle";

export default class Game {
  constructor(color) {
    this.color = color;
    this.player = new Player(this.color);
    this.player.piece.remove();
    this.highScore = 0;
    this.instructions = 0;
    
    this.howToPlay = this.howToPlay.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.instructionLeft = this.instructionLeft.bind(this);
    this.instructionRight = this.instructionRight.bind(this);
    this.closeInstructions = this.closeInstructions.bind(this);

    this.movePlayer = this.movePlayer.bind(this);
    this.stopPlayer = this.stopPlayer.bind(this);
    this.easyStart = this.easyStart.bind(this);
    this.hardStart = this.hardStart.bind(this);
    this.changeDifficulty = this.changeDifficulty.bind(this);
    this.reset = this.reset.bind(this);
    this.spaceReset = this.spaceReset.bind(this);

    document.querySelectorAll(".exit-instructions").forEach(x => x.onclick = this.closeInstructions);
    document.querySelectorAll(".modal-screen").forEach(modalScreen => modalScreen.onclick = this.closeInstructions);
    document.querySelectorAll(".left-arrow").forEach(arrow => arrow.onclick = this.instructionLeft);
    document.querySelectorAll(".right-arrow").forEach(arrow => arrow.onclick = this.instructionRight);

    document.querySelector("#how-to-play").onclick = this.howToPlay;
    document.querySelector("#easy-start").onclick = this.easyStart;
    document.querySelector("#hard-start").onclick = this.hardStart;
    document.querySelector("#change-difficulty").onclick = this.changeDifficulty;
    this.restart = document.querySelector("#restart-btn");
    this.restart.onclick = this.reset;
    this.run = document.querySelector("#run");
    this.hard = document.querySelector("#difficulties > button:last-child");
    this.runHue = 0;

    view.onFrame = e => {
      if (this.runHue === 360) this.runHue = 0;
      this.run.style.color = this.hard.style.backgroundColor = this.restart.style.color = `hsl(${this.runHue}, 50%, 70%)`
      this.runHue += 0.7;

      if (this.active) {

        if(e.count % 300 === 0) {
          let newObstacle = new Obstacle(this.speed);
          this.obstacles.push(newObstacle);
          if (newObstacle.type === "windmill" && newObstacle.powerup) {
            if (newObstacle.powerup.type === "timesTwo") {
              newObstacle.powerup.pieceText.onFrame = () => {
                if (newObstacle.powerup.runHue === 360) newObstacle.powerup.runHue = 0;
                newObstacle.powerup.pieceText.fillColor = `hsl(${newObstacle.powerup.runHue}, 50%, 70%)`;
                newObstacle.powerup.runHue += 3;
                newObstacle.powerup.pieceText.rotate(-newObstacle.rotationSpeed, newObstacle.powerup.piece.getPosition());
              };
            } else if (newObstacle.powerup.type === "shrink") {
              newObstacle.powerup.rad = 0;
              newObstacle.powerup.pieceText.onFrame = () => {
                newObstacle.powerup.rad += 0.15;
                const delta = Math.sin(newObstacle.powerup.rad) * 0.2;
                const [leftArrow, rightArrow] = newObstacle.powerup.pieceText.children;
                leftArrow.translate(new Point(-delta, delta));
                rightArrow.translate(new Point(delta, -delta));
                newObstacle.powerup.pieceText.rotate(-newObstacle.rotationSpeed, newObstacle.powerup.piece.getPosition());
              };
            }
          }
        };
        for(const i in this.obstacles) {
          const obstacle = this.obstacles[i];
          obstacle.move();

          if (obstacle.score && obstacle.score.piece.getBounds().x < this.player.piece.getBounds().x) {
            this.setScore();
            if(this.player.timesTwo) this.setScore();
            obstacle.score.piece.remove();
            delete obstacle.score;
          }

          if (obstacle.powerup && obstacle.powerup.piece.getIntersections(this.player.piece).length) {
            this.player.powerup(obstacle.powerup.type);
            obstacle.powerup.piece.remove();
            if (obstacle.powerup.pieceText) obstacle.powerup.pieceText.remove();
            delete obstacle.powerup;
            break;
          }

          for (let child of obstacle.group.children) {
            if(child.className === "Group" || child.className === "PointText") continue;
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

  instructionLeft() {
    if (this.instructions === 4) {
      document.querySelector(`#instructions-${this.instructions--}`).style.display = "none";
      document.querySelector(`#instructions-${this.instructions}`).style.display = "block";
      document.querySelector(`#instructions-${this.instructions} > div video`).autoplay = true;
      document.querySelector(`#instructions-${this.instructions} > div video`).load();
    } else if (this.instructions > 1) {
      document.querySelector(`#instructions-${this.instructions} > div video`).style.autoplay = false;
      document.querySelector(`#instructions-${this.instructions--}`).style.display = "none";
      document.querySelector(`#instructions-${this.instructions}`).style.display = "block";
      document.querySelector(`#instructions-${this.instructions} > div video`).autoplay = true;
      document.querySelector(`#instructions-${this.instructions} > div video`).load();
    }
  }

  instructionRight() {
    if (this.instructions < 3) {
      document.querySelector(`#instructions-${this.instructions} > div video`).style.autoplay = false;
      document.querySelector(`#instructions-${this.instructions++}`).style.display = "none";
      document.querySelector(`#instructions-${this.instructions}`).style.display = "block";
      document.querySelector(`#instructions-${this.instructions} > div video`).autoplay = true;
      document.querySelector(`#instructions-${this.instructions} > div video`).load();
    } else if (this.instructions === 3) {
      document.querySelector(`#instructions-${this.instructions} > div video`).style.autoplay = false;
      document.querySelector(`#instructions-${this.instructions++}`).style.display = "none";
      document.querySelector(`#instructions-${this.instructions}`).style.display = "block";
    }
  }

  closeInstructions() {
    if (this.instructions < 4) document.querySelector(`#instructions-${this.instructions} > div video`).style.autoplay = false;
    document.querySelector(`#instructions-${this.instructions}`).style.display = "none";
    window.removeEventListener("keydown", this.handleKeydown);
  }

  changeDifficulty(e) {
    e.preventDefault();
    this.setRestartModal("none");
    this.setStartModal("block")
  }

  handleKeydown(e) {
    if (e.key === "Escape" || e.key === "Enter" || e.key === "Space") {
      this.closeInstructions();
    } else if (e.key === "ArrowLeft") {
      this.instructionLeft();
    } else if (e.key === "ArrowRight") this.instructionRight();
  }
  
  howToPlay(e) {
    e.preventDefault();
    if (this.active) this.gameOver();
    this.instructions = 1;
    document.querySelector("#instructions-1").style.display = "block";
    document.querySelector("#instructions-1 > div video").autoplay = true;
    document.querySelector("#instructions-1 > div video").load();

    window.addEventListener("keydown", this.handleKeydown);
  }

  easyStart(e) {
    e.preventDefault();
    this.speed = 4;
    this.init();
  }

  hardStart(e) {
    e.preventDefault();
    this.speed = 6;
    this.init();
  }

  setStartModal(display) { document.querySelector("#start").style.display = display; }
  setRestartModal(display) { document.querySelector("#restart").style.display = display; }
  setCurrentScore(display) { document.querySelector("#current-score").style.display = display; }
  
  setScore(score = this.score + 10) {
    this.score = score;
    if(this.highScore < this.score) {
      this.highScore = this.score;
      document.querySelector("#high-score").innerText = `high score: ${this.highScore}`;
    };
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