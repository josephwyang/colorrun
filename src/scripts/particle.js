export default class Particle {
  constructor(pos, color, large=false) {
    this.pos = pos;
    this.color = color;
    this.large = large;
    this.dx = (Math.random() - 0.5) * 10;
    this.dy = (Math.random() - 0.5) * 10;

    this.draw();
  }

  draw() {
    const{x, y} = this.pos;
    let size;
    this.large ? size = 8 : size = 5;
    this.particle = new Path();
    this.particle.add(this.pos);
    this.particle.add(new Point(x + ((Math.random() - 0.5) * 12) + size, y));
    this.particle.add(new Point(x, y + ((Math.random() - 0.5) * 12) + size));
    this.particle.fillColor = this.color;
    this.particle.onFrame = e => {
      if (this.particle.fillColor.alpha <= 0) this.particle.remove();
      this.particle.fillColor.alpha -= 0.017;
      this.particle.position.x += this.dx;
      this.particle.position.y += this.dy;
      this.particle.rotate(20);
    }
  }
}