// Arrays to store falling blocks
let hourBlocks = [];
let minuteBlocks = [];
let secondBlocks = [];
let millisBlocks = [];

// Previous time values to detect changes
let prevHour = -1;
let prevMinute = -1;
let prevSecond = -1;
let prevMillis = -1;

function drawFalling() {
  push(); // Start isolation

  background(0);

  let h = hour();
  let m = minute();
  let s = second();
  let ms = floor(millis() % 1000);

  // Only update milliseconds every 50ms to avoid too many blocks
  ms = floor(ms / 50) * 50;

  // Calculate proportional sizes based on screen dimensions
  let baseSize = min(windowWidth, windowHeight) / 35;
  let hourSize = baseSize * 1.8;
  let minuteSize = baseSize * 1.4;
  let secondSize = baseSize;
  let millisSize = baseSize * 0.7;

  // Column positions - evenly spaced
  let colWidth = windowWidth / 5;
  let hourX = colWidth;
  let minuteX = colWidth * 2;
  let secondX = colWidth * 3;
  let millisX = colWidth * 4;

  // Consistent speeds based on time unit
  let hourSpeed = baseSize * 0.15;
  let minuteSpeed = baseSize * 0.25;
  let secondSpeed = baseSize * 0.4;
  let millisSpeed = baseSize * 0.6;

  // Define distinct color schemes for each time unit
  // Hours: Purple/Violet theme
  let hourHue = 270;
  let hourColor = color(hourHue, 80, 100);

  // Minutes: Teal/Turquoise theme
  let minuteHue = 175;
  let minuteColor = color(minuteHue, 80, 100);

  // Seconds: Orange/Amber theme
  let secondHue = 30;
  let secondColor = color(secondHue, 80, 100);

  // Milliseconds: Pink theme
  let millisHue = 330;
  let millisColor = color(millisHue, 80, 100);

  // Check if values changed and add new blocks
  if (ms !== prevMillis) {
    millisBlocks.push({
      y: 0,
      speed: millisSpeed,
      size: millisSize,
      x: random(-baseSize / 2, baseSize / 2), // Very small horizontal offset
      rotation: random(-0.01, 0.01), // Subtle rotation
      hue: millisHue + random(-5, 5), // Pink theme with slight variation
    });
    prevMillis = ms;
  }

  if (s !== prevSecond) {
    secondBlocks.push({
      y: 0,
      speed: secondSpeed,
      size: secondSize,
      x: random(-baseSize, baseSize), // Small random horizontal offset for visual interest
      rotation: random(-0.02, 0.02), // Subtle rotation
      hue: secondHue + random(-5, 5), // Orange theme with slight variation
    });
    prevSecond = s;
  }

  if (m !== prevMinute) {
    minuteBlocks.push({
      y: 0,
      speed: minuteSpeed,
      size: minuteSize,
      x: random(-baseSize, baseSize),
      rotation: random(-0.02, 0.02),
      hue: minuteHue + random(-5, 5), // Teal theme with slight variation
    });
    prevMinute = m;
  }

  if (h !== prevHour) {
    hourBlocks.push({
      y: 0,
      speed: hourSpeed,
      size: hourSize,
      x: random(-baseSize, baseSize),
      rotation: random(-0.02, 0.02),
      hue: hourHue + random(-5, 5), // Purple theme with slight variation
    });
    prevHour = h;
  }

  // Draw column labels with matching colors
  textAlign(CENTER, CENTER);
  textSize(baseSize);

  // Hours label - Purple
  fill(hourHue, 80, 100);
  text('HOURS', hourX, 50);
  text(h, hourX, 80);

  // Minutes label - Teal
  fill(minuteHue, 80, 100);
  text('MINUTES', minuteX, 50);
  text(m, minuteX, 80);

  // Seconds label - Orange
  fill(secondHue, 80, 100);
  text('SECONDS', secondX, 50);
  text(s, secondX, 80);

  // Milliseconds label - Pink
  fill(millisHue, 80, 100);
  text('MS', millisX, 50);
  text(ms, millisX, 80);

  // Process and draw blocks with their distinct colors
  processBlocks(hourBlocks, hourX, hourHue); // Purple theme
  processBlocks(minuteBlocks, minuteX, minuteHue); // Teal theme
  processBlocks(secondBlocks, secondX, secondHue); // Orange theme
  processBlocks(millisBlocks, millisX, millisHue); // Pink theme

  // Limit the number of blocks to prevent performance issues
  // Keep more hour blocks (slower) and fewer second blocks (faster)
  if (hourBlocks.length > 24) hourBlocks.splice(0, 1);
  if (minuteBlocks.length > 40) minuteBlocks.splice(0, 1);
  if (secondBlocks.length > 60) secondBlocks.splice(0, 1);

  pop(); // End isolation
}

function processBlocks(blocks, columnX, baseHue) {
  push();
  rectMode(CENTER);
  noStroke();

  for (let i = blocks.length - 1; i >= 0; i--) {
    let block = blocks[i];

    // Update position
    block.y += block.speed;

    // Remove if out of screen
    if (block.y > windowHeight + 100) {
      blocks.splice(i, 1);
      continue;
    }

    // Calculate position-based effects
    let progress = block.y / windowHeight;

    // Create subtle fade and scaling effects
    let alpha = 255 * (1 - progress * 0.7); // Fade out as it falls
    let saturation = 80 * (1 - progress * 0.3); // Reduce saturation slightly
    let brightness = 100;
    let scale = 1 - progress * 0.2; // Slightly shrink as it falls

    // Draw block with glow effect
    push();
    translate(columnX + block.x, block.y);
    rotate(block.rotation * block.y * 0.01);

    // Glow effect for blocks with color based on the time unit
    drawingContext.shadowBlur = 15 * (1 - progress * 0.5);
    drawingContext.shadowColor = `hsla(${block.hue}, 100%, 70%, 0.5)`;

    // Draw the block with rounded corners
    fill(block.hue, saturation, brightness, alpha);
    rect(0, 0, block.size * scale, block.size * scale, block.size * 0.2);
    pop();
  }

  pop();
}
