class Question {
  constructor(number, type, questionText, options, answer, answerText) {
    this.number = number;
    this.type = type;
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
  constructor(questionsPerDay, level, selectedTypes) {
    this.quizData = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.questionsPerDay = questionsPerDay;
    this.selectedQuestions = [];
    this.selectedTypes = selectedTypes;
    this.wrongAnswers = [];
    this.questionTimes = [];
    this.level = level;
    this.startTime = null;
  }

  async loadQuizData() {
    try {
      const response = await fetch(`quizData${this.level}.json`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      this.quizData = data.questions.map(
        q => new Question(q.number, q.type, q.question, q.options, q.answer, q.answer_text)
      );
      return this.quizData;
    } catch (error) {
      console.error('Error loading quiz data:', error);
      alert('Selected level is not available yet. Please try again later.');
    }
  }

  startQuiz() {
    this.resetQuiz();
    this.loadQuizData().then(() => {
      this.selectQuestions();
      this.loadQuestion();
    });
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.selectedQuestions = [];
    this.wrongAnswers = [];
    this.questionTimes = [];
    document.getElementById("score").innerText = this.score;
    UI.hideSummaryContainer();
    UI.hideQuestionReview();
    UI.showQuizContainer();
    this.resetProgressBar();
  }

  selectQuestions() {
    const selectedSet = new Set();
    const typeCounts = {};
    this.selectedTypes.forEach(type => typeCounts[type] = 0);

    while (selectedSet.size < this.questionsPerDay) {
      const availableQuestions = this.quizData.filter(q =>
        this.selectedTypes.includes(q.type) &&
        !selectedSet.has(q)
      );

      if (availableQuestions.length === 0) break;

      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const selectedQuestion = availableQuestions[randomIndex];

      if (this.isBalanced(typeCounts, selectedQuestion.type)) {
        selectedSet.add(selectedQuestion);
        typeCounts[selectedQuestion.type]++;
      }
    }

    this.selectedQuestions = Array.from(selectedSet);
  }

  isBalanced(typeCounts, currentType) {
    const totalSelected = Object.values(typeCounts).reduce((a, b) => a + b, 0);
    const targetCount = Math.ceil(this.questionsPerDay / this.selectedTypes.length);
    return typeCounts[currentType] < targetCount;
  }

  loadQuestion() {
    const currentQuestion = this.selectedQuestions[this.currentQuestionIndex];
    this.startTime = Date.now();

    document.getElementById("question-text").innerHTML = currentQuestion.getFormattedQuestion();
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach(optionObj => {
      const key = Object.keys(optionObj)[0];
      const value = optionObj[key];
      const option = document.createElement("div");
      option.classList.add('option', 'pd-10', 'br-5');
      option.innerHTML = value;
      option.dataset.optionKey = key;
      option.addEventListener("click", () => this.selectOption(key));
      optionsContainer.appendChild(option);
    });

    this.updateProgressBar();
  }

  selectOption(selectedOption) {
    const timeTaken = (Date.now() - this.startTime) / 1000;
    const currentQuestion = this.selectedQuestions[this.currentQuestionIndex];
    const isCorrect = currentQuestion.isCorrect(selectedOption);
    const selectedOptionElement = document.querySelector(`.option[data-option-key="${selectedOption}"]`);
    const selectedText = currentQuestion.options.find(option => option[selectedOption])[selectedOption];
    const correctText = currentQuestion.answerText;

    this.questionTimes.push({
      question: currentQuestion.questionText,
      options: currentQuestion.options,
      timeTaken: timeTaken,
      correct: isCorrect,
      selectedAnswer: selectedText,
      correctAnswer: correctText,
      type: currentQuestion.type
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
      this.generateSummary();
      this.generateQuestionReview();
    }
  }

  updateScore() {
    document.getElementById("score").innerText = this.score;
  }

  generateSummary() {
    const progressScore = document.getElementById('progress-score');
    const quizTypeContainer = document.getElementById('quiz-info-container');
    const typeScores = document.getElementById('type-scores');
    const timeSpent = document.getElementById('time-spent');
    const totalScore = document.getElementById('total-score');

    // Set the score in the circular progress bar
    progressScore.textContent = this.score / this.questionsPerDay * 100;
    quizTypeContainer.innerHTML = '';
    const levelSpan = document.createElement('span');
    levelSpan.textContent = `N${this.level}`;
    levelSpan.className = `label-history level-${this.level}`;
    quizTypeContainer.appendChild(levelSpan);

    if (this.selectedTypes.length === 3) {
      const allSpan = document.createElement('span');
      allSpan.textContent = 'All';
      allSpan.className = 'label-history all';
      quizTypeContainer.appendChild(allSpan);
    } else {
      this.selectedTypes.forEach(type => {
        const typeSpan = document.createElement('span');
        typeSpan.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        typeSpan.classList.add(`${type.toLowerCase()}`, 'label-history');
        quizTypeContainer.appendChild(typeSpan);
      });
    }


    // Populate type-specific scores
    typeScores.innerHTML = '';
    const typeScoreMap = this.calculateTypeScores();
    for (const [type, scores] of Object.entries(typeScoreMap)) {
      const row = `
        <tr>
          <td style="text-transform: capitalize;">${type}</td>
          <td>${scores.wrong}</td>
          <td>${scores.correct}</td>
        </tr>
      `;
      typeScores.innerHTML += row;
    }

    // Set time spent and total score
    const totalTime = this.calculateTotalTime();
    timeSpent.textContent = this.formatTime(totalTime);
    totalScore.textContent = `${this.score}/${this.questionsPerDay}`;

    UI.hideQuizContainer();
    UI.showSummaryContainer();
  }

  calculateTypeScores() {
    const typeScores = {};

    this.selectedTypes.forEach(type => {
      typeScores[type] = { correct: 0, wrong: 0 };
    });

    this.selectedQuestions.forEach((question, index) => {
      const questionType = question.type;
      const isCorrect = this.questionTimes[index].correct;

      if (isCorrect) {
        typeScores[questionType].correct++;
      } else {
        typeScores[questionType].wrong++;
      }
    });

    return typeScores;
  }

  calculateTotalTime() {
    return this.questionTimes.reduce((total, question) => total + question.timeTaken, 0);
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  generateQuestionReview() {
    const summaryContainer = document.getElementById('question-review');
    UI.clearQuestionReview();
    this.questionTimes.forEach((q, index) => {
      const questionCard = document.createElement('div');
      questionCard.classList.add('summary-card', 'br-5', 'mb-20');

      // Part 1: Question Number
      const questionNumber = document.createElement('div');
      questionNumber.classList.add('question-number', 'pd-10', 'bold', 'flex-center');
      questionNumber.textContent = `${index + 1}`;

      // Part 2: Question and answers
      const questionContent = document.createElement('div');
      questionContent.classList.add('question-content', 'pd-10');

      // Question text
      const questionText = document.createElement('div');
      questionText.classList.add('question-text', 'bold');
      questionText.innerHTML = q.question;

      // Answer text
      const answerText = document.createElement('div');
      answerText.classList.add('answer-text');

      const yourAnswerSpan = document.createElement('span');
      yourAnswerSpan.classList.add(q.correct ? 'correct-answer' : 'wrong-answer', 'bold');
      yourAnswerSpan.innerHTML = q.selectedAnswer;

      const correctAnswerSpan = document.createElement('span');
      correctAnswerSpan.classList.add('correct-answer');
      correctAnswerSpan.innerHTML = q.correctAnswer;

      answerText.innerHTML = `Your Answer: `;
      answerText.appendChild(yourAnswerSpan);
      answerText.innerHTML += `<br>Correct Answer: `;
      answerText.appendChild(correctAnswerSpan);

      questionContent.appendChild(questionText);
      questionContent.appendChild(answerText);

      // Part 3: Question type label
      const typeLabel = document.createElement('div');
      typeLabel.classList.add(`${q.type.toLowerCase()}`, `label-summary`, `pd-10`, `flex-center`);
      switch (q.type.toLowerCase()) {
        case 'moji':
          typeLabel.textContent = '文字';
          break;
        case 'goi':
          typeLabel.textContent = '語い';
          break;
        case 'bunpo':
          typeLabel.textContent = '文法';
          break;
        default:
          typeLabel.textContent = q.type;
      }

      // Append all parts to the question card
      questionCard.appendChild(questionNumber);
      questionCard.appendChild(questionContent);
      questionCard.appendChild(typeLabel);

      summaryContainer.appendChild(questionCard);
    });

    UI.hideQuizContainer();
    UI.showSummaryContainer();

  }

  resetProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = '0%';
  }

  updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = ((this.currentQuestionIndex + 1) / this.questionsPerDay) * 100;
    progressBar.style.width = `${progressPercentage}%`;
  }

  saveScore() {
    const datetime = formatDateTime(new Date());
    const history = QuizSettings.getHistoryData();
    history.push({
      datetime: datetime,
      questions: this.questionsPerDay,
      score: this.score,
      level: this.level,
      types: this.selectedTypes
    });
    QuizSettings.setHistoryData(history);

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

  static hideMainmenu() {
    document.getElementById('main-menu').style.display = 'none';
  }

  static showQuizContainer() {
    document.getElementById('quiz-container').style.display = 'block';
  }

  static hideQuizContainer() {
    document.getElementById('quiz-container').style.display = 'none';
  }

  static clearQuestionReview() {
    const summaryContainer = document.getElementById('question-review');
    summaryContainer.innerHTML = '';
  }

  static toggleQuestionReview() {
    var toggleQuestionReview = document.getElementById("question-review");
    var toggleQuestionReviewLabel = document.getElementById("review-link");
    if (toggleQuestionReview.style.display === "none") {
      toggleQuestionReview.style.display = "block";
      toggleQuestionReviewLabel.innerText = "Hide Question Review";
    } else {
      toggleQuestionReview.style.display = "none";
      toggleQuestionReviewLabel.innerText = "Show Question Review";
    }
  }

  static showSummaryContainer() {
    document.getElementById('summary-container').style.display = 'block';
  }

  static hideSummaryContainer() {
    document.getElementById('summary-container').style.display = 'none';
  }

  static hideQuestionReview() {
    document.getElementById("question-review").style.display = "none";
  }

  static hideElementsForSharing() {
    const elementsToHide = document.querySelectorAll('#summary-container .button-group, #summary-container .review-link-bt');
    elementsToHide.forEach(el => el.style.display = 'none');
    const sumtitle = document.getElementById("summary-title");
    sumtitle.textContent = "My Score is :";
  }

  static showElementsAfterSharing() {
    const elementsToHide = document.querySelectorAll('#summary-container .button-group, #summary-container .review-link-bt');
    elementsToHide.forEach(el => el.style.display = '');
    const sumtitle = document.getElementById("summary-title");
    sumtitle.textContent = "Your Score is :";
  }

  static createWatermark() {
    const watermark = document.createElement('div');
    watermark.className = 'watermark text-secondary bg-primary';
    watermark.textContent = 'Test Your Japanese Skills on JLPT GrindMaster!';
    document.querySelector("#summary-container").appendChild(watermark);
    return watermark;
  }

  static createModal(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'modal flex-center w-100';
    modal.innerHTML = `
      <div class="modal-content br-20 pd-20 t-align-center">
        <span class="close-button">&times;</span>
        <img id="capturedImage" alt="Quiz Result">
        <div class="modal-buttons">
          <button id="downloadBtn" class="text-secondary bg-primary">Download</button>
          <button id="copyBtn" class="text-secondary bg-primary">Copy to Clipboard</button>
        </div>
      </div>
    `;
    const img = modal.querySelector('#capturedImage');
    img.src = imageSrc;
    return modal;
  }

  static addModalListeners(modal, canvas) {
    document.getElementById('downloadBtn').addEventListener('click', () => UI.downloadImage(canvas));
    document.getElementById('copyBtn').addEventListener('click', () => UI.copyImageToClipboard(canvas));

    const closeModal = () => document.body.removeChild(modal);
    modal.querySelector('.close-button').addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
  }

  static downloadImage(canvas) {
    // Get the current date
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
  
    // Generate a random 5-digit number
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
  
    // Format the filename
    const filename = `Quiz-Result ${day}-${month}-${year} ${randomNumber}.png`;
  
    // Create the download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
  }


  static copyImageToClipboard(canvas) {
    canvas.toBlob(blob => {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]).then(() => {
        alert('Image copied to clipboard!');
      }, err => {
        console.error('Error copying image to clipboard:', err);
      });
    });
  }

  static showMenu() {
    document.getElementById('main-menu').style.display = 'block';
    function hideElements(elementIds) {
      elementIds.forEach(id => {
        document.getElementById(id).style.display = 'none';
      });
    }
    hideElements(['settings-container', 'quiz-container', 'history-container', 'summary-container']);
  }

  static showSettings() {
    UI.hideMainmenu();
    document.getElementById('settings-container').style.display = 'block';
  }

  static viewHistory(page = 1) {
    const historyTableBody = document.getElementById('history-list');
    const history = QuizSettings.getHistoryData();
    const itemsPerPage = 5;

    history.sort((a, b) => {
      const dateA = parseDateTime(a.datetime);
      const dateB = parseDateTime(b.datetime);
      return dateB - dateA;
    }).reverse();


    const totalPages = Math.ceil(history.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    historyTableBody.innerHTML = '';

    history.slice(start, end).forEach(entry => {
      const row = document.createElement('tr');
      const dateCell = document.createElement('td');
      const levelQuestionsCell = document.createElement('td');
      const scoreCell = document.createElement('td');

      dateCell.textContent = entry.datetime || 'N/A';

      const levelSpan = document.createElement('span');
      levelSpan.className = `label-history level-${entry.level || '1'}`;
      levelSpan.textContent = `N${entry.level || '1'}`;

      const questionsSpan = document.createElement('span');
      questionsSpan.className = 'label-history questions-label';
      questionsSpan.textContent = `${entry.questions}`;

      const typesSpan = document.createElement('span');
      typesSpan.className = 'types-label';

      // Assuming these are the total available types
      const totalAvailableTypes = ["moji", "goi", "bunpo"];

      function updateTypesLabel(entry, typesSpan) {
        const typeSpan = document.createElement('span');
        if (entry.types) {
          // Check if all types are selected
          const allSelected = totalAvailableTypes.every(type => entry.types.includes(type));

          if (allSelected) {
            typeSpan.classList.add('all', 'label-history');
            typeSpan.textContent = 'all';
          } else {
            entry.types.forEach((type, index) => {
              const typeSpanItem = document.createElement('span');
              typeSpanItem.classList.add(`${type.toLowerCase()}`, 'label-history');
              typeSpanItem.textContent = type;
              typeSpan.appendChild(typeSpanItem);
            });
          }
        } else {
          typeSpan.className = 'label-history all';
          typeSpan.textContent = 'all';
        }
        typesSpan.appendChild(typeSpan);
      }


      updateTypesLabel(entry, typesSpan);
      document.body.appendChild(typesSpan);  // Append to your desired parent element



      levelQuestionsCell.innerHTML = '';
      levelQuestionsCell.appendChild(levelSpan);
      levelQuestionsCell.appendChild(questionsSpan);
      levelQuestionsCell.appendChild(typesSpan);

      scoreCell.textContent = entry.score;

      row.appendChild(dateCell);
      row.appendChild(levelQuestionsCell);
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
      firstButton.classList.add('text-secondary', 'bg-primary');
      firstButton.addEventListener('click', () => UI.viewHistory(1));
      paginationControls.appendChild(firstButton);

      const prevButton = document.createElement('button');
      prevButton.textContent = '‹';
      prevButton.classList.add('text-secondary', 'bg-primary');
      prevButton.addEventListener('click', () => UI.viewHistory(page - 1));
      paginationControls.appendChild(prevButton);
    }

    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.disabled = i === page;
      button.classList.add('text-secondary', 'bg-primary');
      button.addEventListener('click', () => UI.viewHistory(i));
      paginationControls.appendChild(button);
    }

    // Add › and » if not on the last page
    if (page < totalPages) {
      const nextButton = document.createElement('button');
      nextButton.textContent = '›';
      nextButton.classList.add('text-secondary', 'bg-primary');
      nextButton.addEventListener('click', () => UI.viewHistory(page + 1));
      paginationControls.appendChild(nextButton);

      const lastButton = document.createElement('button');
      lastButton.textContent = '»';
      lastButton.classList.add('text-secondary', 'bg-primary');
      lastButton.addEventListener('click', () => UI.viewHistory(totalPages));
      paginationControls.appendChild(lastButton);
    }

    UI.hideMainmenu();
    document.getElementById('history-container').style.display = 'block';

    UI.drawChart(history);
    updateStats(history);
    updateUI();
  }

  static drawChart(history) {
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
            text: "Progress Over Time",
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            type: "category",
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

  static restartQuiz(quiz) {
    quiz.resetQuiz();
    UI.hideSummaryContainer();
    UI.showQuizContainer();
  }
}

class QuizSettings {
  static getQuizLevel() {
    const quizLevel = document.getElementById('quiz-level').value;
    return quizLevel;
  }

  static getSelectedTypes() {
    const types = ['moji', 'goi', 'bunpo'];
    return types.filter(type => document.getElementById(type).checked);
  }

  static getQuestionCount() {
    const qCount = document.getElementById('questions-count').value;
    return parseInt(qCount, 10);
  }

  static getHistoryData() {
    return JSON.parse(localStorage.getItem('scoreHistory')) || [];
  }

  static setHistoryData(history) {
    localStorage.setItem('scoreHistory', JSON.stringify(history));
  }

  static resetHistory() {
    if (confirm('Are you sure you want to reset the score history?')) {
      localStorage.removeItem('scoreHistory');
      alert('Score history has been reset.');
      location.reload();
    }
  }

  static loadSavedSettings() {
    // Load saved questions count
    const savedQuestionsCount = localStorage.getItem('questionsCount');
    if (savedQuestionsCount) {
      document.getElementById('questions-count').value = savedQuestionsCount;
    }

    // Load saved quiz level
    const savedQuizLevel = localStorage.getItem('quizLevel');
    if (savedQuizLevel) {
      document.getElementById('quiz-level').value = savedQuizLevel;
    }

    // Load saved question types settings
    const checkboxes = document.querySelectorAll('input[name="category"]');
    const savedSettings = JSON.parse(localStorage.getItem('questionTypes')) || [];

    if (savedSettings.length > 0) {
      checkboxes.forEach(checkbox => {
        checkbox.checked = savedSettings.includes(checkbox.value);
      });
    } else {
      // Check all checkboxes if there are no saved settings
      checkboxes.forEach(checkbox => {
        checkbox.checked = true;
      });
    }
  }

  static saveSettings() {
    const questionsCount = document.getElementById('questions-count').value;
    const quizLevel = QuizSettings.getQuizLevel();
    const checkboxes = document.querySelectorAll('input[name="category"]');
    const selectedTypes = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    localStorage.setItem('questionTypes', JSON.stringify(selectedTypes));
    localStorage.setItem('questionsCount', questionsCount);
    localStorage.setItem('quizLevel', quizLevel);

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
  }

  static updateExistingEntries() {
    const history = QuizSettings.getHistoryData();
    history.forEach(entry => {
      const dateTimeParts = entry.datetime.split(' ');
      const dateParts = dateTimeParts[0].split('/');
      const timeParts = dateTimeParts[1].split(':');
      entry.datetime = `${dateParts[0]}/${dateParts[1]}/${dateParts[2]} ${timeParts[0]}:${timeParts[1]}`;
    });
    QuizSettings.setHistoryData(history);
  }
}

class EventHandler {
  static initialize() {
    // UI interaction listeners
    document.getElementById('settings-button').addEventListener('click', UI.showSettings);
    document.getElementById('history-button').addEventListener('click', () => UI.viewHistory());
    document.getElementById('toggle-fullscreen-button').addEventListener('click', UI.toggleFullscreen);
    document.getElementById('share-result').addEventListener('click', shareQuizResult);
    document.getElementById("review-link").addEventListener("click", UI.toggleQuestionReview);


    // Menu navigation listeners
    const backToMenuButtons = document.querySelectorAll('.menu-button');
    backToMenuButtons.forEach(button => {
      button.addEventListener('click', UI.showMenu);
    });

    // History and settings listeners
    document.getElementById('save-setting-button').addEventListener('click', QuizSettings.saveSettings);
    document.getElementById('resethistory-button').addEventListener('click', QuizSettings.resetHistory);

    // Add any other event listeners here
  }
}

// Utility Functions

function exportData() {
  const data = {
    weeklyGoals: localStorage.getItem('weeklyGoals'),
    qCount: localStorage.getItem('questionsCount'),
    qType: localStorage.getItem('questionTypes'),
    history: QuizSettings.getHistoryData(),
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
      if (data.qType) {
        localStorage.setItem('questionTypes', data.qType);
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
    let previousDate = today.clone().add(1, 'day');

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
    dayStreak = Math.max(dayStreak, currentStreak);
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
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function startQuiz() {
  const questionsCount = QuizSettings.getQuestionCount();
  const quizLevel = QuizSettings.getQuizLevel();
  const selectedTypes = QuizSettings.getSelectedTypes();

  if (selectedTypes.length === 0) {
    alert('Please select at least one question type.');
    return;
  }

  const quiz = new Quiz(questionsCount, quizLevel, selectedTypes);
  quiz.startQuiz();
  UI.hideMainmenu();
  UI.showQuizContainer();
}

function shareQuizResult() {
  UI.hideElementsForSharing();
  const watermark = UI.createWatermark();

  html2canvas(document.querySelector("#summary-container")).then(canvas => {
    UI.showElementsAfterSharing();
    document.querySelector("#summary-container").removeChild(watermark);

    const modal = UI.createModal(canvas.toDataURL());
    document.body.appendChild(modal);
    UI.addModalListeners(modal, canvas);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  EventHandler.initialize();
  QuizSettings.loadSavedSettings();
  QuizSettings.updateExistingEntries();
  updateUI();
});
