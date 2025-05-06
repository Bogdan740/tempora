// Time ball objects
let hourBall, minuteBall, secondBall, msBall;
let trails = [];

function drawBounce() {
  push();
  background(0);

  // Get current time
  let h = hour() % 12 || 12; // Convert 0 to 12 for 12-hour format
  let m = minute();
  let s = second();
  let ms = millis() % 1000;

  // Calculate normalized values (0-1)
  let hourProgress = h / 12;
  let minuteProgress = m / 60;
  let secondProgress = s / 60;
  let msProgress = ms / 1000;

  // Define the floor level (ground)
  let floorY = windowHeight * 0.8;

  // Define column positions
  let hourX = windowWidth * 0.2;
  let minuteX = windowWidth * 0.4;
  let secondX = windowWidth * 0.6;
  let msX = windowWidth * 0.8;

  // Define column widths
  let columnWidth = windowWidth * 0.15;

  // Initialize balls if needed
  if (!hourBall) {
    setupTimeObjects();
  }

  // Update trails
  updateTrails();

  // Draw floor lines and labels
  drawFloor(hourX, floorY, columnWidth, 'HOURS', hourHue, h);
  drawFloor(minuteX, floorY, columnWidth, 'MINUTES', minuteHue, m);
  drawFloor(secondX, floorY, columnWidth, 'SECONDS', secondHue, s);
  drawFloor(msX, floorY, columnWidth, 'MS', millisHue, int(ms));

  // Update and draw balls
  updateTimeBall(hourBall, hourX, floorY, hourProgress, hourHue, 0.5);
  updateTimeBall(minuteBall, minuteX, floorY, minuteProgress, minuteHue, 1.0);
  updateTimeBall(secondBall, secondX, floorY, secondProgress, secondHue, 2.0);
  updateTimeBall(msBall, msX, floorY, msProgress, millisHue, 4.0);

  pop();
}

function setupTimeObjects() {
  // Create a single ball for each time unit with appropriate properties
  hourBall = createTimeBall(50, hourHue);
  minuteBall = createTimeBall(40, minuteHue);
  secondBall = createTimeBall(35, secondHue);
  msBall = createTimeBall(25, millisHue);
}

function createTimeBall(size, hue) {
  return {
    size: size,
    phase: random(0, TWO_PI),
    active: true,
    hue: hue,
    xOffset: random(-5, 5),
    lastY: 0,
    lastX: 0,
  };
}

function updateTrails() {
  // Add new trail points
  if (frameCount % 2 === 0) {
    if (hourBall && hourBall.lastY > 0) {
      trails.push({
        x: hourBall.lastX,
        y: hourBall.lastY,
        size: hourBall.size * 0.8,
        hue: hourBall.hue,
        alpha: 150,
        life: 20,
      });
    }

    if (minuteBall && minuteBall.lastY > 0) {
      trails.push({
        x: minuteBall.lastX,
        y: minuteBall.lastY,
        size: minuteBall.size * 0.8,
        hue: minuteBall.hue,
        alpha: 150,
        life: 15,
      });
    }

    if (secondBall && secondBall.lastY > 0 && frameCount % 2 === 0) {
      trails.push({
        x: secondBall.lastX,
        y: secondBall.lastY,
        size: secondBall.size * 0.8,
        hue: secondBall.hue,
        alpha: 120,
        life: 10,
      });
    }

    if (msBall && msBall.lastY > 0 && frameCount % 4 === 0) {
      trails.push({
        x: msBall.lastX,
        y: msBall.lastY,
        size: msBall.size * 0.7,
        hue: msBall.hue,
        alpha: 100,
        life: 5,
      });
    }
  }

  // Draw and update all trails
  for (let i = trails.length - 1; i >= 0; i--) {
    let trail = trails[i];

    // Draw trail
    noStroke();
    fill(trail.hue, 70, 90, trail.alpha);
    ellipse(trail.x, trail.y, trail.size, trail.size);

    // Update trail
    trail.size *= 0.92;
    trail.alpha *= 0.9;
    trail.life--;

    // Remove old trails
    if (trail.life <= 0 || trail.alpha < 5) {
      trails.splice(i, 1);
    }
  }

  // Limit the number of trails to prevent performance issues
  if (trails.length > 60) {
    trails.splice(0, trails.length - 60);
  }
}

