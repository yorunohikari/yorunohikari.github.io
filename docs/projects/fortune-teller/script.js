let cooldownEndTime = localStorage.getItem("cooldownEndTime");
let previousFortune = localStorage.getItem("previousFortune");

window.onload = function () {
  if (cooldownEndTime && Date.now() < parseInt(cooldownEndTime)) {
    displayCooldownTimer();
    updateLuckTable();
  }

  if (previousFortune) {
    displayFortune(previousFortune);
  }
};

function generateFortune() {

  if (!cooldownEndTime || Date.now() >= parseInt(cooldownEndTime)) {
    const cooldownDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    cooldownEndTime = Date.now() + cooldownDuration;
    localStorage.setItem("cooldownEndTime", cooldownEndTime);

    displayCooldownTimer();

    fetch("fortunes.json")
      .then((response) => response.json())
      .then((data) => {
        const fortunes = data.fortunes;
        const randomIndex = Math.floor(Math.random() * fortunes.length);
        const randomFortune = fortunes[randomIndex];
        displayFortune(randomFortune);
        previousFortune = randomFortune;
        localStorage.setItem("previousFortune", previousFortune);
        generateLuckStats();
        const luckStats = getLuckStats();
        console.log("Luck Stats:", luckStats);
        updateLuckTable();
      })
      .catch((error) => {
        console.error("Error fetching fortunes:", error);
      });
  } else {
    alert(
      "You can only generate fortune once a day. Please wait for tomorrow."
    );
  }
}

function displayFortune(fortune) {
  const fortuneDisplay = document.getElementById("fortuneDisplay");
  fortuneDisplay.textContent = fortune;
  const fortuneLabel = document.getElementById("fortuneLabel");
  fortuneLabel.textContent = "Today's Fortune ✨";
}

function displayCooldownTimer() {
  const generateButton = document.getElementById("generateButton");

  const intervalId = setInterval(() => {
    const remainingTime = cooldownEndTime - Date.now();
    if (remainingTime <= 0) {
      clearInterval(intervalId);
      generateButton.textContent = "Generate Fortune";
    } else {
      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      generateButton.textContent = `Cooldown: ${hours}h ${minutes}m ${seconds}s`;
    }
  }, 1000);
}

// Function to generate a random percentage value
function getRandomPercentage() {
  // Generate a random decimal between 0 and 1
  const randomDecimal = Math.random();
  // Multiply the random decimal by 100 to get a percentage
  const randomPercentage = randomDecimal * 100;
  // Return the random percentage rounded to two decimal places
  return randomPercentage.toFixed(2);
}

// Function to generate and store random percentages for luck parameters
function generateLuckStats() {
  const luckStats = {
    Happiness: getRandomPercentage(),
    Prosperity: getRandomPercentage(),
    Fortune: getRandomPercentage(),
    Serenity: getRandomPercentage(),
  };

  // Store luck stats in local storage
  localStorage.setItem("luckStats", JSON.stringify(luckStats));
}

// Function to retrieve luck stats from local storage
function getLuckStats() {
  // Get luck stats from local storage
  const luckStatsString = localStorage.getItem("luckStats");
  // Parse luck stats string to JSON
  const luckStats = JSON.parse(luckStatsString);
  // Return luck stats object
  return luckStats;
}

// Function to update the table with luck stats
function updateLuckTable() {
  const luckStats = getLuckStats();

  // Update the table cells with the new luck stats
  document.getElementById(
    "happines-percentage"
  ).textContent = `${luckStats.Happiness}%`;
  document.getElementById(
    "prosperity-percentage"
  ).textContent = `${luckStats.Prosperity}%`;
  document.getElementById(
    "fortune-percentage"
  ).textContent = `${luckStats.Fortune}%`;
  document.getElementById(
    "serenity-percentage"
  ).textContent = `${luckStats.Serenity}%`;

  document.getElementById("card").style.display = "flex";
}
