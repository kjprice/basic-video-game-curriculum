/*
** create folder called "class2", "examples", copy contents of "empty-example" in "examples"
** mouseX, mouseY
** mouseX, mouseY - Inverse
** color on mouseIsPressed
** object detection - when hitting edge, don't let the coordinates continue
** use keyboard events to drive car
** Homework: Create a box that goes from the top of the canvas to the bottom and then back again, etc - all components should be in its own function
** - Create a folder called "class2/homework", copy the contents of "empty-example" in "class2/homework"
** Create solution within "class2/homework/sketch.js"
*/

let carX = 0;
let carY = 0;
const carHeight = 20;
const carWidth = 20;

function setup() {
  // put setup code here
  createCanvas(500, 500);
}

function keyPressed(event) {
  const key = event.key;
  const carSpeed = 10;
  if (key === 'ArrowUp') {
    carY -= carSpeed;
  } else if (key === 'ArrowDown') {
    carY += carSpeed;
  } else if (key === 'ArrowLeft') {
    carX -= carSpeed;
  } else if (key === 'ArrowRight') {
    carX += carSpeed;
  }

  return false;
}

function drawMainCircle(x, y, diameter) {
  let c = color(255);

  if (mouseIsPressed) {
    c = color(255, 0, 0);
  }
  fill(c);
  ellipse(x, y, diameter);
}

function drawInverseCircle(x, y, diameter) {
  const reverseX = width - x;
  const reverseY = height - y;
  fill (0, 0, 255);
  ellipse(reverseX, reverseY, diameter);
}

function drawCar() {
  fill(0)
  rect(carX, carY, carWidth, carHeight);
}

function draw() {
  background(204);
  line(0, height/2, width, height/2)


  const diameter = 50;
  const radius = diameter / 2;

  let x = mouseX;
  if (x - radius < 0) {
    x = 0 + radius;
  } else if (x + radius > width) {
    x = width - radius;
  }
  
  let y = mouseY;
  if (y - radius < 0) {
    y = 0 + radius;
  } else if (y + radius > height) {
    y = height - radius;
  }
  

  drawMainCircle(x, y, diameter);
  drawInverseCircle(x, y, diameter)
  drawCar();
}