export default class Obstacle {
  constructor() {
    this.strokeColor = "red"
    this.initialX = view.bounds.width + 200;
    this.height = view.bounds.height;
    this.speed = 6;

    this[`draw${Math.floor(Math.random()*2)}`]();
  }
  
  move() {
    if(this.group.position.x < -view.bounds.width) this.group.remove();
    else { this.group.position.x -= this.speed }
  }

  stop() {
    this.group.remove();
    this.group.children.forEach(child => child.onFrame = undefined);
  }
  
  draw0() {
    const currentX = dx => this.initialX - (dx * this.speed);
    const rotationSpeed = this.speed;

    const path1 = new Path.Arc({
      from: [this.initialX, 0],
      through: [this.initialX, this.height/4],
      to: [this.initialX + this.height/8, this.height/8],
      strokeColor: this.strokeColor
    });
    path1.onFrame = e => { path1.rotate(rotationSpeed, new Point(currentX(e.count) - this.speed, this.height/8)) };

    const path2 = new Path.Arc({
      from: [this.initialX + this.height/8, 3*this.height/8],
      through: [this.initialX, this.height/4],
      to: [this.initialX, this.height/2],
      strokeColor: this.strokeColor
    });
    path2.onFrame = e => path2.rotate(rotationSpeed, new Point(currentX(e.count) - this.speed, 3*this.height/8));

    const path3 = new Path.Arc({
      from: [this.initialX, 3*this.height/4],
      through: [this.initialX, this.height/2],
      to: [this.initialX - this.height/8, 5*this.height/8],
      strokeColor: this.strokeColor
    });
    path3.onFrame = e => path3.rotate(rotationSpeed, new Point(currentX(e.count) - this.speed, 5*this.height/8));

    const path4 = new Path.Arc({
      from: [this.initialX - this.height/8, 7*this.height/8],
      through: [this.initialX, this.height],
      to: [this.initialX, 3*this.height/4],
      strokeColor: this.strokeColor
    });
    path4.onFrame = e => path4.rotate(rotationSpeed, new Point(currentX(e.count) - this.speed, 7*this.height/8));

    this.group = new Group([path1, path2, path3, path4]);
  }

  draw1() {
    const rotationSpeed = this.speed * 1.5;

    const path1 = new Path.Line({
      from: [this.initialX, 0],
      to: [this.initialX, this.height/3],
      strokeColor: this.strokeColor
    });
    path1.onFrame = () => path1.rotate(rotationSpeed);

    const path2 = new Path.Line({
      from: [this.initialX, this.height/3],
      to: [this.initialX, 2*this.height/3],
      strokeColor: this.strokeColor
    });
    path2.onFrame = () => path2.rotate(-rotationSpeed);

    const path3 = new Path.Line({
      from: [this.initialX, 2*this.height/3],
      to: [this.initialX, this.height],
      strokeColor: this.strokeColor
    })
    path3.onFrame = () => path3.rotate(rotationSpeed);

    this.group = new Group([path1, path2, path3]);
  }

  draw2() {
    this.group = new Path.Star(new Point(400, 400), 5, 80, 150);
    this.group.strokeColor = this.strokeColor;
    this.group.splitAt(0);
    this.group.removeSegments(0,2);
    this.group.onFrame = e => {
      this.group.rotate(1);
    }
  }
}