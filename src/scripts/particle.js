export default class Particle {
  constructor(pos, color) {
    this.pos = pos;
    this.color = color;
    this.dx = (Math.random() - 0.5) * 10;
    this.dy = (Math.random() - 0.5) * 10;

    this.draw();
  }

  draw() {
    const{x, y} = this.pos;
    this.particle = new Path();
    this.particle.add(this.pos);
    this.particle.add(new Point(x + ((Math.random() - 0.5) * 12) + 5, y));
    this.particle.add(new Point(x, y + ((Math.random() - 0.5) * 12) + 5));
    this.particle.fillColor = this.color;
    this.particle.onFrame = e => {
      if (this.particle.fillColor.alpha <= 0) this.particle.onFrame = null;
      this.particle.fillColor.alpha -= 0.017;
      this.particle.position.x += this.dx;
      this.particle.position.y += this.dy;
      this.particle.rotate(20);
    }
  }
}