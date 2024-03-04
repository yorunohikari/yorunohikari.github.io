// Quiz Data
const quizData = {
    N5: [],
    N4: [],
    N3: [],
    N2: [],
    N1: [],
};

// Quiz Variables
let currentQuestion = 0; // Index of the current question being displayed
let score = 0; // Current score of the quiz
let incorrectAttempts = 0; // Number of incorrect attempts for the current question
let selectedLevel; // Selected JLPT level for the quiz
let quizStartTime; // Start time of the quiz
let incorrectCount = 0; // Total count of incorrect attempts throughout the quiz
let totalQuestionsInput = document.getElementById("question-count"); // Input field for total number of questions
let totalQuestions = parseInt(totalQuestionsInput.value); // Total number of questions in the quiz
let unansweredQuestions = []; // Array to store indices of unanswered questions
let isTransitioning = false; // Flag to indicate if the quiz is transitioning between questions
let isTimeAttackMode = false; // Flag to indicate if the quiz is in time attack mode
let timeLimit = 0; // Time limit for time attack mode
let timerId; // ID of the timer interval
let countdownElement = document.getElementById("countdown-timer"); // Element to display countdown timer


// Quiz Initialization
window.onload = function () {
    document.getElementById("quiz-container").style.display = "none";
    LoadScoreHistory();
};


// Fetch Quiz Data
function fetchQuizData(level) {
    const jsonUrl = `${level}kan.json`;
    // Fetch JSON data from the provided URL
    return fetch(jsonUrl)
        .then((response) => response.json()) // Parse JSON response
        .then((data) => {
            shuffleArray(data); // Shuffle the array of quiz data
            return data;
        })
        .catch((error) => console.error(`Error fetching ${level} JSON:`, error)); // Log any errors that occur
}

// Save user preferences to session storage
function saveUserPreferences() {
    const totalQuestionsInput = document.getElementById("question-count");
    const selectedLevel = document.getElementById("jlpt-level").value;
    sessionStorage.setItem('numQuestions', totalQuestionsInput.value);
    sessionStorage.setItem('selectedLevel', selectedLevel);
}

// Retrieve user preferences from session storage
function getUserPreferences() {
    const numQuestions = sessionStorage.getItem('numQuestions');
    const selectedLevel = sessionStorage.getItem('selectedLevel');
    return { numQuestions, selectedLevel };
}


// Start Quiz Function
function startQuiz() {
    document.getElementById("loading-animation").style.display = "block";
    // Get selected JLPT level from dropdown
    selectedLevel = document.getElementById("jlpt-level").value;
    // Check if hints are included
    includeHints = document.getElementById("hint-checkbox").checked;
    // Check if time attack mode is enabled
    isTimeAttackMode = document.getElementById("time-attack-checkbox").checked;
    saveUserPreferences()
    // Initialize quiz based on selected mode
    if (isTimeAttackMode) {
        // Hide progress bar container in time attack mode
        document.getElementById("progress-bar-container").style.display = "none";
        // Get time limit for time attack mode
        timeLimit = parseInt(document.getElementById("time-limit").value);
        // Show time attack options
        document.getElementById("time-attack-options").style.display = "block";
        // Record quiz start time for time attack mode
        quizStartTime = new Date().getTime();
        // Start timer for time attack mode
        startTimer();
    } else {
        // Show progress bar container in regular quiz mode
        document.getElementById("progress-bar-container").style.display = "block";
        // Get total number of questions for regular quiz mode
        totalQuestions = parseInt(document.getElementById("question-count").value);
    }
    // Fetch quiz data for the selected JLPT level
    fetchQuizData(selectedLevel).then((data) => {
        // Store fetched quiz data
        quizData[selectedLevel] = data;
        // Hide main menu
        document.getElementById("main-menu").style.display = "none";
        // Show quiz container
        document.getElementById("quiz-container").style.display = "block";
        // Set quiz heading based on selected level
        document.getElementById("quiz-heading").textContent =
            selectedLevel + " Kanji Reading Quiz";
        // Load the first question based on quiz mode
        if (isTimeAttackMode) {
            // Update total questions for time attack mode
            totalQuestions = quizData[selectedLevel].length;
            // Load the first question for time attack mode
            loadQuestion();
        } else {
            // Load the first question for regular quiz mode
            loadQuestion();
            // Record quiz start time for regular quiz mode
            quizStartTime = new Date().getTime();
        }
        // Hide loading animation after quiz initialization
        document.getElementById("loading-animation").style.display = "none";
    });
}


