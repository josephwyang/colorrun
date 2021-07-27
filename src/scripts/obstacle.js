export default class Obstacle {
  constructor() {
    this.radius = 100;
    this.draw();
  }

  draw() {
    this.ring = new Path.Arc({
      from: [400, 400],
      through: [400, 600],
      to: [300, 500],
      strokeColor: "red"
    });
    this.ring.onFrame = e => {
      this.ring.rotate(1);
    }
  }
}