function drawCircular() {
  push();

  background(0);

  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;
  let clockDiameter = min(windowWidth, windowHeight) * 0.75;
  let radius = clockDiameter / 2;

  // Clock face
  noFill();
  stroke(40);
  strokeWeight(2);
  ellipse(centerX, centerY, clockDiameter, clockDiameter);

  // Hour marks
  push();
  translate(centerX, centerY);
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 12, 0, TWO_PI) - HALF_PI;
    let x = cos(angle) * radius * 0.9;
    let y = sin(angle) * radius * 0.9;
    stroke(70);
    strokeWeight(2);
    point(x, y);
  }
  pop();

  // Clock hands
  push();
  translate(centerX, centerY);

  // Get current time - use p5's built-in time functions for consistent timing
  let h = hour() % 12;
  let m = minute();
  let s = second();

  // For milliseconds, use a synchronized approach based on current seconds
  let now = new Date();
  let ms = now.getMilliseconds();

  // Hour hand
  let hourAngle = map(h + m / 60, 0, 12, 0, TWO_PI) - HALF_PI;
  stroke(hourHue, 80, 100);
  strokeWeight(4);
  line(0, 0, cos(hourAngle) * radius * 0.5, sin(hourAngle) * radius * 0.5);

  // Minute hand
  let minuteAngle = map(m + s / 60, 0, 60, 0, TWO_PI) - HALF_PI;
  stroke(minuteHue, 80, 100);
  strokeWeight(3);
  line(0, 0, cos(minuteAngle) * radius * 0.7, sin(minuteAngle) * radius * 0.7);

  // Second hand
  let secondAngle = map(s, 0, 60, 0, TWO_PI) - HALF_PI;
  stroke(secondHue, 80, 100);
  strokeWeight(2);
  line(0, 0, cos(secondAngle) * radius * 0.8, sin(secondAngle) * radius * 0.8);

  // Millisecond hand
  let msAngle = map(ms, 0, 1000, 0, TWO_PI) - HALF_PI;
  stroke(millisHue, 80, 100);
  strokeWeight(1);
  line(0, 0, cos(msAngle) * radius * 0.85, sin(msAngle) * radius * 0.85);

  // Center dot
  fill(90);
  noStroke();
  ellipse(0, 0, 8, 8);

  pop();

  pop();
}