// Update Progress Bar Function
function updateProgressBar() {
    // Get the progress bar element
    const progressBar = document.getElementById("progress-bar");
    // Calculate the progress percentage based on current question and total questions
    const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
    // Set the width of the progress bar dynamically based on the calculated percentage
    progressBar.style.width = `${progressPercentage}%`;
    // Log the progress percentage to the console for debugging purposes
    console.log(progressPercentage);
}


// Reset Progress Bar Function
function resetProgressBar() {
    // Get the progress bar element
    const progressBar = document.getElementById("progress-bar");
    // Reset the width of the progress bar to 0%
    progressBar.style.width = "0%";
}


// Start Timer Function
function startTimer() {
    // Set up a timer that runs every second
    timerId = setInterval(() => {
        // Get the current time in milliseconds
        const currentTime = new Date().getTime();
        // Calculate elapsed seconds since the quiz started
        const elapsedSeconds = Math.floor((currentTime - quizStartTime) / 1000);
        // Calculate remaining seconds based on the time limit and elapsed seconds
        const remainingSeconds = Math.max(0, timeLimit - elapsedSeconds);
        // Calculate remaining time in milliseconds (not used in this code)
        const timeRemaining = (timeLimit - elapsedSeconds) * 1000;
        // Calculate remaining minutes and seconds
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        // Update the countdown element with the remaining time
        countdownElement.innerText = `Time Remaining: ${minutes}m ${seconds}s`;
        // Check if the elapsed time has reached the time limit, then end the quiz
        if (elapsedSeconds >= timeLimit) {
            endQuiz();
        }
    }, 1000); // Interval set to 1000 milliseconds (1 second)
}

// Reset Timer Function
function resetTimer() {
    // Clear the interval timer
    clearTimeout(timerId);
}


// Shuffle Array Function
function shuffleArray(array) {
    // Loop through the array starting from the end
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i (inclusive)
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements at index i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
}


// Load Question Function
function loadQuestion() {
    // Get the container element for displaying the question
    const questionContainer = document.getElementById("question-container");
    // Set the HTML content of the question container with the current question's kanji
    questionContainer.innerHTML = `<p style="font-size: 24px;">${quizData[selectedLevel][currentQuestion].kanji}</p>`;
    // Set focus on the answer input field for user interaction
    const answerInput = document.getElementById("answer-input");
    answerInput.focus();

    // Check if the quiz is in time attack mode
    if (isTimeAttackMode) {
        // If in time attack mode, display the countdown timer
        document.getElementById("countdown-timer").style.display = "block";
    } else {
        // If not in time attack mode, hide the countdown timer
        document.getElementById("countdown-timer").style.display = "none";
    }
}



