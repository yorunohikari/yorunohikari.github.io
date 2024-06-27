class Question {
  constructor(number, questionText, options, answer, answerText) {
    this.number = number;
    this.questionText = questionText;
    this.options = options;
    this.answer = answer;
    this.answerText = answerText;
  }

  getFormattedQuestion() {
    return this.questionText.replace("B「", "<br>B「");
  }

  isCorrect(selectedOption) {
    return parseInt(selectedOption, 10) === this.answer;
  }

  getCorrectOptionText() {
    return this.options.find(option => option[this.answer])[this.answer];
  }
}

class Quiz {
  constructor(questionsPerDay) {
    this.quizData = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.questionsPerDay = questionsPerDay;
    this.selectedQuestions = [];
    this.wrongAnswers = [];
    this.questionTimes = []; // To store time taken for each question
    this.startTime = null;
  }

  async loadQuizData() {
    try {
      const response = await fetch('quizData.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      this.quizData = data.questions.map(
        q => new Question(q.number, q.question, q.options, q.answer, q.answer_text)
      );
      this.startQuiz();
    } catch (error) {
      console.error('Error loading quiz data:', error);
      alert('Failed to load quiz data. Please try again later.');
    }
  }

  startQuiz() {
    this.resetQuiz();
    this.selectQuestions();
    this.loadQuestion();
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.selectedQuestions = [];
    this.wrongAnswers = [];
    this.questionTimes = [];
    localStorage.removeItem("wrongAnswers");
    document.getElementById("score").innerText = this.score;
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("summary-container").style.display = "none";
    this.resetProgressBar();
  }

  selectQuestions() {
    const selectedSet = new Set();
    while (selectedSet.size < this.questionsPerDay) {
      const randomIndex = Math.floor(Math.random() * this.quizData.length);
      selectedSet.add(this.quizData[randomIndex]);
    }
    this.selectedQuestions = Array.from(selectedSet);
  }

  loadQuestion() {
    const currentQuestion = this.selectedQuestions[this.currentQuestionIndex];
    this.startTime = Date.now(); // Start timing the question

    document.getElementById("question-text").innerHTML = currentQuestion.getFormattedQuestion();
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach(optionObj => {
      const key = Object.keys(optionObj)[0];
      const value = optionObj[key];
      const option = document.createElement("div");
      option.classList.add("option");
      option.innerText = value;
      option.dataset.optionKey = key;
      option.addEventListener("click", () => this.selectOption(key));
      optionsContainer.appendChild(option);
    });

    this.updateProgressBar();
  }

  selectOption(selectedOption) {
    const timeTaken = (Date.now() - this.startTime) / 1000; // Calculate time taken
    const currentQuestion = this.selectedQuestions[this.currentQuestionIndex];
    const isCorrect = currentQuestion.isCorrect(selectedOption);
    const selectedOptionElement = document.querySelector(`.option[data-option-key="${selectedOption}"]`);
    const selectedText = currentQuestion.options.find(option => option[selectedOption])[selectedOption];
    const correctText = currentQuestion.answerText;

    this.questionTimes.push({
      question: currentQuestion.questionText,
      timeTaken: timeTaken,
      correct: isCorrect,
      selectedAnswer: selectedText,
      correctAnswer: correctText
    });

    if (isCorrect) {
      selectedOptionElement.classList.add('correct');
      this.score++;
    } else {
      selectedOptionElement.classList.add('incorrect');
      document.querySelector(`.option[data-option-key="${currentQuestion.answer}"]`).classList.add('correct');
      this.wrongAnswers.push({
        question: currentQuestion.questionText,
        yourAnswer: selectedText,
        correctAnswer: correctText
      });
    }

    this.disableOptions();

    this.updateScore();
    setTimeout(() => {
      this.enableOptions();
      this.nextQuestion();
    }, 1000);
  }

