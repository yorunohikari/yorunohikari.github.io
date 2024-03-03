let cooldownEndTime = localStorage.getItem('cooldownEndTime');
let previousFortune = localStorage.getItem('previousFortune');

window.onload = function() {
  if (cooldownEndTime && Date.now() < parseInt(cooldownEndTime)) {
    displayCooldownTimer();
  }
  
  if (previousFortune) {
    displayFortune(previousFortune);
  }
};

function generateFortune() {
  const generateButton = document.getElementById('generateButton');
  
  if (!cooldownEndTime || Date.now() >= parseInt(cooldownEndTime)) {
    const cooldownDuration = 300000; // 5 minutes cooldown (300,000 milliseconds)
    cooldownEndTime = Date.now() + cooldownDuration;
    localStorage.setItem('cooldownEndTime', cooldownEndTime);
    
    displayCooldownTimer();
    
    fetch('fortunes.json')
      .then(response => response.json())
      .then(data => {
        const fortunes = data.fortunes;
        const randomIndex = Math.floor(Math.random() * fortunes.length);
        const randomFortune = fortunes[randomIndex];
        displayFortune(randomFortune);
        previousFortune = randomFortune;
        localStorage.setItem('previousFortune', previousFortune);
      })
      .catch(error => {
        console.error('Error fetching fortunes:', error);
      });
  } else {
    alert('Please wait for the cooldown period to end before generating another fortune.');
  }
}

function displayFortune(fortune) {
  const fortuneDisplay = document.getElementById('fortuneDisplay');
  fortuneDisplay.textContent = fortune;
  const fortuneLabel = document.getElementById('fortuneLabel');
  fortuneLabel.textContent = "Today's Fortune ✨";
}

function displayCooldownTimer() {
  const generateButton = document.getElementById('generateButton');
  
  const intervalId = setInterval(() => {
    const remainingTime = cooldownEndTime - Date.now();
    if (remainingTime <= 0) {
      clearInterval(intervalId);
      generateButton.textContent = 'Generate Fortune';
    } else {
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      generateButton.textContent = `Cooldown: ${minutes}m ${seconds}s`;
    }
  }, 1000);
}
