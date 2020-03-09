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

  constructor (width, height, coords) {
    this.coords = coords;

    this.paddingVertical = height / 6;
    this.paddingHorizontal = width / 6;

    this.setOrientation(coords);
    this.setWidth(width);
    this.setHeight(height);

    this.setCoordintes(coords);
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

  draw() {
    // TODO: Add padding to make path wider than the character
    // const [ x1, y1, x2, y2 ] = this.coords;
    fill('white');
    noStroke();
    rect(this.x1, this.y1, this.width, this.height)
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

  tryToSwitchPaths() {
    let newX = this.x;
    let newY = this.y;

    switch (characterMoveNewDirection) {
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
      return;
    }

    this.currentPath = connectedPath;
    characterMoveDirection = characterMoveNewDirection;
    characterMoveNewDirection = null;
  }

  move() {
    throw new Error('Cannot call Character.move method directly');
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
    let newX = this.x;
    let newY = this.y;

    
    if (this.currentPath.isHorizontal && (characterMoveNewDirection == 'up' || characterMoveNewDirection == 'down')) {
      this.tryToSwitchPaths();
    } else if (this.currentPath.isVertical && (characterMoveNewDirection == 'left' || characterMoveNewDirection == 'right')) {
      this.tryToSwitchPaths();
    }

    switch (characterMoveDirection) {
      // TODO: Add collission detection for the end of the path
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
        return;
    }

    if (this.pathCollissionDetected(newX, newY)) {
      return;
    }

    this.x = newX;
    this.y = newY;
  }
}

class BadGuy extends Character {
  fill = color(0);
  goodGuy = null;
  setGoodGuy(goodGuy){
    this.goodGuy = goodGuy;
  }
  followGoodGuy(){
    const [newX, newY] = followPoint(this.x, this.y, this.goodGuy.x, this.goodGuy.y, this.velocity)

    this.x = newX;
    this.y = newY;
  }
  move(){
    // this.followGoodGuy();
  }
  draw(){
    fill(this.fill)
    ellipse(this.x + (this.width / 2), this.y + (this.height / 2), this.width, this.height)
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

  constructor() {
    this.centerOfChamberX = this.x + (this.width / 2);

    this.connectToNearestPath();
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

  draw() {
    fill('white');
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

    console.log(path);

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

  badGuys[0] = new BadGuy(20, 200, characterWidth, characterHeight, paths[1]);
  // badGuys[1] = new BadGuy(width, 0, width/10, height/10, paths[1]);
  // badGuys[2] = new BadGuy(width, height, width/10, height/10, paths[1]);
  // badGuys[3] = new BadGuy(0, height, width/10, height/10, paths[1]);

  badGuys.forEach((badGuy, i) => {
    badGuy.setGoodGuy(pacMan);
  });

}

function draw() {
  background(150);

  paths.forEach((path, i) => {
    path.draw();
  });

  chamber.draw();

  pacMan.draw();
  pacMan.move();

  badGuys.forEach((badGuy, i) => {
    badGuy.move();
    badGuy.draw();
  });
}