  disableOptions() {
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
      option.classList.add('disabled');
      option.style.pointerEvents = 'none';
    });
  }

  enableOptions() {
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
      option.classList.remove('disabled');
      option.style.pointerEvents = 'auto';
    });
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questionsPerDay - 1) {
      this.currentQuestionIndex++;
      this.loadQuestion();
    } else {
      this.saveScore();
      this.showSummary();
    }
  }

  updateScore() {
    document.getElementById("score").innerText = this.score;
  }

  showSummary() {
    const summaryContainer = document.getElementById('summary-list');
    summaryContainer.innerHTML = '';

    this.questionTimes.forEach((q, index) => {
      const questionCard = document.createElement('div');
      questionCard.classList.add('summary-card');

      const questionText = document.createElement('div');
      questionText.classList.add('question-text');
      questionText.innerHTML = `<strong>Question ${index + 1}:</strong> ${q.question}`;

      const correctnessText = document.createElement('div');
      correctnessText.classList.add('correctness-text');
      correctnessText.innerHTML = q.correct ? '<span style="color:#00c200">Correct</span>' : '<span style="color:red">Incorrect</span>';

      const answerText = document.createElement('div');
      answerText.classList.add('answer-text');
      answerText.innerHTML = `Your Answer: ${q.selectedAnswer} <br> Correct Answer: ${q.correctAnswer}`;

      const timeTakenText = document.createElement('div');
      timeTakenText.classList.add('time-taken-text');
      timeTakenText.innerHTML = `Time Taken: ${q.timeTaken.toFixed(2)} seconds`;

      questionCard.appendChild(questionText);
      questionCard.appendChild(correctnessText);
      questionCard.appendChild(answerText);
      questionCard.appendChild(timeTakenText);

      summaryContainer.appendChild(questionCard);
    });

    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('summary-container').style.display = 'block';
    document.getElementById('final-score').innerText = this.score;
  }

  resetProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = '0%';
  }

  updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = ((this.currentQuestionIndex + 0) / this.questionsPerDay) * 100;
    progressBar.style.width = `${progressPercentage}%`;
  }

  saveScore() {
    const datetime = formatDateTime(new Date());
    const history = JSON.parse(localStorage.getItem('scoreHistory')) || [];
    history.push({
      datetime: datetime,
      questions: this.questionsPerDay,
      score: this.score
    });
    localStorage.setItem('scoreHistory', JSON.stringify(history));

    // Update weekly goals progress
    if (window.weeklyGoals) {
      window.weeklyGoals.incrementProgress(this.score);
      if (window.weeklyGoals.completed === window.weeklyGoals.target) {
        alert('Congratulations! You have met your weekly goal!');
      }
    }
  }

}

class UI {
  static toggleFullscreen() {
    if (!document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else {
        alert('Your browser does not support full-screen mode');
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  static showMenu() {
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('settings-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('history-container').style.display = 'none';
    document.getElementById('summary-container').style.display = 'none';
  }

  static showSettings() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('settings-container').style.display = 'block';
  }

  static saveSettings() {
    const questionsCount = document.getElementById('questions-count').value;
    localStorage.setItem('questionsCount', questionsCount);
  }

  static resetHistory() {
    if (confirm('Are you sure you want to reset the score history?')) {
      localStorage.removeItem('scoreHistory');
      alert('Score history has been reset.');
      UI.viewHistory(); 
    }
  }

  static viewHistory(page = 1) {
    const historyTableBody = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('scoreHistory')) || [];
    const itemsPerPage = 5;

    history.sort((a, b) => {
      const dateA = parseDateTime(a.datetime);
      const dateB = parseDateTime(b.datetime);
      return dateB - dateA;
    });

    const totalPages = Math.ceil(history.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    historyTableBody.innerHTML = '';

    history.slice(start, end).forEach(entry => {
      const row = document.createElement('tr');
      const dateCell = document.createElement('td');
      const questionsCell = document.createElement('td');
      const scoreCell = document.createElement('td');

      dateCell.textContent = entry.datetime || 'N/A';
      questionsCell.textContent = entry.questions;
      scoreCell.textContent = entry.score;

      row.appendChild(dateCell);
      row.appendChild(questionsCell);
      row.appendChild(scoreCell);
      historyTableBody.appendChild(row);
    });

    const paginationControls = document.getElementById('pagination-controls');
    paginationControls.innerHTML = '';

    // Limit to show at most 4 pages
    const maxPagesToShow = 4;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Add « and ‹ if not on the first page
    if (page > 1) {
      const firstButton = document.createElement('button');
      firstButton.textContent = '«';
      firstButton.addEventListener('click', () => UI.viewHistory(1));
      paginationControls.appendChild(firstButton);

      const prevButton = document.createElement('button');
      prevButton.textContent = '‹';
      prevButton.addEventListener('click', () => UI.viewHistory(page - 1));
      paginationControls.appendChild(prevButton);
    }

    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.disabled = i === page;
      button.addEventListener('click', () => UI.viewHistory(i));
      paginationControls.appendChild(button);
    }

    // Add › and » if not on the last page
    if (page < totalPages) {
      const nextButton = document.createElement('button');
      nextButton.textContent = '›';
      nextButton.addEventListener('click', () => UI.viewHistory(page + 1));
      paginationControls.appendChild(nextButton);

      const lastButton = document.createElement('button');
      lastButton.textContent = '»';
      lastButton.addEventListener('click', () => UI.viewHistory(totalPages));
      paginationControls.appendChild(lastButton);
    }

    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('history-container').style.display = 'block';

    drawChart(history);
    updateStats(history); // Call updateStats here
    updateUI();
  }


  static restartQuiz(quiz) {
    quiz.resetQuiz();
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('summary-container').style.display = 'none';
  }
}

// Utility Functions

function exportData() {
  const data = {
    weeklyGoals: localStorage.getItem('weeklyGoals'),
    qCount: localStorage.getItem('questionsCount'),
    history: localStorage.getItem('scoreHistory'),
  };
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = 'progress_data.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    try {
      const data = JSON.parse(content);
      if (data.weeklyGoals) {
        localStorage.setItem('weeklyGoals', data.weeklyGoals);
      }
      if (data.qCount) {
        localStorage.setItem('questionsCount', data.qCount);
      }
      if (data.history) {
        localStorage.setItem('scoreHistory', data.history);
      }
      alert('Data imported successfully.');
      location.reload(); // Refresh the page to apply imported data
    } catch (error) {
      alert('Failed to import data. Invalid file format.');
    }
  };
  reader.readAsText(file);
}


