let goodGuyX = 90;
let goodGuyY = 90;

let badGuyX = 10;
let badGuyY = 10;

const SPEED = 5;
let hasMoved = false;

function setup() {
  createCanvas(480, 500);
}

function mouseMoved() {
  hasMoved = true;
}

function followPoint(startingX, startingY, endingX, endingY, velocity) {
  const deltaY = endingY - startingY;
  const deltaX = endingX - startingX

  const angle = atan2(deltaY, deltaX);

  const distanceBetween = dist(startingX, startingY, endingX, endingY);

  let totalDistanceToTravel = distanceBetween; // The Hypoteneuse
  if (totalDistanceToTravel > velocity) {
    totalDistanceToTravel = velocity;
  }

  const distanceToTravelX = cos(angle) * totalDistanceToTravel;
  const distanceToTravelY = sin(angle) * totalDistanceToTravel;

  const newX = startingX + distanceToTravelX;
  const newY = startingY + distanceToTravelY;

  return [newX, newY];
}

function calculateBadGuyPosition() {

  const [newX, newY] = followPoint(badGuyX, badGuyY, goodGuyX, goodGuyY, SPEED);
  
  // if (!checkColissionDetection()) {
  badGuyX = newX;
  badGuyY = newY;
  // }
}

function drawGoodGuy() {
  fill(0, 0, 255);
  if (hasMoved) {
    goodGuyX = mouseX;
    goodGuyY = mouseY;  
  }
  ellipse(goodGuyX, goodGuyY, 10, 10);
}

function drawBadGuy() {
  calculateBadGuyPosition();
  fill(255, 0, 0);
  ellipse(badGuyX, badGuyY, 10, 10);
}

function draw() {
  background(204);
  drawGoodGuy();
  drawBadGuy();
}