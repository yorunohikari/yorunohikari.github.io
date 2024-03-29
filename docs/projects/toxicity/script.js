const heroCanvas = document.getElementById('hero-canvas');
const ctx = heroCanvas.getContext('2d');
const audioElement = document.getElementById('audio');
const maman = document.getElementById('mamat');

function playAudio() {
  resizeCanvas();
  drawLyrics();
  hideAudio();
  setInterval(toggleBackgroundColor, 60000 / 116);
  audioElement.play()
    .catch(err => {
      console.error('Failed to play audio:', err);
    });
}

function hideAudio() {
  maman.style.display = 'none';
}

// Function to resize the canvas to fit the window
function resizeCanvas() {
  const canvasWidth = window.innerWidth * 1; // 80% of the window width
  const canvasHeight = window.innerHeight * 1; // 80% of the window height
  heroCanvas.width = canvasWidth;
  heroCanvas.height = canvasHeight;
  ctx.font = `${getFontSize(canvasWidth, canvasHeight)}px Arial`; // Adjust font size based on canvas dimensions
}

// Function to get the appropriate font size based on canvas dimensions
function getFontSize(canvasWidth, canvasHeight) {
  const maxFontSize = Math.min(canvasWidth, canvasHeight) * 0.1; // 10% of the smaller canvas dimension
  return Math.floor(maxFontSize);
}

// Function to clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
}

// Array to hold the lyrics lines
const lyrics = [
    "You!",
    "What do you own the world?",
    "Disorder!!",
    "How do you own disorder?",
    "Now somewhere between the sacred silence",
    "Sacred silence and sleep",
    "Somewhere, between the sacred silence and sleep",
    "Disorder!!",
    "Conversion, software version 7.0",
    "Looking at life through the eyes of a tire hub",
    "Eating seeds as a pastime activity",
    "The toxicity of our city, our city",
    "Disorder!!",
    "More wood for their fires, loud neighbors",
    "Flashlight reveries caught in the headlights of a truck",
    "Eating seeds as a pastime activity",
    "The toxicity of our city, of our city",
    "When I became the sun",
    "I shone life into the man's hearts",
    "Our city"
];

// Function to draw lyrics with fading, jumping, shaking, and continuously changing positions
function drawLyrics() {
  const lineHeight = 30;
  let lyricsPositions = [];

  // Generate random initial positions for each line of lyrics
  for (let i = 0; i < lyrics.length; i++) {
    lyricsPositions.push({
      x: Math.random() * heroCanvas.width,
      y: Math.random() * heroCanvas.height,
      alpha: 0, // Initial alpha value for fading effect
      timeOffset: Math.random() * Math.PI * 2,
      jumpInTime: Math.random() * 2000,
      jumpOutTime: Math.random() * 2000 + 2000
    });
  }

  function draw() {
    clearCanvas();
    const currentTime = Date.now();
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    // Draw each line of the lyrics
    lyricsPositions.forEach((position, index) => {
      // Calculate the alpha value based on jump in and jump out times
      const deltaTimeIn = (currentTime - position.jumpInTime) / 50000;
      const deltaTimeOut = (currentTime - position.jumpOutTime) / 500;
      const alpha = Math.min(1, deltaTimeIn) * (1 - Math.min(1, deltaTimeOut));

      // Calculate shaking effect
      const xOffset = Math.sin(position.timeOffset + currentTime / 100) * 5;
      const yOffset = Math.cos(position.timeOffset + currentTime / 100) * 5;

      // Draw text with alpha and shaking effect
      ctx.globalAlpha = alpha;
      ctx.fillText(lyrics[index], position.x + xOffset, position.y + yOffset);
    });

    ctx.globalAlpha = 1; // Reset global alpha
    requestAnimationFrame(draw);
  }

  // Function to update positions randomly every 50 milliseconds
  setInterval(() => {
    lyricsPositions.forEach((position) => {
      position.x = Math.random() * heroCanvas.width;
      position.y = Math.random() * heroCanvas.height;
      position.jumpInTime = Date.now() + Math.random() * 2000;
      position.jumpOutTime = position.jumpInTime + Math.random() * 2000 + 2000;
    });
  }, 60000 / 116 / 2);

  draw();
}

// Event listener for window resize
window.addEventListener('resize', resizeCanvas);

// Function to toggle background color
function toggleBackgroundColor() {
  const body = document.body;
  const backgroundColor = window.getComputedStyle(body).backgroundColor;
  const targetColor = backgroundColor === 'rgb(45, 0, 244)' ? 'black' : '#2d00f4';
  body.style.backgroundColor = targetColor;
}