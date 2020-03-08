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
      this.width = padding + x2 - x1;
    } else {
      this.width = padding + width;
    }
  }

  setHeight(height) {
    const [ x1, y1, x2, y2 ] = this.coords;
    const padding = this.paddingVertical * 2;
    if (this.isVertical) {
      this.height = padding + y2 - y1;
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
}

class Character {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  fill = color('red');
  velocity = 3;
  currentPath = null;

  constructor(x, y, width, height, path){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.currentPath = path;
  }

  draw(){
    fill(this.fill)
    ellipse(this.x + (this.width / 2), this.y + (this.height / 2), this.width, this.height)
  }

  move(){
    if (characterMoveDirection === null) {
      return;
    }

    if (this.currentPath.isHorizontal && (characterMoveDirection == 'up' || characterMoveDirection == 'down')) {
      // TODO: See if we can change to a different path
    } else if (this.currentPath.isVertical && (characterMoveDirection == 'left' || characterMoveDirection == 'right')) {
      // TODO: See if we can change to a different path
    } else {
      switch (characterMoveDirection) {
        // TODO: Add collission detection for the end of the path
        case 'up':
          break;
        case 'down':
          break;
        case 'left':
          this.x -= this.velocity;
          break;
        case 'right':
          this.x += this.velocity;
          break;
        default:
          return;
      }
    }
    // this.x = mouseX;
    // this.y = mouseY;
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
}

let goodGuy;
let badGuys = [];
const paths = [];

let characterHeight = 0;
let characterWidth = 0;

let characterMoveDirection = null;
let characterMoveNewDirection = null;


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

function setup() {
  createCanvas(500, 500);

  characterWidth = width / 20;
  characterHeight = height / 20;

  paths[0] = new Path(characterWidth, characterHeight, [20, 20, 400, 20]);
  paths[1] = new Path(characterWidth, characterHeight, [20, 20, 20, 400]);
  paths[2] = new Path(characterWidth, characterHeight, [400, 20, 400, 400]);

  paths[0].addConnection(paths[1]);
  paths[1].addConnection(paths[0]);
  paths[0].addConnection(paths[2]);

  goodGuy = new Character(200, 20, characterWidth, characterHeight, paths[0]);

  badGuys[0] = new BadGuy(20, 200, characterWidth, characterHeight, paths[1]);
  // badGuys[1] = new BadGuy(width, 0, width/10, height/10, paths[1]);
  // badGuys[2] = new BadGuy(width, height, width/10, height/10, paths[1]);
  // badGuys[3] = new BadGuy(0, height, width/10, height/10, paths[1]);

  badGuys.forEach((badGuy, i) => {
    badGuy.setGoodGuy(goodGuy);
  });

}

function draw() {
  background(150);

  paths.forEach((path, i) => {
    path.draw();
  });

  goodGuy.draw();
  goodGuy.move();

  badGuys.forEach((badGuy, i) => {
    badGuy.move();
    badGuy.draw();
  });
}
