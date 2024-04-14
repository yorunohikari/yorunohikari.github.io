fetch('anime-list.json')
  .then(response => response.json())
  .then(jsonData => {
    // Process the JSON data for Dropped anime
    jsonData.Dropped.forEach(item => {
      appendAnimeRow(item, "dropped");
    });

    // Process the JSON data for Watching anime
    jsonData.Watching.forEach(item => {
      appendAnimeRow(item, "watching");
    });

    // Process the JSON data for On-Hold anime
    jsonData["On-Hold"].forEach(item => {
      appendAnimeRow(item, "on-hold");
    });

    // Process the JSON data for Completed anime
    jsonData.Completed.forEach(item => {
      appendAnimeRow(item, "completed");
    });
  })
  .catch(error => console.error('Error fetching JSON:', error));

// Function to append a row to the specified table with anime data
function appendAnimeRow(item, tableId) {
  const row = document.createElement("tr");
  const cell = document.createElement("td");

  const link = document.createElement("a");
  link.textContent = item.name;
  link.href = item.link;
  link.target = "_blank"; // Open link in a new tab

  cell.appendChild(link);
  row.appendChild(cell);

  document.getElementById(tableId).appendChild(row);
}

// Set the initial time in seconds (5 minutes)
let countdownTime = 300;

// Function to format the time in MM:SS format
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to start the countdown
function startCountdown() {
  // Update the timer display every second
  const countdown = setInterval(() => {
    countdownTime--;

    // Display the remaining time in the console (since we don't want a visible timer element)
    console.log(`Remaining time: ${formatTime(countdownTime)}`);

    // If the timer reaches zero, initiate self-destruct
    if (countdownTime === 0) {
      clearInterval(countdown);
      selfDestruct();
    }
  }, 1000);
}

// Function to self-destruct the page
function selfDestruct() {
  const countdownPopup = document.createElement('div');
  countdownPopup.style.position = 'fixed';
  countdownPopup.style.top = '50%';
  countdownPopup.style.left = '50%';
  countdownPopup.style.transform = 'translate(-50%, -50%)';
  countdownPopup.style.backgroundColor = 'black';
  countdownPopup.style.color = 'white';
  countdownPopup.style.padding = '20px';
  countdownPopup.style.zIndex = '9999';

  document.body.appendChild(countdownPopup);

  let countdownValue = 5;
  const countdownInterval = setInterval(() => {
    countdownPopup.textContent = `Self-destruct in ${countdownValue}`;
    countdownValue--;

    if (countdownValue === 0) {
      clearInterval(countdownInterval);
      removeContentLineByLine();
    }
  }, 1000);
}

// Function to remove the page content line by line from bottom to top
function removeContentLineByLine() {
  const content = document.body.innerHTML.split('<tr>');
  const interval = setInterval(() => {
    if (content.length > 0) {
      content.pop();
      document.body.innerHTML = content.join('<tr>');
    } else {
      clearInterval(interval);
    }
  }, 50);
}

// Start the countdown when the page loads
window.onload = startCountdown;