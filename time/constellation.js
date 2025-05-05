// Global variables for star positions
let hourStars = [];
let minuteStars = [];
let secondStars = [];
let msStars = [];

function drawConstellation() {
  push();

  background(0);

  // Get current time
  let h = hour() % 12;
  let m = minute();
  let s = second();
  let ms = millis() % 1000;

  // Center of the screen
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;

  // Maximum radius
  let maxRadius = min(windowWidth, windowHeight) * 0.4;

  // Initialize star positions if not already set
  if (hourStars.length === 0) {
    initializeStars();
  }

  // Draw connecting lines first
  drawConstellationLines(hourStars, h, hourHue, 12, centerX, centerY, maxRadius * 0.7);
  drawConstellationLines(minuteStars, m, minuteHue, 60, centerX, centerY, maxRadius * 0.5);
  drawConstellationLines(secondStars, s, secondHue, 60, centerX, centerY, maxRadius * 0.3);

  // Draw millisecond trail
  drawMsTrail(msStars, ms, millisHue, centerX, centerY, maxRadius * 0.15);

  // Draw stars
  drawStars(hourStars, hourHue, centerX, centerY, maxRadius * 0.7, 4);
  drawStars(minuteStars, minuteHue, centerX, centerY, maxRadius * 0.5, 3);
  drawStars(secondStars, secondHue, centerX, centerY, maxRadius * 0.3, 2.5);

  // Draw time indicators near the active stars
  drawTimeIndicator(h, hourStars, hourHue, centerX, centerY, maxRadius * 0.7);
  drawTimeIndicator(m, minuteStars, minuteHue, centerX, centerY, maxRadius * 0.5);
  drawTimeIndicator(s, secondStars, secondHue, centerX, centerY, maxRadius * 0.3);

  pop();
}

function initializeStars() {
  // Generate star positions in a circle pattern
  // 12 stars for hours
  hourStars = generateStarPositions(12, 0.15);

  // 60 stars for minutes
  minuteStars = generateStarPositions(60, 0.1);

  // 60 stars for seconds
  secondStars = generateStarPositions(60, 0.08);

  // 20 stars for milliseconds
  msStars = generateStarPositions(20, 0.03);
}

function generateStarPositions(count, jitterFactor) {
  const stars = [];

  for (let i = 0; i < count; i++) {
    // Calculate basic position on a circle
    let angle = map(i, 0, count, 0, TWO_PI);

    // Add some jitter/variation to make it look more natural
    let jitterX = random(-jitterFactor, jitterFactor);
    let jitterY = random(-jitterFactor, jitterFactor);

    // Store normalized coordinates (-1 to 1)
    stars.push({
      x: cos(angle) + jitterX,
      y: sin(angle) + jitterY,
      brightness: random(0.5, 1), // Random initial brightness
    });
  }

  return stars;
}

function drawStars(stars, hue, centerX, centerY, radius, baseSize) {
  noStroke();

  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];

    // Star position
    const x = centerX + star.x * radius;
    const y = centerY + star.y * radius;

    // Draw star glow
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = `hsla(${hue}, 100%, 50%, 0.5)`;

    // Star size varies slightly
    const starSize = baseSize * (0.8 + star.brightness * 0.4);

    // Draw star
    fill(hue, 30, 100 * star.brightness);
    ellipse(x, y, starSize, starSize);

    // Center of star is brighter
    fill(hue, 30, 100);
    ellipse(x, y, starSize * 0.5, starSize * 0.5);
  }

  drawingContext.shadowBlur = 0;
}

function drawConstellationLines(stars, currentTime, hue, maxTime, centerX, centerY, radius) {
  // Draw lines connecting stars up to the current time point
  const activeStars = Math.ceil(map(currentTime, 0, maxTime, 0, stars.length));

  if (activeStars <= 1) return;

  stroke(hue, 70, 90, 150);
  strokeWeight(1);

  for (let i = 0; i < activeStars - 1; i++) {
    const x1 = centerX + stars[i].x * radius;
    const y1 = centerY + stars[i].y * radius;
    const x2 = centerX + stars[i + 1].x * radius;
    const y2 = centerY + stars[i + 1].y * radius;

    line(x1, y1, x2, y2);
  }

  // Connect the last to first to make a complete shape
  if (activeStars === stars.length) {
    const x1 = centerX + stars[stars.length - 1].x * radius;
    const y1 = centerY + stars[stars.length - 1].y * radius;
    const x2 = centerX + stars[0].x * radius;
    const y2 = centerY + stars[0].y * radius;

    line(x1, y1, x2, y2);
  }
}

function drawMsTrail(stars, ms, hue, centerX, centerY, radius) {
  // Current millisecond position
  const msPosition = Math.floor(map(ms, 0, 1000, 0, stars.length));

  // Draw with fading effect
  for (let i = 0; i < stars.length; i++) {
    // Calculate distance from current ms
    let distance = (i - msPosition + stars.length) % stars.length;

    // Fade out based on distance
    if (distance < stars.length / 3) {
      const alpha = map(distance, 0, stars.length / 3, 230, 30);
      const size = map(distance, 0, stars.length / 3, 3, 1);

      const x = centerX + stars[i].x * radius;
      const y = centerY + stars[i].y * radius;

      noStroke();
      fill(hue, 80, 100, alpha);
      ellipse(x, y, size, size);
    }
  }
}

function drawTimeIndicator(time, stars, hue, centerX, centerY, radius) {
  // Find the active star based on current time
  const starIndex = Math.floor(map(time, 0, stars.length, 0, stars.length - 0.001));
  const x = centerX + stars[starIndex].x * radius;
  const y = centerY + stars[starIndex].y * radius;

  // Draw a pulsing circle around the active star
  noFill();
  stroke(hue, 80, 100, 150 + 100 * sin(millis() / 200));
  strokeWeight(1);
  ellipse(x, y, 15 + sin(millis() / 200) * 5, 15 + sin(millis() / 200) * 5);

  // Draw a brighter star at the active position
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = `hsla(${hue}, 100%, 70%, 0.7)`;

  fill(hue, 50, 100);
  noStroke();
  ellipse(x, y, 6, 6);

  drawingContext.shadowBlur = 0;
}
