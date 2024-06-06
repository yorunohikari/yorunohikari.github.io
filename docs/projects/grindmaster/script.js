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
    localStorage.removeItem("wrongAnswers");
    document.getElementById("score").innerText = this.score;
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("completed-container").style.display = "none";
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
    const currentQuestion = this.selectedQuestions[this.currentQuestionIndex];
    if (currentQuestion.isCorrect(selectedOption)) {
      this.score++;
    } else {
      this.wrongAnswers.push({
        question: currentQuestion.questionText,
        yourAnswer: currentQuestion.options.find(option => option[selectedOption])[selectedOption],
        correctAnswer: currentQuestion.answerText
      });
    }
    this.updateScore();
    this.nextQuestion();
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questionsPerDay - 1) {
      this.currentQuestionIndex++;
      this.loadQuestion();
    } else {
      localStorage.setItem("wrongAnswers", JSON.stringify(this.wrongAnswers));
      this.showCompletedMessage();
    }
  }

  updateScore() {
    document.getElementById("score").innerText = this.score;
  }

  showCompletedMessage() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("completed-container").style.display = "block";
    document.getElementById("final-score").innerText = this.score;
    this.displayWrongAnswers();
  }

  displayWrongAnswers() {
    const wrongAnswers = JSON.parse(localStorage.getItem("wrongAnswers")) || [];
    const answerList = document.getElementById("wrong-answers-list");
    answerList.innerHTML = "";

    wrongAnswers.forEach(answer => {
      const card = document.createElement("div");
      card.classList.add("answer-card");

      const questionText = document.createElement("div");
      questionText.classList.add("question-text");
      questionText.innerHTML = answer.question.replace("B「", "<br>B「");
      card.appendChild(questionText);

      const yourAnswer = document.createElement("div");
      yourAnswer.classList.add("your-answer");
      yourAnswer.innerText = `Your Answer: ${answer.yourAnswer}`;
      card.appendChild(yourAnswer);

      const correctAnswer = document.createElement("div");
      correctAnswer.classList.add("correct-answer");
      correctAnswer.innerText = `Correct Answer: ${answer.correctAnswer}`;
      card.appendChild(correctAnswer);

      answerList.appendChild(card);
    });
  }

  updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const progressPercentage = ((this.currentQuestionIndex) / this.questionsPerDay) * 100;
    progressBar.style.width = `${progressPercentage}%`;
  }

  resetProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = "0%";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const quiz = new Quiz(10);
  quiz.loadQuizData();
  window.restartQuiz = () => quiz.startQuiz();
});
