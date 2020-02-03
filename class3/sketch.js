/*
* TODO:
* - Discuss radians (using arc)
* - Create Shape
* - Use Loop to create circles
*/
function setup() {
  // put setup code here
  createCanvas(480, 500);
}

function draw() {
  background(204);
  // Open Mouth
  arc(100, 100, 50, 50, QUARTER_PI, TWO_PI - QUARTER_PI, PIE);

  // Medium Closed Mouth
  arc(200, 200, 50, 50, QUARTER_PI + QUARTER_PI / 2, TWO_PI - QUARTER_PI / 2, PIE);

  // Closed Mouth
  arc(300, 300, 50, 50, QUARTER_PI + QUARTER_PI / 8, TWO_PI - QUARTER_PI / 8, PIE);


  // stroke
  // noStroke

  const radius = 10;
  for (let i = 0; i < 10; i++) {
    const start = QUARTER_PI + (frameCount / 60);
    const end = TWO_PI - QUARTER_PI + (frameCount / 60);
    const x = i * radius + frameCount;
    const y = i * radius + frameCount;
    
    arc(x, y, radius, radius, start, end, PIE);
  }

}