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
    document.getElementById("completed-container").style.display = "none";
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

    // Disable all options immediately after selection
    this.disableOptions();

    this.updateScore();
    setTimeout(() => {
      this.enableOptions(); // Enable options before loading the next question
      this.nextQuestion();
    }, 1000); // Wait a second before loading the next question
  }

  disableOptions() {
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
      option.classList.add('disabled');
      option.style.pointerEvents = 'none'; // Prevent clicking
    });
  }

  enableOptions() {
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
      option.classList.remove('disabled');
      option.style.pointerEvents = 'auto'; // Allow clicking again
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
      correctnessText.innerHTML = q.correct ? '<span style="color:green">Correct</span>' : '<span style="color:red">Incorrect</span>';

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
    const date = new Date().toLocaleDateString();
    const history = JSON.parse(localStorage.getItem('scoreHistory')) || [];
    history.push({
      date: date,
      questions: this.questionsPerDay,
      score: this.score
    });
    localStorage.setItem('scoreHistory', JSON.stringify(history));
  }
}

// Global Variables
let quiz;

// Main Menu Functions
function startQuiz() {
  const questionsCount = parseInt(document.getElementById('questions-count').value, 10);
  quiz = new Quiz(questionsCount);
  quiz.loadQuizData();
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('quiz-container').style.display = 'block';

  // Request full-screen mode for the entire document
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) { // Firefox
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
    document.documentElement.msRequestFullscreen();
  }
}


function showSettings() {
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('settings-container').style.display = 'block';
}

function saveSettings() {
  const questionsCount = document.getElementById('questions-count').value;
  localStorage.setItem('questionsCount', questionsCount);
  alert('Settings saved!');
  showMenu();
}

function showMenu() {
  document.getElementById('main-menu').style.display = 'block';
  document.getElementById('settings-container').style.display = 'none';
  document.getElementById('quiz-container').style.display = 'none';
  document.getElementById('history-container').style.display = 'none';
  document.getElementById('completed-container').style.display = 'none';
  document.getElementById('summary-container').style.display = 'none';
}

function viewHistory() {
  const historyTableBody = document.getElementById('history-list');
  const history = JSON.parse(localStorage.getItem('scoreHistory')) || [];
  historyTableBody.innerHTML = '';

  history.forEach(entry => {
    const row = document.createElement('tr');
    const dateCell = document.createElement('td');
    const questionsCell = document.createElement('td');
    const scoreCell = document.createElement('td');

    dateCell.textContent = entry.date;
    questionsCell.textContent = entry.questions;
    scoreCell.textContent = entry.score;

    row.appendChild(dateCell);
    row.appendChild(questionsCell);
    row.appendChild(scoreCell);
    historyTableBody.appendChild(row);
  });

  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('history-container').style.display = 'block';
}

function restartQuiz() {
  quiz.resetQuiz();
  document.getElementById('quiz-container').style.display = 'block';
  document.getElementById('summary-container').style.display = 'none';
}

// Load settings on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedQuestionsCount = localStorage.getItem('questionsCount');
  if (savedQuestionsCount) {
    document.getElementById('questions-count').value = savedQuestionsCount;
  }
});
