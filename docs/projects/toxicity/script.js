const heroCanvas = document.getElementById('hero-canvas');
const ctx = heroCanvas.getContext('2d');
const audioElement = document.getElementById('audio');
const maman = document.getElementById('mamat');

// Lirik
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

// Play Audio
function playAudio() {
  triggerFullscreen();
  resizeCanvas();
  drawLyrics();
  hideAudio();
  setInterval(toggleBackgroundColor, 60000 / 116);
  audioElement.play()
    .catch(err => {
      console.error('Failed to play audio:', err);
    });
  disableOverscroll();
}

// Hide Audio
function hideAudio() {
  maman.style.display = 'none';
}

// Resize Canvas 
function resizeCanvas() {
  const canvasWidth = window.innerWidth * 1;
  const canvasHeight = window.innerHeight * 1;
  heroCanvas.width = canvasWidth;
  heroCanvas.height = canvasHeight;
  ctx.font = `${getFontSize(canvasWidth, canvasHeight)}px Arial`;
}

// Get Font Size
function getFontSize(canvasWidth, canvasHeight) {
  const maxFontSize = Math.min(canvasWidth, canvasHeight) * 0.1;
  return Math.floor(maxFontSize);
}

// Clear Canvas
function clearCanvas() {
  ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
}

// Bikin Lirik
function drawLyrics() {
  let lyricsPositions = [];

  for (let i = 0; i < lyrics.length; i++) {
    lyricsPositions.push({
      x: Math.random() * heroCanvas.width,
      y: Math.random() * heroCanvas.height,
      alpha: 0,
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

    lyricsPositions.forEach((position, index) => {
      const deltaTimeIn = (currentTime - position.jumpInTime) / 50000;
      const deltaTimeOut = (currentTime - position.jumpOutTime) / 500;
      const alpha = Math.min(1, deltaTimeIn) * (1 - Math.min(1, deltaTimeOut));
      const xOffset = Math.sin(position.timeOffset + currentTime / 100) * 5;
      const yOffset = Math.cos(position.timeOffset + currentTime / 100) * 5;

      ctx.globalAlpha = alpha;
      ctx.fillText(lyrics[index], position.x + xOffset, position.y + yOffset);
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

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

// Window Resize Event Listener
window.addEventListener('resize', resizeCanvas);

// Toggle Background Color 
function toggleBackgroundColor() {
  const body = document.body;
  const backgroundColor = window.getComputedStyle(body).backgroundColor;
  const targetColor = backgroundColor === 'rgb(45, 0, 244)' ? 'black' : '#2d00f4';
  body.style.backgroundColor = targetColor;
}

// Trigger Fullscreen 
function triggerFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

// Disable Overscroll 
function disableOverscroll() {
  document.body.style.overscrollBehavior = 'none';
}