/*
* TODO:
* - TODO: Set padding (paddingVertical / paddingHorizontal) on the path: set in the constructor - half of user's width
* - Path: Create a function called "getWidth" which returns this.paddingHorizontal + (this.width or x2-x1)
* - Path: Create a function called "getHeight" which returns this.paddingVertical + (this.height or y2-y1)
* - Path: Draw path by passing in x1, y1, this.getWidth(), this.getHeight()
* - Create a variable called newDirection - which turns into characterMoveDirection as soon as a path becomes accessible
* - Add collission detection for the end of the path - stops character
* --- need to account for the width of the character and padding?
TODO (BAD GUY)
* - Have bad guy walk around paths aimlessly
* - See about following the character if bad guy sees user
*/


/* TODO: We can't use this here */
function followPoint(startingX, startingY, endingX, endingY, velosity) {
  const deltaY = endingY - startingY;
  const deltaX = endingX - startingX;
  const angle = atan2(deltaY, deltaX);
  const distanceBetween = dist(startingX, startingY, endingX, endingY);

  let totalDistanceToTraval = distanceBetween;
  if(totalDistanceToTraval > velosity) {
    totalDistanceToTraval = velosity;
  }

  const distanceToTravalX = cos(angle) * totalDistanceToTraval;
  const distanceToTravalY = sin(angle) * totalDistanceToTraval;

  const newX = startingX + distanceToTravalX;
  const newY = startingY + distanceToTravalY;

  return [newX, newY];
}
let isPaused = false;
let isOver = false;

class Food {
  isEaten = false;
  x = null;
  y = null;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    if (this.isEaten) {
      return;
    }

    stroke(253,190,190);
    strokeWeight(3);

    point(this.x, this.y);
  }
}

SPACE_BETWEEN_FOOD = 10;

const allFood = [];
let foodPlaced = 0;
function getAlreadyExistingFood(x, y) {
  const food = allFood.filter(foodPoint => foodPoint.x === x && foodPoint.y == y)[0];
  return food;
}

function setNewFood(food) {
  allFood.push(food);
  foodPlaced += 1;
}

let totalFoodConsumed = 0;
class Path {
  coords = null;
  connections = [];
  isVertical = false;
  isHorizontal = false;
  width = null;
  height = null;
  paddingVertical = null;
  paddingHorizontal = null;

  x1 = null;
  y1 = null;
  x2 = null;
  y2 = null;
  food = [];

  constructor (width, height, coords) {
    this.coords = coords;

    this.paddingVertical = height / 6;
    this.paddingHorizontal = width / 6;

    this.setOrientation(coords);
    this.setWidth(width);
    this.setHeight(height);

    this.setCoordintes(coords);
    this.setFood();
  }

  getNewConsumedFood(characterX, characterY) {
    const edibleFood = this.food.filter(foodPoint => !foodPoint.isEaten);
    if (this.isHorizontal) {
      for (let i = 0; i < edibleFood.length; i += 1) {
        const foodPoint = edibleFood[i];
        const { x } = foodPoint;
        if (characterX - (characterWidth /2) < x && x < characterX + (characterWidth /2) ) {
          return foodPoint;
        }
      }
    } else {
      for (let i = 0; i < edibleFood.length; i += 1) {
        const foodPoint = edibleFood[i];
        const { y } = foodPoint;
        if (characterY - (characterHeight /2) < y && y < characterY + (characterHeight /2) ) {
          return foodPoint;
        }
      }
    }
  }

  tryToConsumeFood(characterX, characterY) {
    const foodConsumedRightNow = this.getNewConsumedFood(characterX, characterY);
    if (!foodConsumedRightNow) {
      return;
    }

    foodConsumedRightNow.isEaten = true;
    totalFoodConsumed += 1;
  }

  setFood() {
    const startX = this.x1;
    const startY = this.y1;
    const endX = this.x2;
    const endY = this.y2;

    // const [ startX, startY, endX, endY ] = this.coords;
    let foodCountTotal;
    if (this.isHorizontal) {
      foodCountTotal = (endX - startX) / SPACE_BETWEEN_FOOD;
    } else {
      foodCountTotal = (endY - startY) / SPACE_BETWEEN_FOOD;
    }
    for (let i = 0; i < foodCountTotal; i += 1) {
      let x = startX;
      let y = startY;
      if (this.isHorizontal) {
        x = startX + (i * SPACE_BETWEEN_FOOD);
        x += characterWidth / 2 + this.paddingHorizontal;
        y += this.height / 2;
      } else {
        y = startY + (i * SPACE_BETWEEN_FOOD);
        y += characterHeight / 2 + this.paddingVertical;
        x += this.width / 2;
      }
      
      let food = getAlreadyExistingFood(x, y);
      if (!food) {
        food = new Food(x, y);
        setNewFood(food);
      }
      this.food.push(food);
    }
  }