// Check Answer Function
function checkAnswer() {
    // Get the user's answer from the input field and convert it to lowercase
    const userAnswer = document.getElementById("answer-input").value.toLowerCase().replace(/\s/g, '');
    // Check if the quiz is in a transitioning state (e.g., between questions)
    if (isTransitioning) {
        return; // Exit the function if transitioning
    }

    // Check if there are more questions to be answered
    if (currentQuestion < totalQuestions) {
        // Retrieve data for the current question
        const currentQuestionData = quizData[selectedLevel][currentQuestion];
        // Retrieve the correct readings for the current question and convert them to lowercase
        const correctReadings = quizData[selectedLevel][currentQuestion].readings.map((reading) => reading.toLowerCase());
        // Retrieve the meaning of the current question
        const questionMeaning = currentQuestionData.meaning;

        // Check if the user wants to end the quiz
        if (userAnswer === "end") {
            endQuiz(); // End the quiz
            return;
        }

        // Check if the user's answer is among the correct readings
        if (correctReadings.includes(userAnswer)) {
            // Increment the score and reset incorrect attempts
            score++;
            incorrectAttempts = 0;
            // Display feedback indicating correctness and the question's meaning
            document.getElementById("feedback").innerHTML = `
        <span style="color: green;">Correct!</span>
        <br />
        Meaning: ${questionMeaning}`;
            document.getElementById("hint").innerHTML = ``; // Clear any hint displayed
            disableInput(); // Disable input temporarily
            // After a brief delay, enable input and move to the next question
            setTimeout(() => {
                enableInput();
                nextQuestion();
            }, 1000);
            updateProgressBar(); // Update the progress bar
        } else {
            // Increment incorrect attempts and incorrect count
            incorrectAttempts++;
            incorrectCount++;

            // Check if the user has reached the maximum incorrect attempts
            if (incorrectAttempts === 3) {
                incorrectAttempts = 0; // Reset incorrect attempts
                unansweredQuestions.push(currentQuestion); // Add the unanswered question index to the list

                // Display feedback indicating incorrectness, correct answers, and the question's meaning
                document.getElementById("feedback").innerHTML = `
            <span style="color: red;">Incorrect!</span> Correct answers: 
            <span style="color: green;">${correctReadings.join(", ")}</span>
            <br />
            Meaning: ${questionMeaning}`;
                document.getElementById("hint").innerHTML = ` `; // Clear any hint displayed
                disableInput(); // Disable input temporarily

                // After a brief delay, enable input and move to the next question
                setTimeout(() => {
                    enableInput();
                    nextQuestion();
                }, 1000);
                updateProgressBar(); // Update the progress bar
            } else {
                // Display feedback indicating incorrectness and the number of attempts
                document.getElementById("feedback").innerHTML = `<span style="color: red;">Incorrect!</span> Attempt ${incorrectAttempts}/3`;
                // Display a hint if enabled, showing the question's meaning
                document.getElementById("hint").innerHTML = includeHints
                    ? `Hint : ${questionMeaning}`
                    : '';
            }
        }
    } else {
        endQuiz(); // End the quiz if all questions have been answered
    }
}


// Function to disable input during transitions
function disableInput() {
    // Set transitioning flag to true
    isTransitioning = true;
    // Disable the answer input field
    document.getElementById("answer-input").disabled = true;
}


// Function to enable input after transitions
function enableInput() {
    // Set transitioning flag to false
    isTransitioning = false;
    // Enable the answer input field and focus on it
    const answerInput = document.getElementById("answer-input");
    answerInput.disabled = false;
    answerInput.focus();
}


// Function to move to the next question
function nextQuestion() {
    // Clear feedback and user's answer input
    document.getElementById("feedback").innerText = "";
    document.getElementById("answer-input").value = "";
    // Move to the next question index
    currentQuestion++;
    // Check if there are more questions remaining
    if (currentQuestion < totalQuestions) {
        loadQuestion(); // Load the next question
    } else {
        endQuiz(); // End the quiz if all questions have been answered
    }
}

function saveQuizSessionData(date, mode, score, timeSpentOrLimit) {
    // Retrieve existing data from local storage or initialize an empty array
    let quizSessions = JSON.parse(localStorage.getItem('quizSessions')) || [];

    // Add the current quiz session data to the array
    quizSessions.push({
        date: date,
        level: selectedLevel,
        mode: mode,
        score: `${score}/${totalQuestions}`
    });

    // Store the updated array back to local storage
    localStorage.setItem('quizSessions', JSON.stringify(quizSessions));
}