function drawFloor(x, floorY, width, label, hue, value) {
  // Draw glow for floor
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = `hsla(${hue}, 80%, 50%, 0.5)`;

  // Draw floor line
  stroke(hue, 30, 60);
  strokeWeight(2);
  line(x - width / 2, floorY, x + width / 2, floorY);

  drawingContext.shadowBlur = 0;

  // Draw label
  noStroke();
  fill(hue, 50, 90);
  textSize(16);
  textAlign(CENTER);
  text(label, x, floorY + 25);

  // Draw current value
  textSize(22);
  fill(hue, 60, 100);
  text(nf(value, 2), x, floorY + 50);
}

function updateTimeBall(ball, x, floorY, progress, hue, speedFactor) {
  if (!ball) return;

  // Calculate bounce height based on time and normalized progress
  let time = frameCount * 0.05 * speedFactor;

  // The bounce frequency increases with the time unit
  // (hours bounce slower, milliseconds bounce faster)
  let bounceHeight = abs(sin(time + ball.phase)) * (windowHeight * 0.5);

  // Add a progress-based height component
  // Lower progress = lower bounce
  bounceHeight *= 0.3 + progress * 0.7;

  // Add some randomness to x position for more natural movement
  let ballX = x + ball.xOffset + sin(time * 0.3) * 5;
  let ballY = floorY - bounceHeight - ball.size / 2;

  // Store position for trails
  ball.lastX = ballX;
  ball.lastY = ballY;

  // Draw expanding ring on bounce impact
  if (sin(time + ball.phase) < 0 && sin(time + ball.phase + 0.1) >= 0) {
    for (let i = 0; i < 3; i++) {
      let ringSize = ball.size * (1.2 + i * 0.5);
      let ringAlpha = 150 - i * 40;
      noFill();
      strokeWeight(2);
      stroke(hue, 80, 90, ringAlpha);
      ellipse(ballX, floorY - ball.size * 0.1, ringSize, ringSize * 0.2);
    }
  }

  // Draw ball shadow
  noStroke();
  fill(0, 0, 0, 90);
  let shadowSize = map(bounceHeight, 0, windowHeight * 0.5, ball.size * 0.8, ball.size * 0.2);
  ellipse(ballX, floorY - 2, ball.size, shadowSize);

  // Calculate squish factor based on bounce height
  let squishY = 1.0;
  let squishX = 1.0;

  // When close to the ground, squish the ball
  if (bounceHeight < ball.size * 0.5) {
    let squishFactor = map(bounceHeight, 0, ball.size * 0.5, 0.7, 1.0);
    squishY = squishFactor;
    squishX = 1 + (1 - squishFactor) * 0.8;
  }

  // Draw ball with glow effect
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = `hsla(${hue}, 100%, 50%, 0.5)`;

  // Ball gradient
  let gradient = drawingContext.createRadialGradient(
    ballX - ball.size * 0.2,
    ballY - ball.size * 0.2,
    0,
    ballX,
    ballY,
    ball.size
  );
  gradient.addColorStop(0, `hsla(${hue}, 80%, 100%, 1)`);
  gradient.addColorStop(0.4, `hsla(${hue}, 90%, 80%, 1)`);
  gradient.addColorStop(1, `hsla(${hue}, 100%, 60%, 0.8)`);

  // Ball fill
  noStroke();
  drawingContext.fillStyle = gradient;
  ellipse(ballX, ballY, ball.size * squishX, ball.size * squishY);

  // Ball highlight
  fill(hue, 60, 100, 200);
  ellipse(ballX - ball.size * 0.2, ballY - ball.size * 0.2, ball.size * 0.3, ball.size * 0.3);

  drawingContext.shadowBlur = 0;

  // Draw progress as a fill level inside the ball
  if (progress > 0.05) {
    fill(hue, 100, 90, 180);
    let fillHeight = ball.size * progress * squishY;
    let fillY = ballY + (ball.size * squishY) / 2 - fillHeight;
    rect(
      ballX - ball.size * squishX * 0.4,
      fillY,
      ball.size * squishX * 0.8,
      fillHeight,
      ball.size * 0.3
    );
  }
}