  setOrientation(coords) {
    const [ x1, y1, x2, y2 ] = coords;

    if (x1 === x2) {
      this.isVertical = true;
    } else if (y1 === y2) {
      this.isHorizontal = true;
    } else {
      throw new Error('Unknown path placement');
    }
  }

  isPointOnPath(x, y) {
    const [x1, y1, x2, y2] = this.coords;
    if (this.isVertical) {
      if (x1 !== x) {
        return false;
      }

      if (y < y1 || y > y2) {
        return false;
      }
    } else {
      if (y1 !== y) {
        return false;
      }

      if (x < x1 || x > x2) {
        return false;
      }
    }

    return true;
  } 

  setCoordintes(coords) {
    const [ x1, y1, x2, y2 ] = coords;

    this.x1 = x1 - this.paddingHorizontal;
    this.y1 = y1 - this.paddingVertical;
    this.x2 = x2 + this.paddingHorizontal;
    this.y2 = y2 + this.paddingVertical;
 }

  setWidth(width) {
    const [ x1, y1, x2, y2 ] = this.coords;
    const padding = this.paddingHorizontal * 2;

    if (this.isHorizontal) {
      this.width = (padding * 4) + x2 - x1;
    } else {
      this.width = padding + width;
    }
  }

  setHeight(height) {
    const [ x1, y1, x2, y2 ] = this.coords;
    const padding = this.paddingVertical * 2;
    if (this.isVertical) {
      this.height = (padding * 4) + y2 - y1;
    } else {
      this.height =  padding + height;
    }
  }

  drawFood() {
    this.food.forEach(foodPoint => {
      foodPoint.draw();
    })
  }

  draw() {
    // TODO: Add padding to make path wider than the character
    // const [ x1, y1, x2, y2 ] = this.coords;
    fill('black');
    noStroke();
    rect(this.x1, this.y1, this.width, this.height);
  }

  addConnection(path) {
    this.connections.push(path);
  }

  pathIntersectWithPath(path) {
    if (this.isVertical && path.isVertical) {
      return false;
    }

    if (this.isHorizontal && path.isHorizontal) {
      return false;
    }

    const [x11, y11, x12, y12] = this.coords;
    const [x21, y21, x22, y22] = path.coords;

    if (this.isVertical) {
     if (x21 > x11) {
       return false;
     } 
     if (x22 < x12) {
       return false;
     }

     if (y21 < y11) {
       return false;
     }

     if (y22 > y12) {
       return false;
     }
    } else { // it is horizontal
      if (x11 > x21) {
        return false;
      }
      if (x12 < x22) {
        return false;
      }

      if (y11 < y21) {
        return false;
      }
      if (y12 > y22) {
        return false;
      }
    }

    return true;
  }
}

function addPathConnection(path1, path2) {
  path1.addConnection(path2);
  path2.addConnection(path1);
}

class Character {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  fill = color('red');
  velocity = 4;
  currentPath = null;

  constructor(x, y, width, height, path){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.currentPath = path;
  }

  draw(){
    throw new Error('Cannot call Character.draw method directly - this should be overwitten');
  }

  getConnectedPathTouchingPoint(x, y) {
    return this.currentPath.connections.filter((path) => path.isPointOnPath(x, y))[0];
  }

  pathCollissionDetected(x, y) {
    const [x1, y1, x2, y2] = this.currentPath.coords;
    if (this.currentPath.isVertical) {
      if (y > y2) {
        return true;
      }

      if (y < y1) {
        return true;
      }
    } else {
      if (x > x2) {
        return true;
      }

      if (x < x1) {
        return true;
      }
    }
    
    return false;
  }

  tryToSwitchPaths(direction) {
    let newX = this.x;
    let newY = this.y;
    switch (direction) {
      case 'up':
        newY -= this.velocity;
        break;
      case 'down':
        newY += this.velocity;
        break;
      case 'left':
        newX -= this.velocity;
        break;
      case 'right':
        newX += this.velocity;
        break;
      default:
        return false;
    }

    const connectedPath = this.getConnectedPathTouchingPoint(newX, newY);

    if (!connectedPath) {
      return false;
    }

    this.currentPath = connectedPath;
    return true;
  }