// Function to end the quiz and display results
function endQuiz() {
    // Get the end time of the quiz
    const quizEndTime = new Date().getTime();
    // Calculate time spent in seconds
    const timeSpentInSeconds = Math.floor((quizEndTime - quizStartTime) / 1000);
    // Calculate accuracy percentage
    const accuracy = (score / totalQuestions) * 100;
    // Initialize encouragement text
    let encouragementText = "頑張って";
    // Get the current date and time

    const currentDate = new Date();

    // Format the date to "DD/MM/YYYY HH:MM"
    const formattedDate =
        ("0" + currentDate.getDate()).slice(-2) + "/" +
        ("0" + (currentDate.getMonth() + 1)).slice(-2) + "/" +
        currentDate.getFullYear() + " " +
        ("0" + currentDate.getHours()).slice(-2) + ":" +
        ("0" + currentDate.getMinutes()).slice(-2);

    // Use the formatted date
    date = formattedDate;

    // Determine the mode
    mode = isTimeAttackMode ? "Time Attack" : "Regular";

    // Score should be updated during the quiz session based on the user's performance

    // For Regular mode, use time spent
    if (!isTimeAttackMode) {
        timeSpentOrLimit = `${timeSpentInSeconds} seconds`;
    } else {
        // For Time Attack mode, use the time limit
        timeSpentOrLimit = `${timeLimit} seconds`;
    }
    saveQuizSessionData(date, mode, score, timeSpentOrLimit);
    getUserPreferences()


    // Determine encouragement text based on accuracy
    if (accuracy === 100) {
        encouragementText = "You nailed every question. Great job!";
    } else if (accuracy >= 75) {
        encouragementText = "Great job! You have a solid understanding of the material.";
    } else if (accuracy >= 50) {
        encouragementText = "Good effort! Keep practicing to improve your knowledge.";
    } else {
        encouragementText = "Keep trying! Practice makes perfect.";
    }

    // Display main menu and quiz results
    document.getElementById("main-menu").style.display = "block";
    document.getElementById("main-menu").innerHTML = `
      <h1>${encouragementText}</h1>
      <div>
        <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhP0jUqq7HmUZGERn2xVb2mHC1Mj9ldwwt1V3YwMktthenB3arJaFT8jZKosRrxPqXDc-MEjveMZlieKldTfWlR_-O8HEH5U5PtFIoqg9oGX9zI0Nc8w4HAeszoBVkR73VHJOJryf7IqlysXIqSkmdCHaiFDoWjrACaxhETJ6jf_MaHalnwmA8tZoJiv-A/s2048/Neko%20without%20background.png" alt="Neko image" />
      </div>
      <p>Quiz Results</p>
      <table id="quiz-results">
        <tr>
          <td>Level Taken</td>
          <td>${selectedLevel}</td>
        </tr>
        <tr>
          <td>Your Score</td>
          <td>${score} ${isTimeAttackMode ? " " : "out of"} ${isTimeAttackMode ? " " : totalQuestions}</td>
        </tr>
        <tr>
          <td>Incorrect Attempts</td>
          <td>${incorrectCount}</td>
        </tr>
        <tr>
          <td>${isTimeAttackMode ? "Time Limit" : "Time Spent"} </td>
          <td>${timeSpentInSeconds} seconds</td>
        </tr>
      </table>
      <label for="question-count">Number of Questions:</label>
      <div class="numberlabel">
        <input type="number" id="question-count" min="1"/>
        <select id="jlpt-level">
          <option value="N5">N5</option>
          <option value="N4">N4</option>
          <option value="N3">N3</option>
          <option value="N2">N2</option>
          <option value="N1">N1</option>
          <!-- Add other JLPT levels as needed -->
        </select>
      </div>
      <div class="label-hint">
        <!-- Include Hints checkbox -->
        <div class="checkbox-wrapper-4">
          <input class="inp-cbx" id="hint-checkbox" type="checkbox" />
          <label class="cbx" for="hint-checkbox">
            <span>
              <svg width="12px" height="10px">
                <use xlink:href="#check-4"></use>
              </svg>
            </span>
            <span>Include Hints</span>
          </label>
          <svg class="inline-svg">
            <symbol id="check-4" viewbox="0 0 12 10">
              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
            </symbol>
          </svg>
        </div>
        <!-- Time Attack Mode checkbox -->
        <div class="checkbox-wrapper-4">
          <input class="inp-cbx" id="time-attack-checkbox" type="checkbox" onchange="toggleTimeAttackOptions()" />
          <label class="cbx" for="time-attack-checkbox">
            <span>
              <svg width="12px" height="10px">
                <use xlink:href="#check-4"></use>
              </svg>
            </span>
            <span>Time Attack Mode</span>
          </label>
          <svg class="inline-svg">
            <symbol id="check-4" viewbox="0 0 12 10">
              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
            </symbol>
          </svg>
        </div>
      </div>
      <!-- Time Attack options -->
      <div class="timeattack">
        <div id="time-attack-options" style="display: none;">
          <label for="time-limit">Time Limit:</label>
          <select id="time-limit">
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="120">2 minutes</option>
            <option value="300">5 minutes</option>
          </select>
        </div>
      </div>
      <!-- Help link -->
      <div class="help">
        <a href="#" onclick="openModal()" style="color: #1877f2; cursor: pointer;">Help</a>
      </div>
      <div class="score-history">
        <a href="#" onclick="openModal2()" style="color: #1877f2; cursor: pointer;">Score History</a>
      </div>
      <!-- Start Quiz button -->
      <div class="input-group">
        <button class="button-19" onclick="startQuiz()">Start Quiz</button>
      </div>
  `;

    // Function to update inputs from saved values
    function updateInputsFromSavedValues() {
        const savedPreferences = getUserPreferences();
        const totalQuestionsInput = document.getElementById("question-count");
        const selectedLevelInput = document.getElementById("jlpt-level");

        // Set the value of the total questions input
        totalQuestionsInput.value = savedPreferences.numQuestions;

        // Loop through options to find and set the selected level
        for (let i = 0; i < selectedLevelInput.options.length; i++) {
            if (selectedLevelInput.options[i].value === savedPreferences.selectedLevel) {
                selectedLevelInput.selectedIndex = i;
                break;
            }
        }
    }


    // Display unanswered questions if any
    if (unansweredQuestions.length > 0) {
        const unansweredList = unansweredQuestions.map((index, rowIndex) => {
            const question = quizData[selectedLevel][index];
            const rowColor = rowIndex % 2 === 0 ? "#f2f2f2" : "#ffffff";

            return `
          <tr style="background-color: ${rowColor};">
            <td>${question.kanji}</td>
            <td>${question.readings.join(", ")}</td>
            <td>${question.meaning}</td>
          </tr>
      `;
        });

        // Append unanswered questions to the main menu
        document.getElementById("main-menu").innerHTML += `
        <div id="unanswered-container">
          <div id="lb-unanswered-container">
            <p>Unanswered Questions:</p>
          </div>
          <table id="unanswered-table" style="width: 100%; border-collapse: collapse; margin: 0 auto; border-radius: 8px">
            <thead>
              <tr style="background-color: #00BFFF; color: white;">
                <th style="border: 1px solid #dddddd; padding: 8px; width: 30%;">Kanji</th>
                <th style="border: 1px solid #dddddd; padding: 8px;">Readings</th>
                <th style="border: 1px solid #dddddd; padding: 8px;">Meaning</th>
              </tr>
            </thead>
            <tbody>${unansweredList.join("")}</tbody>
          </table>
        </div>
        <!-- Copy to Clipboard button -->
      <button class="button-19" id="copy-button" onclick="copyToClipboard()">Copy to Clipboard</button>
    `;
    }

    // Reset quiz parameters
    resetQuiz();
    LoadScoreHistory();
    updateInputsFromSavedValues()
}


