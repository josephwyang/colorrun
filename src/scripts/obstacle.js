import Powerup from "./powerup";
import Particle from "./particle";
import Score from "./score";

export default class Obstacle {
  constructor(speed) {
    this.color = "white";
    this.initialX = view.bounds.width + 200;
    this.height = view.bounds.height;
    this.speed = speed;
    this.strokeWidth = 2;

    const types = ["arcs", "arcs", "lines", "windmill", "stars"];
    this.type = types[Math.floor(Math.random() * types.length)];
    this[`draw${this.type.slice(0,1).toUpperCase() + this.type.slice(1)}`]();

    if (Math.random() < 0.5) {
      this.powerup = new Powerup(this.randomPos(), this.color);
      this.group.addChild(this.powerup.piece);
      if (this.powerup.pieceText) this.group.addChild(this.powerup.pieceText);
    }

    this.score = new Score(this.group.bounds.x + this.group.bounds.width, this.speed);
  }

  randomColor() {
    const colors = [
      "#bd7b7b", // rust
      "#b88689", // taupe
      "#b5a186", // dune
      "#dbb37d", // apricot
      "#d0ba77", // honey
      "#feffa5", // banana-milk
      "#d0d1a7", // sandstone
      "#99a89b", // sage
      "#629474", // jade
      "#72809c", // pigeon
      "#9199a8", // bluesmoke
      "#bcc0c9", // poppy
      "#b6b5c7", // lilac
      "#8c78a7"  // grape
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  randomSpeed(speed, negs=false) { return speed * (Math.random() * 0.6 + 0.7) * (negs && Math.random() < 0.5 ? -1 : 1) }
  
  move() {
    if(this.group.position.x < -view.bounds.width) this.group.remove();
    else { this.group.position.x -= this.speed }
  }

  shatter() {
    const {x, y, width, height} = this.bounds;
    for(let i = 0; i < 25; i++) {
      new Particle(new Point(
        (Math.random() * width) + x,
        (Math.random() * height) + y
      ), this.strokeColor, true)
    };
    this.remove();
  }

  drawArcs() {
    const numPaths = 4;
    const rotationSpeeds = Array.from({ length: numPaths }, this.randomSpeed.bind(this, this.speed * 2 / 3, true));
    const currentX = dx => this.initialX - (dx * this.speed);

    const group = [];
    for(let i = 0; i < numPaths; i++) {
      const arc = new Path.Arc({
        from: [this.initialX, (this.height * i)/numPaths],
        through: [this.initialX, (this.height * (i + 1))/numPaths],
        to: [this.initialX + (this.height/(numPaths * 2)), (this.height * (2 * i + 1))/(numPaths * 2)],
        strokeColor: this.randomColor(),
      });
      arc.strokeWidth = this.strokeWidth;
      arc.rotate(90* i);
      arc.shatter = this.shatter;
      arc.onFrame = e => arc.rotate(rotationSpeeds[i], new Point(currentX(e.count) - this.speed, (this.height * (2 * i + 1))/(numPaths * 2)));
      group.push(arc);
    };

    this.group = new Group(group);
    this.randomPos = () => new Point(this.initialX, (this.height * (2 * Math.floor(Math.random() * numPaths) + 1))/(numPaths * 2));
  }

  drawLines() {
    const numPaths = 3;
    const rotationSpeeds = Array.from({ length: numPaths }, this.randomSpeed.bind(this, this.speed * 1.4, true));

    const group = [];
    for(let i = 0; i < numPaths; i++) {
      group.push(new Path.Line({
        from: [this.initialX, this.height * i / numPaths],
        to: [this.initialX, this.height * (i + 1) / numPaths],
        strokeColor: this.randomColor()
      }));
      group[i].strokeWidth = this.strokeWidth;
      group[i].rotate(90* i);
      group[i].shatter = this.shatter;
      group[i].onFrame = () => group[i].rotate(rotationSpeeds[i]);
    }

    this.group = new Group(group);
    this.randomPos = () => new Point(this.initialX, this.height/3 * (Math.random() < 0.5 ? 1 : 2));
  }

  drawWindmill() {
    const numPaths = 8;
    const bladeWidth = this.height/8;
    const bladeOffset = this.height/2 - Math.sqrt(this.height * this.height * 15 / 64) + 1;
    this.rotationSpeed = this.randomSpeed(this.speed/5.5) * Math.random() < 0.5 ? -1 : 1;

    const group = [];
    for(let i = 0; i < numPaths; i++) {
      const blade = new Path();
      blade.add(new Point(this.initialX + this.height/2 - bladeWidth, bladeOffset));
      blade.add(new Point(this.initialX + this.height/2 + bladeWidth, bladeOffset));
      blade.add(new Point(this.initialX + this.height/2, this.height/2));
      blade.closed = true;
      blade.strokeColor = this.randomColor();
      blade.strokeWidth = this.strokeWidth;
      blade.rotate((360/numPaths) * i, new Point(this.initialX + this.height/2, this.height/2));
      blade.shatter = this.shatter;
      group.push(blade);
    }
    
    this.group = new Group(group);
    this.group.onFrame = () => this.group.rotate(this.rotationSpeed);
    this.randomPos = () => new Point(this.initialX + this.height/2, 20).rotate((180/numPaths) * (2 * Math.floor(Math.random() * numPaths) + 1), new Point(this.initialX + this.height/2, this.height/2));
  }

  drawStars() {
    const numPaths = 2;
    const rotationSpeeds = Array.from({ length: numPaths }, this.randomSpeed.bind(this, this.speed / 2 * (Math.random() < 5 ?  -1 : 1)));
    const currentX = dx => this.initialX - (dx * this.speed);

    const group = [];
    for(let i = 0; i < numPaths; i++) {
      group.push(new Path.Star(new Point(this.initialX, (this.height * (2 * i + 1))/(numPaths * 2)), 5, this.height/(numPaths * 2)/2, this.height/(numPaths * 2)));
      group[i].strokeColor = this.randomColor();
      group[i].strokeWidth = this.strokeWidth;
      group[i].rotate(36 * i);
      group[i].shatter = this.shatter;
      group[i].onFrame = e => group[i].rotate(rotationSpeeds[i], new Point(currentX(e.count), (this.height * (2 * i + 1))/(numPaths * 2)));
    }

    this.group = new Group(group);
    this.randomPos = () => new Point(this.initialX, this.height/2);
  }
}