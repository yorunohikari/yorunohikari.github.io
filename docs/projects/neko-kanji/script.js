const quizData = {
    N5: [],
    N4: [],
    N3: [],
    N2: [],
    N1: [],
};

let currentQuestion = 0;
let score = 0;
let incorrectAttempts = 0;
let selectedLevel;
let quizStartTime;
let incorrectCount = 0;
let totalQuestionsInput = document.getElementById("question-count");
let totalQuestions = parseInt(totalQuestionsInput.value);
let unansweredQuestions = [];
let isTransitioning = false;
let isTimeAttackMode = false;
let timeLimit = 0;
let timerId;
let countdownElement = document.getElementById("countdown-timer");

window.onload = function () {
    document.getElementById("quiz-container").style.display = "none";
    LoadScoreHistory();
};

function fetchQuizData(level) {
    const jsonUrl = `${level}kan.json`;
    return fetch(jsonUrl)
        .then((response) => response.json())
        .then((data) => {
            shuffleArray(data);
            return data;
        })
        .catch((error) => console.error(`Error fetching ${level} JSON:`, error));
}

function saveUserPreferences() {
    const totalQuestionsInput = document.getElementById("question-count");
    const selectedLevel = document.getElementById("jlpt-level").value;
    sessionStorage.setItem("numQuestions", totalQuestionsInput.value);
    sessionStorage.setItem("selectedLevel", selectedLevel);
}

function getUserPreferences() {
    const numQuestions = sessionStorage.getItem("numQuestions");
    const selectedLevel = sessionStorage.getItem("selectedLevel");
    return { numQuestions, selectedLevel };
}

function startQuiz() {
    document.getElementById("loading-animation").style.display = "block";
    selectedLevel = document.getElementById("jlpt-level").value;
    includeHints = document.getElementById("hint-checkbox").checked;
    isTimeAttackMode = document.getElementById("time-attack-checkbox").checked;
    saveUserPreferences();

    if (isTimeAttackMode) {
        document.getElementById("progress-bar-container").style.display = "none";
        timeLimit = parseInt(document.getElementById("time-limit").value);
        document.getElementById("time-attack-options").style.display = "block";
        quizStartTime = new Date().getTime();
        startTimer();
    } else {
        document.getElementById("progress-bar-container").style.display = "block";
        totalQuestions = parseInt(document.getElementById("question-count").value);
    }

    fetchQuizData(selectedLevel).then((data) => {
        quizData[selectedLevel] = data;
        document.getElementById("main-menu").style.display = "none";
        document.getElementById("quiz-container").style.display = "block";
        document.getElementById("quiz-heading").textContent =
            selectedLevel + " Kanji Reading Quiz";
        if (isTimeAttackMode) {
            totalQuestions = quizData[selectedLevel].length;
            loadQuestion();
        } else {
            loadQuestion();
            quizStartTime = new Date().getTime();
        }
        document.getElementById("loading-animation").style.display = "none";
    });
}

function updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    console.log(progressPercentage);
}

function resetProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = "0%";
}

function startTimer() {
    timerId = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - quizStartTime) / 1000);
        const remainingSeconds = Math.max(0, timeLimit - elapsedSeconds);
        const timeRemaining = (timeLimit - elapsedSeconds) * 1000;
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        countdownElement.innerText = `Time Remaining: ${minutes}m ${seconds}s`;
        if (elapsedSeconds >= timeLimit) {
            endQuiz();
        }
    }, 1000);
}

