/*
* create two circles
* Have one circle move on mouseKey events
* When circles collide, change the color of the first
* opacity
* stroke
*/ 

let circle1X = 50;
let circle1Y = 50;

const circle2X = 150;
const circle2Y = 150;

const circleVelocity = 10;

const circleDiameter = 100;
const circleRadius = circleDiameter / 2;

function setup() {
  // put setup code here
  createCanvas(480, 500);
}

function isCollissionDetected() {
  const distance = dist(circle1X, circle1Y, circle2X, circle2Y);

  const collissionDistance = circleRadius * 2;

  if (distance < collissionDistance) {
    return true;
  }

  return false;
}

function keyPressed(event) {
  const key = event.key;
  if (key === 'ArrowUp') {
    circle1Y -= circleVelocity;
  } else if (key === 'ArrowDown') {
    circle1Y += circleVelocity;
  } else if (key === 'ArrowLeft') {
    circle1X -= circleVelocity;
  } else if (key === 'ArrowRight') {
    circle1X += circleVelocity;
  }

  return false;
}

function drawFirstCircle() {
  noStroke();
  if (isCollissionDetected()) {
    fill(255, 0, 0, 50);
  } else {
    fill(0);
  }
  ellipse(circle1X, circle1Y, circleDiameter, circleDiameter);
}

function drawSecondCircle() {
  stroke(150);
  fill(255);
  ellipse(circle2X, circle2Y, circleDiameter, circleDiameter);
}

function draw() {
  background(204);
  drawSecondCircle();
  drawFirstCircle();
}