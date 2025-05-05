function drawPulse() {
  push();

  background(0);

  // Get current time
  let h = hour() % 12;
  let m = minute();
  let s = second();
  let ms = millis() % 1000;

  // Center point
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;

  // Set the maximum radius (fit within the window)
  let maxRadius = min(windowWidth, windowHeight) * 0.4;

  // Calculate pulse sizes based on time
  // Hour pulse: Slow expansion over 12 hours
  let hourProgress = h / 12;
  let hourSize = map(hourProgress, 0, 1, maxRadius * 0.2, maxRadius * 0.8);

  // Minute pulse: Grows over the course of an hour
  let minuteProgress = m / 60;
  let minuteSize = map(minuteProgress, 0, 1, maxRadius * 0.15, maxRadius * 0.6);

  // Second pulse: Pulsates every second
  let secondProgress = (s + ms / 1000) / 60;
  // Make the second pulse "breathe" - expand and contract each second
  let secondPulse = sin((ms / 1000) * TWO_PI);
  let secondSize = map(secondProgress, 0, 1, maxRadius * 0.1, maxRadius * 0.4);
  secondSize += secondPulse * maxRadius * 0.05; // Add breathing effect

  // Millisecond pulse: Rapid pulsation
  let msProgress = ms / 1000;
  let msPulse = sin(msProgress * TWO_PI * 2); // Faster oscillation
  let msSize = map(msProgress, 0, 1, 5, maxRadius * 0.15);
  msSize *= 0.7 + 0.3 * msPulse; // Apply pulsation effect

  // Draw the pulses from largest to smallest (background to foreground)
  noStroke();

  // Hour pulse
  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = `hsla(${hourHue}, 100%, 50%, 0.3)`;
  fill(hourHue, 70, 30, 120);
  ellipse(centerX, centerY, hourSize * 2, hourSize * 2);

  // Draw hour ring
  noFill();
  stroke(hourHue, 80, 90);
  strokeWeight(2);
  ellipse(centerX, centerY, hourSize * 2, hourSize * 2);

  // Minute pulse
  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = `hsla(${minuteHue}, 100%, 50%, 0.3)`;
  noStroke();
  fill(minuteHue, 70, 30, 140);
  ellipse(centerX, centerY, minuteSize * 2, minuteSize * 2);

  // Draw minute ring
  noFill();
  stroke(minuteHue, 80, 90);
  strokeWeight(2);
  ellipse(centerX, centerY, minuteSize * 2, minuteSize * 2);

  // Second pulse
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = `hsla(${secondHue}, 100%, 50%, 0.3)`;
  noStroke();
  fill(secondHue, 70, 40, 160);
  ellipse(centerX, centerY, secondSize * 2, secondSize * 2);

  // Draw second ring
  noFill();
  stroke(secondHue, 80, 90);
  strokeWeight(2);
  ellipse(centerX, centerY, secondSize * 2, secondSize * 2);

  // Millisecond pulse
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = `hsla(${millisHue}, 100%, 50%, 0.5)`;
  noStroke();
  fill(millisHue, 70, 60, 180);
  ellipse(centerX, centerY, msSize * 2, msSize * 2);

  // Center point
  fill(255);
  ellipse(centerX, centerY, 10, 10);

  // Turn off shadow
  drawingContext.shadowBlur = 0;

  pop();
}
