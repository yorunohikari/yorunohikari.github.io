// Define the quiz data
let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
const questionsPerDay = 10;
let selectedQuestions = [];
let wrongAnswers = [];

// Load the quiz data once the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadQuizData();
});

// Fetch the quiz data from the JSON file
async function loadQuizData() {
  try {
    const response = await fetch('quizData.json');
    const data = await response.json();
    quizData = data.questions;
    startQuiz();
  } catch (error) {
    console.error('Error loading quiz data:', error);
  }
}

// Function to start the quiz
function startQuiz() {
  resetQuiz();
  selectQuestions();
  loadQuestion();
}

// Function to reset the quiz
function resetQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  selectedQuestions = [];
  wrongAnswers = [];
  localStorage.removeItem("wrongAnswers");
  document.getElementById("score").innerText = score;
  resetProgressBar();
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("completed-container").style.display = "none";
}

// Function to select random questions
function selectQuestions() {
  while (selectedQuestions.length < questionsPerDay) {
    const randomIndex = Math.floor(Math.random() * quizData.length);
    if (!selectedQuestions.includes(quizData[randomIndex])) {
      selectedQuestions.push(quizData[randomIndex]);
    }
  }
}

// Function to load a question
function loadQuestion() {
  const currentQuestion = selectedQuestions[currentQuestionIndex];
  document.getElementById("question-text").innerHTML = currentQuestion.question.replace('B「', '<br>B「');
  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((optionObj) => {
    const key = Object.keys(optionObj)[0];
    const value = optionObj[key];
    const option = document.createElement("div");
    option.classList.add("option");
    option.innerText = value;
    option.dataset.optionKey = key;
    option.addEventListener("click", () => selectOption(key));
    optionsContainer.appendChild(option);
  });

  updateProgressBar();
}

// Function to handle option selection
function selectOption(selectedOption) {
  const currentQuestion = selectedQuestions[currentQuestionIndex];
  if (parseInt(selectedOption) === currentQuestion.answer) {
    score++;
  } else {
    // Store the wrong answer
    wrongAnswers.push({
      question: currentQuestion.question,
      yourAnswer: currentQuestion.options.find(option => option[selectedOption])[selectedOption],
      correctAnswer: currentQuestion.answer_text
    });
  }
  updateScore();
  nextQuestion();
}

// Function to go to the next question
function nextQuestion() {
  if (currentQuestionIndex < questionsPerDay - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    localStorage.setItem("wrongAnswers", JSON.stringify(wrongAnswers));
    showCompletedMessage();
  }
}

// Function to update the score
function updateScore() {
  document.getElementById("score").innerText = score;
}

// Function to update the progress bar
function updateProgressBar() {
  const progressBar = document.getElementById("progress-bar");
  const progressPercentage = ((currentQuestionIndex + 1) / questionsPerDay) * 100;
  progressBar.style.width = `${progressPercentage}%`;
}

// Function to reset the progress bar
function resetProgressBar() {
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = "0%";
}

// Function to show the completed message and wrong answers
function showCompletedMessage() {
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("completed-container").style.display = "block";
  document.getElementById("final-score").innerText = score;
  displayWrongAnswers();
}

// Function to display the wrong answers in a card format
function displayWrongAnswers() {
  const wrongAnswers = JSON.parse(localStorage.getItem("wrongAnswers")) || [];
  const answersContainer = document.getElementById("wrong-answers-container");
  answersContainer.innerHTML = "";

  wrongAnswers.forEach(answer => {
    const card = document.createElement("div");
    card.classList.add("answer-card");

    const questionText = document.createElement("p");
    questionText.innerHTML = answer.question.replace('B「', '<br>B「');
    questionText.classList.add("question-text");

    const yourAnswerText = document.createElement("p");
    yourAnswerText.innerText = `Your Answer: ${answer.yourAnswer}`;
    yourAnswerText.classList.add("your-answer");
    yourAnswerText.style.color = 'red'; // Incorrect answer in red

    const correctAnswerText = document.createElement("p");
    correctAnswerText.innerText = `Correct Answer: ${answer.correctAnswer}`;
    correctAnswerText.classList.add("correct-answer");
    correctAnswerText.style.color = 'green'; // Correct answer in green

    card.appendChild(questionText);
    card.appendChild(yourAnswerText);
    card.appendChild(correctAnswerText);

    answersContainer.appendChild(card);
  });
}

// Function to handle quiz restart
function restartQuiz() {
  resetQuiz();
  startQuiz();
}