  tryToSwitchToAnyPath() {
    if (this.currentPath.isHorizontal && this.direction !== 'up') {
      if (this.tryToSwitchPaths('up')) {
        this.direction = 'up';
        return true;
      }
    }
    if (this.currentPath.isHorizontal && this.direction !== 'down') {
      if (this.tryToSwitchPaths('down')) {
        this.direction = 'down';
        return true;
      }
    }
    if (this.currentPath.isVertical && this.direction !== 'left') {
      if (this.tryToSwitchPaths('left')) {
        this.direction = 'left';
        return true;
      }
    }
    if (this.currentPath.isVertical && this.direction !== 'right') {
      if (this.tryToSwitchPaths('right')) {
        this.direction = 'right';
        return true;
      }
    }

    return false;
  }
  
  reverseDirection() {
    switch(this.direction) {
      case 'left':
        this.direction = 'right';
        return;
      case 'right':
        this.direction = 'left';
        return;
      case 'up':
        this.direction = 'down';
        return;
      case 'down':
        this.direction = 'up';
        return;
    }
  }

  tryToMove(direction, switchPathsDirection = 'any') {
    let newX = this.x;
    let newY = this.y;

    
    if (this.currentPath.isHorizontal && (switchPathsDirection == 'up' || switchPathsDirection == 'down')) {
      if (this.tryToSwitchPaths(switchPathsDirection)) {
        characterMoveDirection = characterMoveNewDirection;
        characterMoveNewDirection = null;
        return;
      }
    } else if (this.currentPath.isVertical && (switchPathsDirection == 'left' || switchPathsDirection == 'right')) {
      if (this.tryToSwitchPaths(switchPathsDirection)) {
        characterMoveDirection = characterMoveNewDirection;
        characterMoveNewDirection = null;
        return;
      }
    }

    switch (direction) {
      case 'up':
        newY = this.y - this.velocity;
        break;
      case 'down':
        newY = this.y + this.velocity;
        break;
      case 'left':
        newX = this.x - this.velocity;
        break;
      case 'right':
        newX = this.x + this.velocity;
        break;
      default:
        return false;
    }

    // 20% chance of bad guy changing direction - tends to go up or left
    if (switchPathsDirection === 'any' && random() < .2) {
      if (this.tryToSwitchToAnyPath()) {
        return;
      }
    }

    // .5% chance of bad guy reversing
    if (switchPathsDirection === 'any' && random() < .005) {
      this.reverseDirection();
    }

    if (this.pathCollissionDetected(newX, newY)) {
      if (switchPathsDirection === 'any') {
        if(!this.tryToSwitchToAnyPath()) {
          this.reverseDirection();
        }
      }
      return;
    }

    this.x = newX;
    this.y = newY;

    return true;
  }
}

class PacManCharacter extends Character {
  m = 0
  moutMoveSpeed = .15;
  draw(){
    noStroke();
    fill(255,200,10);
    
    // With help from https://editor.p5js.org/lkkchung/sketches/B1-0PmCqb

    let mouthDirectionAddition;
    switch (characterMoveDirection) {
      // TODO: Add collission detection for the end of the path
      case 'up':
        mouthDirectionAddition = -HALF_PI;
        break;
      case 'down':
        mouthDirectionAddition = HALF_PI;
        break;
      case 'left':
        mouthDirectionAddition = PI;
        break;
      case 'right':
      default:
        mouthDirectionAddition = 0;
    }
    const arcBottom = PI*sin(this.m)/8+PI/8 + mouthDirectionAddition;
    const arcTop = -PI*sin(this.m)/8-PI/8 + mouthDirectionAddition;
    arc(this.x + (this.width / 2), this.y + (this.height / 2),this.width, this.height, arcBottom, arcTop);
    //text((sin(m)*PI/8,20,180);
    this.m = this.m + this.moutMoveSpeed;
  }

  move(){
    if (characterMoveDirection === null) {
      return;
    }

    const didCharacterMove = this.tryToMove(characterMoveDirection, characterMoveNewDirection);

    if (!didCharacterMove) {
      return;
    }
    this.currentPath.tryToConsumeFood(this.x + (this.width / 2), this.y + (this.height / 2));
  }
}

const ghostColors = [
  [255, 0, 0],
  [0, 255, 255],
  [255, 150, 150],
  [255, 200, 0]
]
class Ghost extends Character {
  fill = color(0);
  goodGuy = null;
  isInChamber = false;
  isLeavingChamber = false;
  direction = 'left';
  constructor(width, height, color){
    super(0, 0, width, height, paths[0]);
    this.fill = color;
    const { x, y, path } = this.getPosition();
    this.x = x;
    this.y = y;
    this.width = width * 1.2;
    this.height = height;
    this.currentPath = path;
  }

