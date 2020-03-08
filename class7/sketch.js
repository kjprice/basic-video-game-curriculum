
let img;
function preload() {
  img = loadImage('./Dig_Dug.png');
}


function setup() {
  // put setup code here
  createCanvas(480, 500);

}

function draw() {
  background(204);
  // ellipse(50, 50, 80, 80);


  image(img, 100, 100, 50, 50);
  text('Hello world', 10, 30);
  rotate(PI/8)
  translate(50, 0)
  text('Hello world', 10, 30);
}