function updateStats(history) {
  const totalQuestions = history.reduce((total, entry) => total + entry.questions, 0);
  const correctAnswers = history.reduce((total, entry) => total + entry.score, 0);
  const accuracy = history.length > 0 ? (correctAnswers / totalQuestions * 100).toFixed(2) : 0;

  // Calculate day streak
  let dayStreak = 0;
  if (history.length > 0) {
    const uniqueDays = new Set(history.map(entry => moment(entry.datetime, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD")));
    const today = moment().startOf('day');
    let currentStreak = 0;
    let previousDate = today.clone().add(1, 'day'); // A day after today to handle streak start

    for (let date of uniqueDays) {
      let currentDate = moment(date);
      if (currentDate.isSame(previousDate, 'day')) {
        currentStreak++;
      } else {
        dayStreak = Math.max(dayStreak, currentStreak);
        currentStreak = 1;
      }
      previousDate = currentDate.clone().subtract(1, 'day');
    }
    dayStreak = Math.max(dayStreak, currentStreak); // Update the final streak value
  }

  // Update the stats table
  document.getElementById('total-questions').textContent = totalQuestions;
  document.getElementById('accuracy').textContent = `${accuracy}%`;
  document.getElementById('day-streak').textContent = dayStreak;
}

function parseDateTime(datetimeStr) {
  if (!datetimeStr) {
    return new Date();
  }

  const [datePart, timePart] = datetimeStr.split(' ');
  if (!datePart || !timePart) {
    return new Date();
  }

  const [day, month, year] = datePart.split('/');
  const [hours, minutes, seconds] = timePart.split(':');
  return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
}

function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function drawChart(history) {
  const ctx = document.getElementById("scoreChart").getContext("2d");
  const dates = history.map((entry) =>
    moment(entry.datetime, "DD/MM/YYYY").format("MMM DD")
  ).reverse();
  const scores = history.map((entry) => entry.score).reverse();

  // Extract the year from the first and last entries in the history
  const startYear = moment(history[0].datetime, "DD/MM/YYYY").format("YYYY");
  const endYear = moment(history[history.length - 1].datetime, "DD/MM/YYYY").format("YYYY");

  // Create the year range string
  const yearRange = startYear === endYear ? startYear : `${startYear} - ${endYear}`;

  if (window.scoreChartInstance) {
    window.scoreChartInstance.destroy();
  }

  window.scoreChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Score",
          data: scores,
          borderColor: "rgba(220, 53, 69, 1)",
          backgroundColor: "rgba(220, 53, 69, 0.2)",
          fill: true,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "User Progress Over Time",
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          type: "category", // Use category scale instead of time
          title: {
            display: true,
            text: `Date and Time (${yearRange})`,
          },
        },
        y: {
          title: {
            display: true,
            text: "Score",
          },
          beginAtZero: true,
        },
      },
    },
  });
}


// Main Menu Functions
function startQuiz() {
  const questionsCount = parseInt(document.getElementById('questions-count').value, 10);
  const quiz = new Quiz(questionsCount);
  quiz.loadQuizData();
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('quiz-container').style.display = 'block';
}

// Load settings on page load
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('settings-button').addEventListener('click', UI.showSettings);
  document.getElementById('save-setting-button').addEventListener('click', function () {
    UI.saveSettings();
    const targetInput = document.getElementById('goal-input').value;
    const target = parseInt(targetInput);

    if (targetInput === '') {
      alert('Settings saved!');
    } else if (target > 0) {
      window.weeklyGoals.setTarget(target);
      window.weeklyGoals.resetProgress();
      updateUI();
      alert('Settings saved!');
    } else {
      alert('Please set a goal greater than 0.');
    }
  });


  document.getElementById('toggle-fullscreen-button').addEventListener('click', UI.toggleFullscreen);
  const backToMenuButtons = document.querySelectorAll('.menu-button');
  backToMenuButtons.forEach(button => {
    button.addEventListener('click', UI.showMenu);
  });
  document.getElementById('history-button').addEventListener('click', () => UI.viewHistory());
  document.getElementById('resethistory-button').addEventListener('click', UI.resetHistory);
  const savedQuestionsCount = localStorage.getItem('questionsCount');
  if (savedQuestionsCount) {
    document.getElementById('questions-count').value = savedQuestionsCount;
  }
  updateUI();
});