// Function to reset quiz parameters and UI
function resetQuiz() {
    // Reset quiz parameters
    currentQuestion = 0;
    score = 0;
    incorrectAttempts = 0;
    incorrectCount = 0;
    unansweredQuestions = [];
    resetTimer();

    // Reset UI elements
    document.getElementById("feedback").innerText = "";
    document.getElementById("answer-input").value = "";
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("main-menu").style.display = "block";
    document.getElementById("countdown-timer").innerText = "";

    // Shuffle quiz data for a new quiz session
    shuffleArray(quizData[selectedLevel]);
}


// Function to copy the contents of the unanswered questions table to the clipboard
function copyToClipboard() {
    // Select the unanswered questions table
    const unansweredTable = document.getElementById("unanswered-table");
    // Select all rows in the table body
    const rows = unansweredTable.querySelectorAll("tbody tr");

    // Convert table rows into text format
    const rowsText = Array.from(rows).map((row) => {
        // Convert each cell in the row into text and join them with tab character
        const cells = Array.from(row.cells).map((cell) => cell.innerText);
        return cells.join("\t");
    });

    // Join row texts with newline character to form a complete text content
    const textContent = rowsText.join("\n");

    // Create a temporary textarea element to hold the text content
    const textarea = document.createElement("textarea");
    // Set the textarea value to the text content
    textarea.value = textContent;
    // Append the textarea to the document body
    document.body.appendChild(textarea);
    // Select the textarea content
    textarea.select();
    // Execute the copy command
    document.execCommand("copy");
    // Remove the textarea element from the document
    document.body.removeChild(textarea);
}


