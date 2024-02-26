let isPlaying = false;
let playInterval;

function generateRandomText() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?";
    let randomText = '';
    for (let i = 0; i < 25; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomText += characters[randomIndex];
    }
    document.getElementById('random-text').textContent = randomText;
}

function togglePlay() {
    if (!isPlaying) {
        playInterval = setInterval(generateRandomText, 100); // Change the interval as desired
        document.getElementById('play-button').textContent = 'Stop';
    } else {
        clearInterval(playInterval);
        document.getElementById('play-button').textContent = 'Play';
    }
    isPlaying = !isPlaying;
}

// Generate random text when the page loads
generateRandomText();