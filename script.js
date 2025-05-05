// Current visualization type
let currentViz = 'simple';

// Consistent color scheme across visualizations
const hourHue = 270; // Purple/Violet
const minuteHue = 175; // Teal/Turquoise
const secondHue = 30; // Orange/Amber
const millisHue = 350; // Pink/Magenta for milliseconds

function setup() {
  frameRate(120); // Higher framerate for smoother millisecond hand
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  setupButtons();
  colorMode(HSB, 360, 100, 100, 255); // Set color mode to HSB for all visualizations
}

function draw() {
  // Call the appropriate visualization function
  switch (currentViz) {
    case 'simple':
      drawSimple();
      break;
    case 'circular':
      drawCircular();
      break;
    case 'binary':
      drawBinary();
      break;
    case 'falling':
      drawFalling();
      break;
    case 'orbital':
      drawOrbital();
      break;
    default:
      drawSimple();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Setup the UI buttons
function setupButtons() {
  // Simple button
  const btnSimple = document.getElementById('btn-simple');
  btnSimple.addEventListener('click', () => {
    setActiveButton(btnSimple);
    currentViz = 'simple';
  });

  // Circular button
  const btnCircular = document.getElementById('btn-circular');
  btnCircular.addEventListener('click', () => {
    setActiveButton(btnCircular);
    currentViz = 'circular';
  });

  // Binary button
  const btnBinary = document.getElementById('btn-binary');
  btnBinary.addEventListener('click', () => {
    setActiveButton(btnBinary);
    currentViz = 'binary';
  });

  // Falling button
  const btnFalling = document.getElementById('btn-falling');
  btnFalling.addEventListener('click', () => {
    setActiveButton(btnFalling);
    currentViz = 'falling';
  });

  // Orbital button
  const btnOrbital = document.getElementById('btn-orbital');
  btnOrbital.addEventListener('click', () => {
    setActiveButton(btnOrbital);
    currentViz = 'orbital';
  });
}

// Helper function to set the active button
function setActiveButton(activeBtn) {
  // Remove active class from all buttons
  document.querySelectorAll('#controls button').forEach((btn) => {
    btn.classList.remove('active');
  });

  // Add active class to the selected button
  activeBtn.classList.add('active');
}