  getPosition() {
    if (chamber.ghostsWithin.length == 3) {
      // set outside of chamber
      return {
        x: chamber.centerOfChamberX,
        y: chamber.touchingPath.coords[1],
        path: chamber.touchingPath
      };
    }

    this.isInChamber = true;
    this.isLeavingChamber = false;
    return chamber.addGhost(this);
  }

  beginExodus() {
    this.isLeavingChamber = true;
  }

  setGoodGuy(goodGuy){
    this.goodGuy = goodGuy;
  }

  followGoodGuy(){
    const [newX, newY] = followPoint(this.x, this.y, this.goodGuy.x, this.goodGuy.y, this.velocity);

    this.x = newX;
    this.y = newY;
  }

  move() {
    if (this.isInChamber) {
      // TODO
      return;
    }
    this.tryToMove(this.direction);
    // this.followGoodGuy();
  }

  drawEye(x, y) {
    const eyeWidth = this.width / 3;
    const eyeHeight = this.width / 2.5;
    const pupileDiameter = eyeHeight /2;
    // draw eye whites
    fill('white');
    ellipse(x, y, eyeWidth, eyeHeight);

    // draw pupil looking down
    const pupilY = y + (pupileDiameter / 2);
    fill(80, 80, 255);
    ellipse(x, pupilY, pupileDiameter, pupileDiameter)
  }
  drawHead() {
    const circleHeight = this.height / 2;
    const circleX = this.x + (this.width / 2);
    const circleY = this.y + circleHeight;
    fill(this.fill);
    ellipse(circleX, circleY, this.width, this.height);

    const eye1X = circleX - this.width / 4;
    const eye2X = circleX + this.width / 4;
    this.drawEye(eye1X, circleY);
    this.drawEye(eye2X, circleY);
  }
  drawTorso() {
    fill(this.fill);
    rect(this.x, this.y + (this.height/2), this.width, this.height/2);
  }
  drawLegs() {
    const y = this.y + this.height;
    const xStart = this.x;
    const NUMBER_OF_LEGS = 3;
    const xSpaces = NUMBER_OF_LEGS - 1; // Not entirely sure how this works but whatevs.
    const triangleWidth = this.width / NUMBER_OF_LEGS;
    for (let i = 0; i < 3; i ++) {
      const x1 = xStart + (triangleWidth * i);
      const y1 = y;

      const x2 = x1 + (triangleWidth / xSpaces);
      const y2 = y + (this.height / NUMBER_OF_LEGS);

      const x3 = x2 + (triangleWidth / xSpaces);
      const y3 = y;

      fill(this.fill);
      triangle(x1, y1, x2, y2, x3, y3);
    }
  }
  draw(){
    const x = this.x - (width / 2);
    const y = this.y - (height / 2);
    this.drawTorso();
    this.drawHead();
    this.drawLegs();
  }
}


function pauseGame(){
  if(isPaused){
    isPaused = false;
    loop();
  } else {
    isPaused = true;
    noLoop();
  }
}

function keyPressed(e){
  if(e.key == "Escape"){
    pauseGame();
  }

  switch(key) {
    case 'ArrowUp':
      if (characterMoveDirection === 'down') {
        characterMoveDirection = 'up';
      } else {
        characterMoveNewDirection = 'up';
      }
      break;
    case 'ArrowDown':
      if (characterMoveDirection === 'up') {
        characterMoveDirection = 'down';
      } else {
        characterMoveNewDirection = 'down';
      }
      break;
    case 'ArrowLeft':
      if (characterMoveDirection === 'right') {
        characterMoveDirection = 'left';
      } else {
        characterMoveNewDirection = 'left';
      }
      break;
    case 'ArrowRight':
      if (characterMoveDirection === 'left') {
        characterMoveDirection = 'right';
      } else {
        characterMoveNewDirection = 'right';
      }
      break;
  }

  if (characterMoveDirection === null) {
    characterMoveDirection = characterMoveNewDirection;
  }

  return false;
}

const pathCoords = [
  // Top
  [20, 20, 760, 20], //Horizontal
   // Top Left
  [20, 20, 20, 80], // Vertical
  [20, 80, 60, 80], // Horizontal
  // Left 1
  [60, 20, 60, 260], // Vertical
  // Left 2
  [100, 20, 100, 260], // Vertical

  // Left 3
  [100, 80, 240, 80], // Horizontal
  [240, 80, 240, 260], // Vertical

  // Left 4
  [100, 140, 180, 140], // Horizontal
  [180, 140, 180, 260], // Vertical

  // Middle - This is where the chamber will go
  [280, 80, 280, 260], // Vertical
  [280, 80, 500, 80], // Horizontal
  [500, 80, 500, 260], // Vertical
  [280, 200, 500, 200], // Horizontal

  // Middle Top
  [380, 20, 380, 80], // Vertical

  // Right 1
  [560, 20, 560, 260], // Vertical
  [560, 140, 760, 140], // Horizontal

  // Right 2
  [660, 20, 660, 260], // Vertical

  
  // Right
  [760, 20, 760, 260], // Vertical

  // Bottom
  [20, 260, 760, 260], //Horizontal
];

