function drawSimple() {
  push(); // Start isolation

  background(0);

  // Set text properties
  textSize(64);
  textAlign(CENTER, CENTER);

  // Format the time with leading zeros
  let h = nf(hour(), 2, 0);
  let m = nf(minute(), 2, 0);
  let s = nf(second(), 2, 0);

  // Create the time string with colored segments
  push();
  fill(hourHue, 80, 100);
  text(h, windowWidth / 2 - 85, windowHeight / 2);

  fill(100);
  text(':', windowWidth / 2 - 32, windowHeight / 2);

  fill(minuteHue, 80, 100);
  text(m, windowWidth / 2 + 20, windowHeight / 2);

  fill(100);
  text(':', windowWidth / 2 + 73, windowHeight / 2);

  fill(secondHue, 80, 100);
  text(s, windowWidth / 2 + 125, windowHeight / 2);
  pop();

  pop(); // End isolation
}
