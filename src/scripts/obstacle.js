export default class Obstacle {
  constructor() {
    this.strokeColor = "red"
    this.initialX = view.bounds.width + 200;
    this.height = view.bounds.height;
    this.speed = 6;

    this[`draw${Math.floor(Math.random()*4)}`]();
    // this.draw2();
  }
  
  move() {
    if(this.group.position.x < -view.bounds.width) this.group.remove();
    else { this.group.position.x -= this.speed }
  }
  
  // arcs
  draw0() {
    const numPaths = 4;
    const rotationSpeed = this.speed;
    const currentX = dx => this.initialX - (dx * this.speed);

    const group = [];
    for(let i = 0; i < numPaths; i++) {
      group.push(new Path.Arc({
        from: [this.initialX, (this.height * i)/numPaths],
        through: [this.initialX, (this.height * (i + 1))/numPaths],
        to: [this.initialX + (this.height/(numPaths * 2)), (this.height * (2 * i + 1))/(numPaths * 2)],
        strokeColor: this.strokeColor,
      }));
      group[i].rotate(90* i);
      group[i].onFrame = e => group[i].rotate(rotationSpeed, new Point(currentX(e.count) - this.speed, (this.height * (2 * i + 1))/(numPaths * 2)))
    };

    this.group = new Group(group);
  }

  // lines
  draw1() {
    const numPaths = 3;
    const rotationSpeed = this.speed * 1.5;

    const group = [];
    for(let i = 0; i < numPaths; i++) {
      group.push(new Path.Line({
        from: [this.initialX, this.height * i / numPaths],
        to: [this.initialX, this.height * (i + 1) / numPaths],
        strokeColor: this.strokeColor
      }));
      group[i].rotate(90* i);
      group[i].onFrame = () => group[i].rotate(rotationSpeed);
    }

    this.group = new Group(group);
  }

  // windmill
  draw2() {
    const numPaths = 8;
    const bladeWidth = 75;
    const rotationSpeed = this.speed/6;

    const group = [];
    for(let i = 0; i < numPaths; i++) {
      const blade = new Path();
      blade.add(new Point(this.initialX + this.height/2 - bladeWidth, 0));
      blade.add(new Point(this.initialX + this.height/2 + bladeWidth, 0));
      blade.add(new Point(this.initialX + this.height/2, this.height/2));
      blade.closed = true;
      blade.strokeColor = this.strokeColor;
      blade.rotate((360/numPaths) * i, new Point(this.initialX + this.height/2, this.height/2));
      group.push(blade)
    }

    this.group = new Group(group);
    this.group.onFrame = () => this.group.rotate(rotationSpeed);
  }

  // stars
  draw3() {
    const numPaths = 2;
    const rotationSpeed = this.speed/2;
    const currentX = dx => this.initialX - (dx * this.speed);

    const group = [];
    for(let i = 0; i < numPaths; i++) {
      group.push(new Path.Star(new Point(this.initialX, (this.height * (2 * i + 1))/(numPaths * 2)), 5, this.height/(numPaths * 2)/2, this.height/(numPaths * 2)));
      group[i].strokeColor = this.strokeColor;
      group[i].rotate(36 * i);
      group[i].onFrame = e => group[i].rotate(rotationSpeed, new Point(currentX(e.count), (this.height * (2 * i + 1))/(numPaths * 2)));
    }

    this.group = new Group(group);
  }
}