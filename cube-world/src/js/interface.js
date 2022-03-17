let canvasEle = document.getElementById('interface');
canvasEle.width = window.innerWidth;
canvasEle.height = window.innerHeight;
let ctx = canvasEle.getContext('2d');

class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.xDistance = Math.random() * 2 > 1 ? Math.random() : -Math.random();
    this.yDistance = Math.random() * 3 > 1 ? Math.random() * 2 : -Math.random() * 2;
  }
  // 绘制
  draw() {
    ctx.beginPath();
    if (this.x < this.radius) {
      this.x = this.radius;
    }
    if (this.x > canvasEle.width - this.radius) {
      this.x = canvasEle.width - this.radius
    }
    if (this.y < this.radius) {
      this.y = this.radius;
    }
    if (this.y > canvasEle.height - this.radius) {
      this.y = canvasEle.height - this.radius
    }
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, .5)';
    ctx.fill();
  }
  // 更新位置
  update() {
    this.x += this.xDistance;
    this.y += this.yDistance;
    if ((this.x > canvasEle.width - this.radius) || (this.x < this.radius)) {
      this.xDistance = -this.xDistance;
    }
    if ((this.y > canvasEle.height - this.radius) || (this.y < this.radius)) {
      this.yDistance = -this.yDistance;
    }
  }
}
let sequence = [];
let number = 100;
function init() {
  for (let n = 0; n < number; n++) {
    let radius = Math.random() * 4 + 1;
    let x = Math.random() * (canvasEle.width - radius * 2);
    let y = Math.random() * (canvasEle.height - radius * 2);
    let circle = new Circle(x, y, radius);
    sequence.push(circle);
  }
}

function animation() {
  ctx.clearRect(0, 0, canvasEle.width, canvasEle.height);
  for (let i = 0; i < sequence.length; i++) {
    sequence[i].draw();
    sequence[i].update();
  }
  connect();
  window.requestAnimationFrame(animation);
}

function connect() {
  for (let i = 0; i < sequence.length; i++) {
    for (let j = i + 1; j < sequence.length; j++) {
      let distance = Math.sqrt(((sequence[i].x - sequence[j].x) * (sequence[i].x - sequence[j].x) + (sequence[i].y - sequence[j].y) * (sequence[i].y - sequence[j].y)));
      if (distance < 100) {
        ctx.strokeStyle = 'rgba(140, 85, 31, .5)';
        ctx.beginPath();
        ctx.moveTo(sequence[i].x, sequence[i].y);
        ctx.lineTo(sequence[j].x, sequence[j].y);
        ctx.stroke();
      }
    }
  }
}

export {
  init,
  animation
}
