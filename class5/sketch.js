/*
* 1. Create borders array
* 2. Draw borders
* 3. Draw Squares
* 4. Wire in user interactions on square
* 5. Create function tryToMoveSquare, replace `keyPressed` movements in here
* 6. Create function isCollissionDetected and isBoxInBorder
*/

let square1X = 0;
let square1Y = 0;

let previousSquare1X = null;
let previousSquare1Y = null;

const squareVelocity = 40;

const squareDiameter = 50;
const squareRadius = squareDiameter / 2;

const borders = [
  [100, 100, 100, 400], // Vertical
  [200, 100, 400, 100], // Horizontal
  [200, 200, 400, 200], // Horizontal
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

  const squareLeft = x;
  const squareRight = x + squareDiameter;
  const squareTop = y;
  const squareBottom = y + squareDiameter;

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
  fill(0);
  rect(square1X, square1Y, squareDiameter, squareDiameter);
}


function drawBorders() {
  stroke(0);
  for (let i = 0; i < borders.length; i += 1) {
    const [
      x1, y1, x2, y2
    ] = borders[i];

    line(x1, y1, x2, y2);
  }
}


function draw() {
  background(204);
  // ellipse(50, 50, 80, 80);
  drawBorders();

  drawCharacterSquare();
}