// Function to toggle the display of time attack options based on checkbox state
function toggleTimeAttackOptions() {
    // Select the time attack options container
    const timeAttackOptions = document.getElementById("time-attack-options");
    // Select the question count input element
    const questionCountInput = document.getElementById("question-count");

    // Check if the time attack checkbox is checked
    if (document.getElementById("time-attack-checkbox").checked) {
        // If checked, display the time attack options and disable the question count input
        timeAttackOptions.style.display = "block";
        questionCountInput.disabled = true;
    } else {
        // If not checked, hide the time attack options and enable the question count input
        timeAttackOptions.style.display = "none";
        questionCountInput.disabled = false;
    }
    console.log('hellow')
}


// Variables to store references to the modal and main menu elements
var modal = document.getElementById("myModal");
var mainMenu = document.getElementById("main-menu");

// Function to open the modal and apply blur effect to the main menu
function openModal() {
    modal.style.display = "block";
    mainMenu.style.filter = "blur(2px)";
}

// Function to close the modal and remove blur effect from the main menu
function closeModal() {
    modal.style.display = "none";
    mainMenu.style.filter = "blur(0px)";
}

var modal2 = document.getElementById("myModal2");
var mainMenu = document.getElementById("main-menu");

// Function to open the modal and apply blur effect to the main menu
function openModal2() {
    modal2.style.display = "block";
    mainMenu.style.filter = "blur(2px)";
}

// Function to close the modal and remove blur effect from the main menu
function closeModal2() {
    modal2.style.display = "none";
    mainMenu.style.filter = "blur(0px)";
}

// Event listener to close the modal when clicking outside of it and remove blur effect
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
    if (event.target == modal2) {
        closeModal2();
    }
};


