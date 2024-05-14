const PASSWORD = "123";
const quizData = {
  questions: [
    {
      number: 1,
      question: "税金を納めるのは、国民の義務です。",
      options: [
        {1: "せめる"},
        {2: "なかめる"},
        {3: "しめる"},
        {4: "おさめる"},
      ],
      answer: 4,
      answer_text: "おさめる",
    },
    {
      number: 2,
      question: "_________ 言葉で話しかけてくる営業マンに、注意しよう。",
      options: [
        {1: "なれなれしい"},
        {2: "すがすがしい"},
        {3: "はなはなしい"},
        {4: "そうぞうしい"},
      ],
      answer: 1,
      answer_text: "なれなれしい",
    },
    {
      number: 3,
      question: "態度が悪いのはあの店員に_________ ことではない。",
      options: [
        {1: "限る"},
        {2: "限らない"},
        {3: "限って"},
        {4: "限った"},
      ],
      answer: 2,
      answer_text: "限らない",
    },
    {
      number: 61,
      question: "趣味は俳句や詩を作ること、それに漫画も描いたりします。",
      options: [
        { 1: "きょうみ" },
        { 2: "しゅみ" },
        { 3: "きゅうみ" },
        { 4: "ちゃみ" },
      ],
      answer: 2,
      answer_text: "しゅみ",
    },
    {
      number: 62,
      question:
        "_______ をこぼす相手を間違えると、誤解を招くので気をつけよう。",
      options: [{ 1: "本音" }, { 2: "お世辞" }, { 3: "ぐち" }, { 4: "建前" }],
      answer: 2,
      answer_text: "お世辞",
    },
    {
      number: 63,
      question: "これは皮膚科の医師が驚いている_______、肌に優しい石けんだ。",
      options: [
        { 1: "とおって" },
        { 2: "あっての" },
        { 3: "にあたって" },
        { 4: "とあれば" },
      ],
      answer: 3,
      answer_text: "にあたって",
    },
  ],
};

let currentQuestionIndex = 0;
let score = 0;
const questionsPerDay = 3;

function checkPassword() {
  const passwordInput = document.getElementById("password-input").value;
  const passwordError = document.getElementById("password-error");
  const passwordContainer = document.getElementById("password-container");

  if (passwordInput === PASSWORD) {
    passwordContainer.style.display = "none";
    checkQuizStatus();
  } else {
    passwordError.innerText = "Password is incorrect";
    passwordContainer.classList.add("shake");
    setTimeout(() => passwordContainer.classList.remove("shake"), 500);
  }
}

function checkQuizStatus() {
  const today = new Date().toDateString();
  const lastCompletedDate = localStorage.getItem("lastCompletedDate");

  if (lastCompletedDate === today) {
    showCompletedMessage();
  } else {
    startQuiz();
  }
}

function startQuiz() {
  const quizContainer = document.getElementById("quiz-container");
  quizContainer.style.display = "block";
  loadQuestion();
}

function showCompletedMessage() {
  const completedContainer = document.getElementById("completed-container");
  completedContainer.style.display = "block";

  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const countdownElement = document.getElementById("countdown");
  updateCountdown(countdownElement, tomorrow - now);

  setInterval(() => {
    updateCountdown(countdownElement, tomorrow - new Date());
  }, 1000);
}

function updateCountdown(element, ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  element.innerText = `Time left: ${hours}h ${minutes}m ${seconds}s`;
}

function loadQuestion() {
  const questionContainer = document.getElementById("question-container");
  const questionNumber = document.getElementById("question-number");
  const questionText = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");

  const currentQuestion = quizData.questions[currentQuestionIndex];
  questionNumber.innerText = `Question ${currentQuestion.number}`;
  questionText.innerText = currentQuestion.question;

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

  updateProgress();
}

function selectOption(selectedOption) {
  const currentQuestion = quizData.questions[currentQuestionIndex];
  if (parseInt(selectedOption) === currentQuestion.answer) {
    score++;
  }
  updateScore();
  nextQuestion();
}

function nextQuestion() {
  if (currentQuestionIndex < questionsPerDay - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    localStorage.setItem("lastCompletedDate", new Date().toDateString());
    showModal();
  }
}

function updateScore() {
  const scoreContainer = document.getElementById("score");
  scoreContainer.innerText = score;
}

function updateProgress() {
  const progressContainer = document.getElementById("progress");
  const progress = ((currentQuestionIndex + 1) / questionsPerDay) * 100;
  progressContainer.innerText = progress.toFixed(0);
}

function showModal() {
  const modal = document.getElementById("completed-modal");
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("completed-modal");
  modal.style.display = "none";

  // Hide the quiz container
  const quizContainer = document.getElementById("quiz-container");
  quizContainer.style.display = "none";

  // Show the completed message container
  const completedContainer = document.getElementById("completed-container");
  completedContainer.style.display = "block";

  showCompletedMessage();
}

document.addEventListener("DOMContentLoaded", () => {
  // Load the password input first
});
