// Particle arrays for fluid simulation
let hourParticles = [];
let minuteParticles = [];
let secondParticles = [];
let millisParticles = [];

function drawFluid() {
  push();

  background(0);

  // Get current time
  let h = hour() % 12;
  let m = minute();
  let s = second();
  let ms = millis() % 1000;

  // Calculate progress of each time unit
  let hourProgress = h / 12;
  let minuteProgress = m / 60;
  let secondProgress = s / 60;
  let millisProgress = ms / 1000;

  // Set up containers
  const margin = 40;
  const containerWidth = (windowWidth - margin * 5) / 4;
  const containerHeight = windowHeight * 0.6;
  const baseY = windowHeight * 0.8;

  // Container positions
  const hourX = margin;
  const minuteX = margin * 2 + containerWidth;
  const secondX = margin * 3 + containerWidth * 2;
  const millisX = margin * 4 + containerWidth * 3;

  // Draw containers
  drawContainer(hourX, baseY, containerWidth, containerHeight, hourHue, 'HOURS', h);
  drawContainer(minuteX, baseY, containerWidth, containerHeight, minuteHue, 'MINUTES', m);
  drawContainer(secondX, baseY, containerWidth, containerHeight, secondHue, 'SECONDS', s);
  drawContainer(millisX, baseY, containerWidth, containerHeight, millisHue, 'MS', floor(ms));

  // Initialize particles if needed
  if (hourParticles.length === 0) {
    initializeParticles();
  }

  // Update and draw particles
  updateParticles(
    hourParticles,
    hourX,
    baseY,
    containerWidth,
    containerHeight,
    hourProgress,
    hourHue
  );
  updateParticles(
    minuteParticles,
    minuteX,
    baseY,
    containerWidth,
    containerHeight,
    minuteProgress,
    minuteHue
  );
  updateParticles(
    secondParticles,
    secondX,
    baseY,
    containerWidth,
    containerHeight,
    secondProgress,
    secondHue
  );
  updateParticles(
    millisParticles,
    millisX,
    baseY,
    containerWidth,
    containerHeight,
    millisProgress,
    millisHue
  );

  // Draw fluid levels
  drawFluidLevel(hourX, baseY, containerWidth, containerHeight, hourProgress, hourHue);
  drawFluidLevel(minuteX, baseY, containerWidth, containerHeight, minuteProgress, minuteHue);
  drawFluidLevel(secondX, baseY, containerWidth, containerHeight, secondProgress, secondHue);
  drawFluidLevel(millisX, baseY, containerWidth, containerHeight, millisProgress, millisHue);

  pop();
}

function initializeParticles() {
  // Create particles for each container
  hourParticles = createParticles(100, hourHue);
  minuteParticles = createParticles(150, minuteHue);
  secondParticles = createParticles(200, secondHue);
  millisParticles = createParticles(80, millisHue);
}

function createParticles(count, hue) {
  const particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: random(0, 1), // Normalized x position (0-1)
      y: random(0, 1), // Normalized y position (0-1)
      vx: random(-0.003, 0.003), // X velocity
      vy: random(-0.002, 0), // Y velocity (mostly upward)
      size: random(2, 6), // Particle size
      hue: hue,
      opacity: random(100, 200),
    });
  }

  return particles;
}

