var x = 0;

function setup() {
  createCanvas(400, 400);
}



function draw() {
  background(100);
  ellipse(x, 120, 16, 16);
  x = x+ 1;
  if (x > width + 10) {
    x = 0;
  }

}