// Function to toggle fullscreen mode
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // If not in fullscreen, request fullscreen mode
        document.documentElement.requestFullscreen().catch(err => {
            console.error('Fullscreen request failed:', err);
        });
    } else {
        // If already in fullscreen, exit fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function LoadScoreHistory() {
    const modal = document.getElementById("myModal2");
    const modalContent = modal.querySelector(".modal-content");
    modalContent.innerHTML = '';

    // Get the score history from local storage
    const quizSessionsString = localStorage.getItem("quizSessions");
    const quizSessions = JSON.parse(quizSessionsString) || [];

    if (quizSessions.length === 0) {
        // If there are no quiz sessions, display message
        modalContent.innerHTML = `
            <span class="close" onclick="closeModal2()">&times;</span>
            <div class="resetstorage">
                <button class="button-19" id="reset-storage-button" onclick="resetStoredData()">Reset Data</button>
            </div>
            <p style="text-align: center;">There is no score history available.</p>`;
    } else {
        const closeButton = document.createElement("span");
        closeButton.classList.add("close");
        closeButton.innerHTML = "&times;";
        closeButton.onclick = function () {
            closeModal2();
        };
        modalContent.appendChild(closeButton);
        // Create reset button
        const resetButtonContainer = document.createElement("div");
        resetButtonContainer.classList.add("resetstorage");
        const resetButton = document.createElement("button");
        resetButton.classList.add("button-19");
        resetButton.setAttribute("id", "reset-storage-button");
        resetButton.textContent = "Reset Data";
        resetButton.onclick = function () {
            resetStoredData();
        };
        resetButtonContainer.appendChild(resetButton);
        modalContent.appendChild(resetButtonContainer);
        const table = document.createElement("table");
        table.classList.add("score-history-table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.margin = "20px auto";
        table.style.borderRadius = "8px";
        table.style.backgroundColor = "#ffffff";
        table.style.color = "#000000";

        const headerRow = table.insertRow();
        const headerDate = headerRow.insertCell();
        headerDate.textContent = "Date";
        headerDate.style.border = "1px solid #dddddd";
        headerDate.style.padding = "8px";
        headerDate.style.backgroundColor = "#00BFFF"; // Background color
        headerDate.style.color = "#ffffff"; // Text color
        const headerLevel = headerRow.insertCell();
        headerLevel.textContent = "Level";
        headerLevel.style.border = "1px solid #dddddd";
        headerLevel.style.padding = "8px";
        headerLevel.style.backgroundColor = "#00BFFF"; // Background color
        headerLevel.style.color = "#ffffff"; // Text color
        const headerMode = headerRow.insertCell();
        headerMode.textContent = "Mode";
        headerMode.style.border = "1px solid #dddddd";
        headerMode.style.padding = "8px";
        headerMode.style.backgroundColor = "#00BFFF"; // Background color
        headerMode.style.color = "#ffffff"; // Text color
        const headerScore = headerRow.insertCell();
        headerScore.textContent = "Score";
        headerScore.style.border = "1px solid #dddddd";
        headerScore.style.padding = "8px";
        headerScore.style.backgroundColor = "#00BFFF"; // Background color
        headerScore.style.color = "#ffffff"; // Text color

        quizSessions.forEach(entry => {
            const row = table.insertRow();
            const cellDate = row.insertCell();
            cellDate.textContent = entry.date;
            cellDate.style.border = "1px solid #dddddd";
            cellDate.style.padding = "8px";
            const cellLevel = row.insertCell();
            cellLevel.textContent = entry.level;
            cellLevel.style.border = "1px solid #dddddd";
            cellLevel.style.padding = "8px";
            const cellMode = row.insertCell();
            cellMode.textContent = entry.mode;
            cellMode.style.border = "1px solid #dddddd";
            cellMode.style.padding = "8px";
            const cellScore = row.insertCell();
            cellScore.textContent = entry.score;
            cellScore.style.border = "1px solid #dddddd";
            cellScore.style.padding = "8px";
        });

        modalContent.appendChild(table);
    }
}


function resetStoredData() {
    localStorage.clear();
    const modal = document.getElementById("myModal2");
    const modalContent = modal.querySelector(".modal-content");
    modalContent.innerHTML = `
    <span class="close" onclick="closeModal2()">&times;</span>
    <div class="resetstorage">
      <button class="button-19" id="reset-storage-button" onclick="resetStoredData()">Reset Data</button>
    </div>
    <p style="text-align: center;">There is no score history available.</p>`;
}
