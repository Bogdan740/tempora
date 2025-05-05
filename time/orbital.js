function drawOrbital() {
  push();

  background(0);

  let h = hour() % 12;
  let m = minute();
  let s = second();

  // For milliseconds, use a synchronized approach
  let now = new Date();
  let ms = now.getMilliseconds();

  // Center point
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;

  // Set the maximum radius (fit within the window)
  let maxRadius = min(windowWidth, windowHeight) * 0.4;

  // Draw filled circles with progress

  // Hour circle (innermost)
  let hourRadius = maxRadius * 0.3;
  drawTimeFilledCircle(
    centerX,
    centerY,
    hourRadius,
    h / 12, // Progress (0-1)
    hourHue
  );

  // Minute circle (middle)
  let minuteRadius = maxRadius * 0.55;
  drawTimeFilledCircle(
    centerX,
    centerY,
    minuteRadius,
    m / 60, // Progress (0-1)
    minuteHue
  );

  // Second circle (outer)
  let secondRadius = maxRadius * 0.8;
  drawTimeFilledCircle(
    centerX,
    centerY,
    secondRadius,
    s / 60, // Progress (0-1)
    secondHue
  );

  // Millisecond orbit
  let msProgress = ms / 1000;
  let msAngle = msProgress * TWO_PI - HALF_PI;
  let msRadius = maxRadius * 0.95;
  let msX = centerX + cos(msAngle) * msRadius;
  let msY = centerY + sin(msAngle) * msRadius;

  // Draw millisecond trail
  drawMillisecondTrail(centerX, centerY, msRadius, msProgress);

  // Draw the millisecond dot
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = `hsla(${millisHue}, 100%, 50%, 0.5)`;
  noStroke();
  fill(millisHue, 80, 100);
  ellipse(msX, msY, 10, 10);
  drawingContext.shadowBlur = 0;

  // Center point
  fill(255);
  ellipse(centerX, centerY, 15, 15);

  // Draw minimal time indicators
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 12, 0, TWO_PI) - HALF_PI;

    if (i % 3 === 0) {
      // Larger markers for every 3 hours
      let markerRadius = secondRadius + 15;
      let x = centerX + cos(angle) * markerRadius;
      let y = centerY + sin(angle) * markerRadius;

      noStroke();
      fill(200, 100);
      ellipse(x, y, 6, 6);
    }
  }

  pop();
}

function drawTimeFilledCircle(centerX, centerY, radius, progress, hue) {
  // Draw background circle (empty)
  noFill();
  stroke(30);
  strokeWeight(2);
  ellipse(centerX, centerY, radius * 2, radius * 2);

  // Calculate the end angle and position
  let endAngle = -HALF_PI + TWO_PI * progress;
  let endX = centerX + cos(endAngle) * radius;
  let endY = centerY + sin(endAngle) * radius;

  // Apply glow effect
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = `hsla(${hue}, 100%, 50%, 0.3)`;

  // Create filled shape for progress
  fill(hue, 70, 30, 160);
  stroke(hue, 80, 90, 200);
  strokeWeight(2);

  beginShape();
  // Start at center
  vertex(centerX, centerY);

  // Draw the filled portion based on progress
  let segments = 100;
  let angleStep = TWO_PI / segments;

  for (let i = 0; i <= segments * progress; i++) {
    let angle = -HALF_PI + i * angleStep;
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;
    vertex(x, y);
  }

  // Ensure the last vertex is exactly at the calculated end position
  // This ensures the filled shape connects precisely to the dot
  vertex(endX, endY);

  // Complete the shape by returning to center
  vertex(centerX, centerY);
  endShape(CLOSE);

  // Draw edge highlight with connecting line
  stroke(hue, 80, 90, 220);
  strokeWeight(2);
  line(centerX, centerY, endX, endY);

  // Draw the dot at the end
  noStroke();
  fill(hue, 80, 100);
  drawingContext.shadowBlur = 25;
  ellipse(endX, endY, 10, 10);

  // Turn off glow
  drawingContext.shadowBlur = 0;
}

function drawMillisecondTrail(centerX, centerY, radius, progress) {
  let trailLength = 0.1; // 10% of the circle
  let trailStart = progress - trailLength;
  if (trailStart < 0) trailStart += 1; // Wrap around

  let segments = 30;
  let angleStep = (TWO_PI * trailLength) / segments;

  for (let i = 0; i < segments; i++) {
    let trailProgress = i / segments;
    let angle = (trailStart + trailProgress * trailLength) * TWO_PI - HALF_PI;
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;

    // Fade opacity based on position in trail
    let opacity = map(trailProgress, 0, 1, 30, 255);
    let size = map(trailProgress, 0, 1, 2, 8);

    noStroke();
    fill(millisHue, 80, 100, opacity);
    ellipse(x, y, size, size);
  }
}
