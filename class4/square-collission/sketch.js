/*
* create two squares
* Have one square move on mouseKey events
* When squares collide, change the color of the first
*/ 

let square1X = 50;
let square1Y = 50;

let square2X = 150;
let square2Y = 150;

const squareVelocity = 10;

const squareWidth = 100;
const squareRadius = squareWidth / 2;

function setup() {
  // put setup code here
  createCanvas(480, 500);
}

function isCollissionDetected() {
  const square1Points = [
    [square1X - squareRadius, square1Y - squareRadius], // top left
    [square1X + squareRadius, square1Y - squareRadius], // top right
    [square1X + squareRadius, square1Y + squareRadius], // bottom right
    [square1X - squareRadius, square1Y + squareRadius], // bottom left
  ];

  for (let i = 0; i < square1Points.length; i++) {
    const point = square1Points[i];
    const xPoint = point[0];
    const yPoint = point[1];

    const boundaryTop = square2Y - squareRadius;
    const boundaryBottom = square2Y + squareRadius;
    const boundaryLeft = square2X - squareRadius;
    const boundaryRight = square2X + squareRadius;
    if (xPoint < boundaryRight && xPoint > boundaryLeft) {
      if (yPoint < boundaryBottom && yPoint > boundaryTop) {
        return true;
      }
    }
  }

  return false;
  const distance = dist(square1X, square1Y, square2X, square2Y);

  const collissionDistance = squareRadius * 2;

  if (distance < collissionDistance) {
    return true;
  }

  return false;
}

function keyPressed(event) {
  const key = event.key;
  if (key === 'ArrowUp') {
    square1Y -= squareVelocity;
  } else if (key === 'ArrowDown') {
    square1Y += squareVelocity;
  } else if (key === 'ArrowLeft') {
    square1X -= squareVelocity;
  } else if (key === 'ArrowRight') {
    square1X += squareVelocity;
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
  rect(square1X, square1Y, squareWidth, squareWidth);
}

function drawSecondCircle() {
  stroke(150);
  fill(255);
  rect(square2X, square2Y, squareWidth, squareWidth);
}

function draw() {
  background(204);
  drawSecondCircle();
  drawFirstCircle();
}