function drawContainer(x, baseY, width, height, hue, label, value) {
  // Draw container outline
  stroke(hue, 30, 60);
  strokeWeight(2);
  noFill();
  rect(x, baseY - height, width, height);

  // Draw container label
  noStroke();
  fill(hue, 20, 80);
  textAlign(CENTER);
  textSize(14);
  text(label, x + width / 2, baseY - height - 15);

  // Draw current value
  textSize(20);
  fill(hue, 40, 100);
  text(nf(value, 2), x + width / 2, baseY - height - 35);

  // Draw measurement lines
  stroke(hue, 20, 50);
  strokeWeight(1);

  // Define consistent measurement intervals based on container type
  const lineCount = label === 'HOURS' ? 12 : label === 'MS' ? 10 : 6;
  const maxValue = label === 'HOURS' ? 12 : label === 'MS' ? 1000 : 60;

  // Calculate text width for alignment
  textAlign(RIGHT);
  textSize(10);
  let maxTextWidth = 0;

  // Find the widest text for alignment
  for (let i = 0; i <= lineCount; i++) {
    const valueText = floor((maxValue * i) / lineCount).toString();
    const textW = textWidth(valueText);
    maxTextWidth = max(maxTextWidth, textW);
  }

  // Line length varies based on importance of marker
  const majorLineLength = 15;
  const minorLineLength = 8;

  // Draw the markers and labels
  for (let i = 0; i <= lineCount; i++) {
    const lineY = baseY - (height * i) / lineCount;
    const markerValue = floor((maxValue * i) / lineCount);

    // Determine if this is a major marker (show label)
    const isMajor = i % 2 === 0 || lineCount <= 6;

    // Draw marker line
    stroke(hue, 20, isMajor ? 70 : 40);
    strokeWeight(isMajor ? 1.5 : 0.8);
    line(x, lineY, x + (isMajor ? majorLineLength : minorLineLength), lineY);

    // Add measurement label for major markers
    if (isMajor) {
      noStroke();
      fill(hue, 20, 80);
      textAlign(LEFT);
      textSize(10);

      // Position text consistently for all containers
      text(markerValue, x + majorLineLength + 5, lineY + 3);
    }
  }
}

function updateParticles(
  particles,
  containerX,
  baseY,
  containerWidth,
  containerHeight,
  fluidLevel,
  hue
) {
  // Calculate fluid surface level
  const fluidSurfaceY = baseY - containerHeight * fluidLevel;

  // Update each particle
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Only animate particles below the fluid level
    if (p.y * containerHeight > containerHeight - containerHeight * fluidLevel) {
      // Apply "fluid dynamics"

      // Add some random movement
      p.vx += random(-0.0005, 0.0005);
      p.vy += random(-0.0005, 0.0005);

      // Constrain velocity
      p.vx = constrain(p.vx, -0.004, 0.004);
      p.vy = constrain(p.vy, -0.004, 0.002);

      // Move the particle
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      if (p.x < 0 || p.x > 1) {
        p.vx *= -0.8;
        p.x = constrain(p.x, 0, 1);
      }

      // Bounce off bottom
      if (p.y > 1) {
        p.vy *= -0.8;
        p.y = 0.99;
      }

      // Rise toward surface if below fluid level
      const normalizedFluidLevel = 1 - fluidLevel;
      if (p.y > normalizedFluidLevel) {
        p.vy -= 0.0001 * (p.y - normalizedFluidLevel) * 10;
      }

      // Particles want to stay under the surface
      if (p.y < normalizedFluidLevel) {
        p.y = normalizedFluidLevel + random(0, 0.05);
        p.vy = abs(p.vy) * 0.1;
      }
    }

    // Draw the particle
    const particleX = containerX + p.x * containerWidth;
    const particleY = baseY - containerHeight + p.y * containerHeight;

    if (particleY < baseY && particleY > baseY - containerHeight * fluidLevel) {
      drawingContext.shadowBlur = 5;
      drawingContext.shadowColor = `hsla(${hue}, 100%, 70%, 0.3)`;

      fill(hue, 60, 90, p.opacity);
      noStroke();
      ellipse(particleX, particleY, p.size, p.size);

      drawingContext.shadowBlur = 0;
    }
  }
}

function drawFluidLevel(x, baseY, width, height, fluidLevel, hue) {
  // Calculate fluid surface Y position
  const fluidSurfaceY = baseY - height * fluidLevel;

  // Draw fluid surface with wave effect
  noStroke();

  // Add glow effect
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = `hsla(${hue}, 100%, 50%, 0.5)`;

  // Create wave effect
  fill(hue, 70, 90, 170);
  beginShape();

  // Bottom left corner
  vertex(x, baseY);

  // Bottom right corner
  vertex(x + width, baseY);

  // Top right with wave
  const waveHeight = 5;
  const waveFrequency = 0.2;

  for (let i = width; i >= 0; i -= 5) {
    const waveY = fluidSurfaceY + sin(frameCount * 0.05 + i * waveFrequency) * waveHeight;
    vertex(x + i, waveY);
  }

  endShape(CLOSE);

  // Turn off glow
  drawingContext.shadowBlur = 0;
}