function resetTimer() {
    clearTimeout(timerId);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadQuestion() {
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = `<p style="font-size: 24px;">${quizData[selectedLevel][currentQuestion].kanji}</p>`;
    const answerInput = document.getElementById("answer-input");
    answerInput.focus();
    if (isTimeAttackMode) {
        document.getElementById("countdown-timer").style.display = "block";
    } else {
        document.getElementById("countdown-timer").style.display = "none";
    }
}

function checkAnswer() {
    const userAnswer = document
        .getElementById("answer-input")
        .value.toLowerCase()
        .replace(/\s/g, "");
    if (isTransitioning) {
        return;
    }

    if (currentQuestion < totalQuestions) {
        const currentQuestionData = quizData[selectedLevel][currentQuestion];
        const correctReadings = quizData[selectedLevel][
            currentQuestion
        ].readings.map((reading) => reading.toLowerCase());
        const questionMeaning = currentQuestionData.meaning;
        if (userAnswer === "end") {
            endQuiz();
            return;
        }
        if (correctReadings.includes(userAnswer)) {
            score++;
            incorrectAttempts = 0;
            document.getElementById("feedback").innerHTML = `
        <span style="color: #90EE90;">Correct!</span>
        <br />
        Meaning: ${questionMeaning}`;
            document.getElementById("hint").innerHTML = ``;
            disableInput();
            setTimeout(() => {
                enableInput();
                nextQuestion();
            }, 1000);
            updateProgressBar();
        } else {
            incorrectAttempts++;
            incorrectCount++;
            if (incorrectAttempts === 3) {
                incorrectAttempts = 0;
                unansweredQuestions.push(currentQuestion);
                document.getElementById("feedback").innerHTML = `
            <span style="color: red;">Incorrect!</span> Correct answers:
            <span style="color: #90EE90;">${correctReadings.join(", ")}</span>
            <br />
            Meaning: ${questionMeaning}`;
                document.getElementById("hint").innerHTML = ` `;
                disableInput();
                setTimeout(() => {
                    enableInput();
                    nextQuestion();
                }, 1000);
                updateProgressBar();
            } else {
                document.getElementById(
                    "feedback"
                ).innerHTML = `<span style="color: red;">Incorrect!</span> Attempt ${incorrectAttempts}/3`;
                document.getElementById("hint").innerHTML = includeHints
                    ? `Hint : ${questionMeaning}`
                    : "";
            }
        }
    } else {
        endQuiz();
    }
}

function disableInput() {
    isTransitioning = true;
    document.getElementById("answer-input").disabled = true;
}

function enableInput() {
    isTransitioning = false;
    const answerInput = document.getElementById("answer-input");
    answerInput.disabled = false;
    answerInput.focus();
}

function nextQuestion() {
    document.getElementById("feedback").innerText = "";
    document.getElementById("answer-input").value = "";
    currentQuestion++;
    if (currentQuestion < totalQuestions) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

function saveQuizSessionData(date, mode, score, timeSpentOrLimit) {
    let quizSessions = JSON.parse(localStorage.getItem("quizSessions")) || [];
    quizSessions.push({
        date: date,
        level: selectedLevel,
        mode: mode,
        score: `${score}/${totalQuestions}`,
    });

    localStorage.setItem("quizSessions", JSON.stringify(quizSessions));
}

function endQuiz() {
    const quizEndTime = new Date().getTime();
    const timeSpentInSeconds = Math.floor((quizEndTime - quizStartTime) / 1000);
    const accuracy = (score / totalQuestions) * 100;
    let encouragementText = "頑張って";
    const currentDate = new Date();
    const formattedDate =
        ("0" + currentDate.getDate()).slice(-2) +
        "/" +
        ("0" + (currentDate.getMonth() + 1)).slice(-2) +
        "/" +
        currentDate.getFullYear() +
        " " +
        ("0" + currentDate.getHours()).slice(-2) +
        ":" +
        ("0" + currentDate.getMinutes()).slice(-2);
    date = formattedDate;
    mode = isTimeAttackMode ? "Time Attack" : "Regular";
    if (!isTimeAttackMode) {
        timeSpentOrLimit = `${timeSpentInSeconds} seconds`;
    } else {
        timeSpentOrLimit = `${timeLimit} seconds`;
    }
    saveQuizSessionData(date, mode, score, timeSpentOrLimit);
    getUserPreferences();
    if (accuracy === 100) {
        encouragementText = "You nailed every question. Great job!";
    } else if (accuracy >= 75) {
        encouragementText =
            "Great job! You have a solid understanding of the material.";
    } else if (accuracy >= 50) {
        encouragementText =
            "Good effort! Keep practicing to improve your knowledge.";
    } else {
        encouragementText = "Keep trying! Practice makes perfect.";
    }
    document.getElementById("main-menu").style.display = "block";
    document.getElementById("main-menu").innerHTML = `
      <h1>${encouragementText}</h1>
      <div>
        <img src="/assets/neko-pic.png" alt="Neko image" />
      </div>
      <p>Quiz Results</p>
      <table id="quiz-results">
        <tr>
          <td>Level Taken</td>
          <td>${selectedLevel}</td>
        </tr>
        <tr>
          <td>Your Score</td>
          <td>${score} ${isTimeAttackMode ? " " : "out of"} ${isTimeAttackMode ? " " : totalQuestions
        }</td>
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

    function updateInputsFromSavedValues() {
        const savedPreferences = getUserPreferences();
        const totalQuestionsInput = document.getElementById("question-count");
        const selectedLevelInput = document.getElementById("jlpt-level");
        totalQuestionsInput.value = savedPreferences.numQuestions;
        for (let i = 0; i < selectedLevelInput.options.length; i++) {
            if (
                selectedLevelInput.options[i].value === savedPreferences.selectedLevel
            ) {
                selectedLevelInput.selectedIndex = i;
                break;
            }
        }
    }

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

    resetProgressBar();
    resetQuiz();
    LoadScoreHistory();
    updateInputsFromSavedValues();
}

function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    incorrectAttempts = 0;
    incorrectCount = 0;
    unansweredQuestions = [];
    resetTimer();
    document.getElementById("feedback").innerText = "";
    document.getElementById("answer-input").value = "";
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("main-menu").style.display = "block";
    document.getElementById("countdown-timer").innerText = "";

    shuffleArray(quizData[selectedLevel]);
}

function copyToClipboard() {
    const unansweredTable = document.getElementById("unanswered-table");
    const rows = unansweredTable.querySelectorAll("tbody tr");
    const rowsText = Array.from(rows).map((row) => {
        const cells = Array.from(row.cells).map((cell) => cell.innerText);
        return cells.join("\t");
    });
    const textContent = rowsText.join("\n");
    const textarea = document.createElement("textarea");
    textarea.value = textContent;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

function toggleTimeAttackOptions() {
    const timeAttackOptions = document.getElementById("time-attack-options");
    const questionCountInput = document.getElementById("question-count");
    if (document.getElementById("time-attack-checkbox").checked) {
        timeAttackOptions.style.display = "block";
        questionCountInput.disabled = true;
    } else {
        timeAttackOptions.style.display = "none";
        questionCountInput.disabled = false;
    }
    console.log("hellow");
}

var modal = document.getElementById("myModal");
var mainMenu = document.getElementById("main-menu");

function openModal() {
    modal.style.display = "block";
    mainMenu.style.filter = "blur(2px)";
}

function closeModal() {
    modal.style.display = "none";
    mainMenu.style.filter = "blur(0px)";
}

var modal2 = document.getElementById("myModal2");
var mainMenu = document.getElementById("main-menu");

function openModal2() {
    modal2.style.display = "block";
    mainMenu.style.filter = "blur(2px)";
}

function closeModal2() {
    modal2.style.display = "none";
    mainMenu.style.filter = "blur(0px)";
}

window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
    if (event.target == modal2) {
        closeModal2();
    }
};

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
            console.error("Fullscreen request failed:", err);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function LoadScoreHistory() {
    const modal = document.getElementById("myModal2");
    const modalContent = modal.querySelector(".modal-content");
    modalContent.innerHTML = "";

    const quizSessionsString = localStorage.getItem("quizSessions");
    const quizSessions = JSON.parse(quizSessionsString) || [];

    if (quizSessions.length === 0) {
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
        headerDate.style.backgroundColor = "#00BFFF";
        headerDate.style.color = "#ffffff";
        const headerLevel = headerRow.insertCell();
        headerLevel.textContent = "Level";
        headerLevel.style.border = "1px solid #dddddd";
        headerLevel.style.padding = "8px";
        headerLevel.style.backgroundColor = "#00BFFF";
        headerLevel.style.color = "#ffffff";
        const headerMode = headerRow.insertCell();
        headerMode.textContent = "Mode";
        headerMode.style.border = "1px solid #dddddd";
        headerMode.style.padding = "8px";
        headerMode.style.backgroundColor = "#00BFFF";
        headerMode.style.color = "#ffffff";
        const headerScore = headerRow.insertCell();
        headerScore.textContent = "Score";
        headerScore.style.border = "1px solid #dddddd";
        headerScore.style.padding = "8px";
        headerScore.style.backgroundColor = "#00BFFF";
        headerScore.style.color = "#ffffff";
        quizSessions.forEach((entry) => {
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
