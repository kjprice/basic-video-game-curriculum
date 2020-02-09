/*
* Create a canvas with dimensions 500X500
* 1. Create a pac man as we did in the previous - Allow him to move up and down and have his mouth open and close - set his velocity to 40, his diameter to 50, and starting position at x=30, y=30
* 2. As he moves, perform collission detection against the walls of the canvas, so that Pac Man cannot leave the screen
* 3. Create the borders
* 4. Add dots 
*/

let square1X = 30;
let square1Y = 30;

let previousSquare1X = null;
let previousSquare1Y = null;

const squareVelocity = 25;

const squareDiameter = 50;
const squareRadius = squareDiameter / 2;

const dots = [
  // Dot row 1
  [100, 100],
  [193, 100],
  [286, 100],
  [379, 100],

  // Dot row 2
  [100, 185],
  [193, 185],
  [286, 185],
  [379, 185],

  // Dot row 3
  [100, 270],
  [193, 270],
  [286, 270],
  [379, 270],

  // Dot row 4
  [100, 355],
  [193, 355],
  [286, 355],
  [379, 355],
];

dotsEaten = 2;

// Left border = 60
// Right border = 60
// Space in between each border = 85
const borders = [
  [65, 60, 65, 400], // Vertical Left
  [140, 60, 340, 60], // Horizontal 1
  [140, 145, 340, 145], // Horizontal 2 
  [140, 230, 340, 230], // Horizontal 3
  [140, 315, 340, 315], // Horizontal 4
  [65, 400, 420, 400], // Horizontal 4
  [420, 60, 420, 400], // Vertical Right
];

function tryToMoveSquare(directionX, directionY) {
  let newSquareX;
  let newSquareY;
  if (directionX) {
    newSquareX = square1X + directionX * squareVelocity;
  } else {
    newSquareY = square1Y + directionY * squareVelocity;
  }

  if (isCollissionDetected(newSquareX, newSquareY)) {
    return;
  }

  if (newSquareX) {
    square1X = newSquareX;
  }
  if (newSquareY) {
    square1Y = newSquareY;
  }
}

function keyPressed(event) {
  const key = event.key;
  if (key === 'ArrowUp') {
    tryToMoveSquare(null, -1);
  } else if (key === 'ArrowDown') {
    tryToMoveSquare(null, 1);
  } else if (key === 'ArrowLeft') {
    tryToMoveSquare(-1, null);
  } else if (key === 'ArrowRight') {
    tryToMoveSquare(1, null);
  }

  return false;
}

function isBoxInBorder(squareLeft, squareRight, squareTop, squareBottom, border) {
  const [
    x1, y1, x2, y2
  ] = border;

  if (y1 === y2) {
    // This is a horizontal bar
    // If the upper box points are above the line and the lower box points below the line
    const isBoxVerticallyInBorder = squareTop <= y1 && squareBottom >= y2;

    if (!isBoxVerticallyInBorder) {
      return false; // No way that the box is in the border
    }

    // If the border points fall within the square
    const isBoxHorizontallyInBorder = squareRight >= x1 && squareLeft <= x2;
    if (isBoxHorizontallyInBorder) {
      return true;
    }
  }

  else if (x1 === x2) {
    // This is a vertical bar
    // If the upper box points are above the line and the lower box points below the line
    const isBoxVerticallyInBorder = squareTop <= y2 && squareBottom >= y1;

    if (!isBoxVerticallyInBorder) {
      return false; // No way that the box is in the border
    }

    // If the border points fall within the square
    const isBoxHorizontallyInBorder = squareRight >= x1 && squareLeft <= x2;
    if (isBoxHorizontallyInBorder) {
      return true;
    }
  }

  return false;

}

function isCollissionDetected(newSquareX, newSquareY) {
  const xPoints = []

  let x = square1X;
  if (newSquareX !== undefined) {
    x = newSquareX;
  }

  let y = square1Y;
  if (newSquareY !== undefined) {
    y = newSquareY;
  }

  const squareLeft = x - squareRadius;
  const squareRight = x + squareRadius;
  const squareTop = y - squareRadius;
  const squareBottom = y + squareRadius;

  let isAnyBoxBorderCollission = false;

  for (let i = 0; i < borders.length; i++) {
    const border = borders[i];
    if (isBoxInBorder(squareLeft, squareRight, squareTop, squareBottom, border)) {
      isAnyBoxBorderCollission = true;
      break;
    }
  }

  return isAnyBoxBorderCollission;
}

function setup() {
  // put setup code here
  createCanvas(480, 500);
}


function drawCharacterSquare() {
  noStroke();
  fill(255, 255, 0);
  arc(square1X, square1Y, squareDiameter, squareDiameter, QUARTER_PI, -QUARTER_PI);
//  rect(square1X, square1Y, squareDiameter, squareDiameter);
}


function drawBorders() {
  stroke(255);
  for (let i = 0; i < borders.length; i += 1) {
    const [
      x1, y1, x2, y2
    ] = borders[i];

    line(x1, y1, x2, y2);
  }
}

function drawDots() {
  fill(255);
  noStroke();
  dots.forEach((dot) => {
    const [x,y] = dot;
    ellipse(x, y, 5, 5);
  });
}

function drawDotsEaten() {
  fill(0, 255,0);
  noStroke();
  for (let i = 0; i < dotsEaten; i++) {
    ellipse(10*i + 20, height - 45, 5, 5)
  }
}


function draw() {
  background(120);
  // ellipse(50, 50, 80, 80);
  drawBorders();

  drawCharacterSquare();
  drawDots();
  drawDotsEaten();
}