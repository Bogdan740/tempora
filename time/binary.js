function drawBinary() {
  push(); // Start isolation of all settings

  background(0);

  let h = hour();
  let m = minute();
  let s = second();

  let binH = dec2bin(h, 6);
  let binM = dec2bin(m, 6);
  let binS = dec2bin(s, 6);

  // Make the display more centered and proportional to the screen size
  let boxSize = min(windowWidth, windowHeight) / 24;
  let spacing = boxSize * 1.5;

  // Center everything on screen
  let gridWidth = spacing * 10; // Total width of the grid
  let startX = windowWidth / 2 - gridWidth / 2 + spacing;
  let startY = windowHeight / 2 - spacing * 4;

  textAlign(CENTER, CENTER);
  noStroke();

  // Column headers with shared color scheme
  textSize(boxSize * 0.8);

  // Hours - Purple theme
  fill(hourHue, 80, 100);
  text('HOURS', startX, startY - spacing);

  // Minutes - Teal theme
  fill(minuteHue, 80, 100);
  text('MINUTES', startX + spacing * 4, startY - spacing);

  // Seconds - Orange theme
  fill(secondHue, 80, 100);
  text('SECONDS', startX + spacing * 8, startY - spacing);

  // Create a nice glow effect for active bits
  drawingContext.shadowBlur = 15;

  // Binary time display
  for (let i = 0; i < 6; i++) {
    let y = startY + spacing * i;

    // Binary value labels (powers of 2)
    fill(180);
    textSize(boxSize * 0.6);
    text(pow(2, 5 - i).toString(), startX - spacing, y + boxSize / 2);

    // Hours column - Purple theme
    drawingContext.shadowColor =
      binH[i] === '1' ? `hsla(${hourHue}, 100%, 70%, 0.5)` : 'transparent';
    fill(binH[i] === '1' ? color(hourHue, 80, 100) : color(40, 40, 70));
    rect(startX, y, boxSize, boxSize, boxSize / 4);

    // Minutes column - Teal theme
    drawingContext.shadowColor =
      binM[i] === '1' ? `hsla(${minuteHue}, 100%, 70%, 0.5)` : 'transparent';
    fill(binM[i] === '1' ? color(minuteHue, 80, 100) : color(30, 60, 60));
    rect(startX + spacing * 4, y, boxSize, boxSize, boxSize / 4);

    // Seconds column - Orange theme
    drawingContext.shadowColor =
      binS[i] === '1' ? `hsla(${secondHue}, 100%, 70%, 0.5)` : 'transparent';
    fill(binS[i] === '1' ? color(secondHue, 80, 100) : color(60, 40, 30));
    rect(startX + spacing * 8, y, boxSize, boxSize, boxSize / 4);
  }

  // Turn off shadow for text
  drawingContext.shadowBlur = 0;

  // Display decimal values at the bottom
  textSize(boxSize);

  // Hours value
  fill(hourHue, 80, 100);
  text(h, startX, startY + spacing * 7);

  // Minutes value
  fill(minuteHue, 80, 100);
  text(m, startX + spacing * 4, startY + spacing * 7);

  // Seconds value
  fill(secondHue, 80, 100);
  text(s, startX + spacing * 8, startY + spacing * 7);

  pop(); // End isolation of all settings
}

// Helper function to convert decimal to binary
function dec2bin(dec, length) {
  let bin = (dec >>> 0).toString(2);
  while (bin.length < length) {
    bin = '0' + bin;
  }
  return bin;
}