function createPathsAndRelationships() {
  paths = pathCoords.map((patchCoord) => new Path(characterWidth, characterHeight, patchCoord));

  paths.forEach(path => {
    const pathInteresections = paths.filter((otherPath) => otherPath !== path && path.pathIntersectWithPath(otherPath));

    pathInteresections.forEach(otherPath => path.addConnection(otherPath));
    
  });
}

class Chamber {
  x = 340;
  y = 100;
  width = 120;
  height = 60;
  touchingPath = null;
  centerOfChamberX = null;
  ghostsWithin = [];
  rateOfGhostExit = 60 * 5; // approximately 5 seconds
  currentGhostExiting = 0;

  constructor() {
    this.centerOfChamberX = this.x + (this.width / 2);

    this.connectToNearestPath();
  }

  addGhost(ghost) {
    this.ghostsWithin.push(ghost);

    return {
      x: this.x + ((this.width / 4) * this.ghostsWithin.length),
      y: this.y + this.height /2,
      path: this.touchingPath
    }
  }

  drawDoor() {
    // const numberOfDots = 5; // Should be an odd number
    // const spacesBetweenDots = 6;
    // const xStart = this.centerOfChamberX - (spacesBetweenDots * (numberOfDots / 2 - 1))

    const width = 40;
    const xStart = this.centerOfChamberX - (width / 2);

    // draw rectangle to visually create space between chamber and path
    noStroke();
    fill(253,190,190);
    rect(xStart, this.y-2, width, 2);
  }

  tryToBeginGhostExodus() {
    if (frameCount === 0) {
      return;
    }
    if (frameCount % rateOfGhostExit === 0) {
      this.ghostsWithin[this.currentGhostExiting].beginExodus();
    }
  }

  draw() {
    fill('black');
    noStroke();
    rect(this.x, this.y, this.width, this.height);
    this.drawDoor();
  }

  getTouchingPath() {
    // Only can connect to horizontal paths
    const horizontalPaths = paths.filter(path => path.isHorizontal);
    const pathsAboveChamber = horizontalPaths.filter(path => path.coords[1] < this.y);
    const pathTouchingChamber = pathsAboveChamber.reduce((path, closestPath) => {
      let closestY = 0;
      if (closestPath) {
        closestY = closestPath.coords[1];
      }

      if (path.coords[1] < closestY) {
        return closestPath;
      }

      if (path.coords[0] < this.centerOfChamberX && path.coords[2] > this.centerOfChamberX) {
        return path;
      }

      return closestPath;
    });

    return pathTouchingChamber;
  }

  connectToNearestPath() {
    const path = this.getTouchingPath();
    if (!path || !path.coords) {
      throw new Error('Could not find a connecting path for chamber');
    }

    this.touchingPath = path;
  }
}

let pacMan;
let badGuys = [];
let paths;

const characterHeight = 15;
const characterWidth = 15;

let characterMoveDirection = null;
let characterMoveNewDirection = null;
let chamber;

function setup() {
  createCanvas(800, 300);

  createPathsAndRelationships();

  chamber = new Chamber();

  pacMan = new PacManCharacter(200, 20, characterWidth, characterHeight, paths[0]);

  badGuys[0] = new Ghost(characterWidth, characterHeight, ghostColors[0]);


  badGuys[1] = new Ghost(characterWidth, characterHeight, ghostColors[1]);
  badGuys[2] = new Ghost(characterWidth, characterHeight, ghostColors[2]);
  badGuys[3] = new Ghost(characterWidth, characterHeight, ghostColors[3]);

  badGuys.forEach((badGuy, i) => {
    badGuy.setGoodGuy(pacMan);
  });
}

function draw() {
  background(180, 180, 255);

  paths.forEach((path, i) => {
    path.draw();
  });

  paths.forEach((path, i) => {
    path.drawFood();
  });

  chamber.draw();

  pacMan.draw();
  pacMan.move();

  badGuys.forEach((badGuy, i) => {
    badGuy.move();
    badGuy.draw();
  });
}
