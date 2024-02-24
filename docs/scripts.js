// Initialize variables outside the function scope
let numCorrectAnswers = 0;
let numWrongAnswers = 0;

// Get the modal element
const modal = document.getElementById('help-modal');
const helpBtn = document.getElementById('help-btn');
const closeBtn = document.getElementsByClassName('close')[0];
const playBtn = document.getElementById('play-btn');

// Initialize array to store wrong answers
const wrongAnswers = [];

// When the user clicks on the button, open the modal
helpBtn.onclick = function () {
    modal.style.display = 'block';
}

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function () {
    modal.style.display = 'none';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Attach event listener to the play button
playBtn.addEventListener('click', startQuiz);

// Function to start the quiz
function startQuiz() {
    // Hide main menu
    document.getElementById('quiz-container').style.display = 'flex';
    document.getElementById('main-menu').style.display = 'none';

    // Reset variables for a new quiz
    numCorrectAnswers = 0;
    numWrongAnswers = 0;
    wrongAnswers.length = 0;

    // Get the selected number of prefectures
    const numPrefectures = document.getElementById('prefecture-count').value;
    console.log('Starting quiz with ' + numPrefectures + ' prefectures.');

    // Fetch the data from GitHub (replace with actual URL)
    fetch('flags.json')
        .then(response => response.json())
        .then(data => {
            // Shuffle the data
            const shuffledData = shuffleArray(data);

            // Slice the shuffled data to get the selected number of prefectures
            const selectedPrefectures = shuffledData.slice(0, numPrefectures);

            // Start the quiz with the selected prefectures
            startQuizWithPrefectures(selectedPrefectures);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to end the quiz and display results
function endQuiz() {
    // Hide quiz container and display main menu
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';

    // Display results
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = `
    <h1>クイズ結果</h1>
    <p>正解数：${numCorrectAnswers}</p>
    <p>不正解数：${numWrongAnswers}</p>
    ${wrongAnswers.length > 0 ? '<div id="wrong-answers"></div>' : ''}
    <button id="play-again-btn">もう一度プレイ</button>

    `;

    // Display wrong answers if there are any
    if (wrongAnswers.length > 0) {
        displayWrongAnswers();
    }

    // Attach event listener to the play again button
    const playAgainBtn = document.getElementById('play-again-btn');
    playAgainBtn.classList.add('styled-button');
    playAgainBtn.addEventListener('click', resetQuiz);
}



// Function to display wrong answers
function displayWrongAnswers() {
    const wrongAnswersContainer = document.getElementById('wrong-answers');
    wrongAnswersContainer.innerHTML = '<h2>不正解の回答</h2>';

    // Create table
    const table = document.createElement('table');
    table.classList.add('styled-table'); // Add CSS class to the table
    const headerRow = table.insertRow();
    headerRow.innerHTML = '<th>都道府県</th><th>旗</th>';

    // Populate table with wrong answers
    wrongAnswers.forEach(answer => {
        const row = table.insertRow();
        const prefectureCell = row.insertCell();
        prefectureCell.textContent = answer.prefecture;

        const flagCell = row.insertCell();
        const flagImage = document.createElement('img');
        flagImage.src = answer.flag;
        flagImage.alt = `${answer.prefecture} Flag`;
        flagImage.classList.add('wrong-flag-image'); // Add CSS class to the image
        flagCell.appendChild(flagImage);
    });

    wrongAnswersContainer.appendChild(table);
}


// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to start the quiz with selected prefectures
function startQuizWithPrefectures(prefectures) {
    // Initialize quiz variables
    let currentQuestionIndex = 0;

    const optionButtons = [];

    // Function to display the current question
    function displayQuestion() {
        const currentQuestion = prefectures[currentQuestionIndex];
        const flagUrl = currentQuestion.flag;
        const prefectureName = currentQuestion.prefecture;

        // Display flag image
        document.getElementById('flag-container').innerHTML = `<img src="${flagUrl}" alt="${prefectureName} Flag">`;

        // Shuffle options (excluding the correct answer)
        const options = shuffleArray(prefectures.map(prefecture => prefecture.prefecture));
        const correctIndex = options.indexOf(prefectureName);
        options.splice(correctIndex, 1); // Remove correct answer
        options.splice(3); // Keep only 3 options

        // Add correct answer and shuffle options again
        options.push(prefectureName);
        const shuffledOptions = shuffleArray(options);

        // Display options
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';
        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'styled-button';
            button.onclick = () => {
                checkAnswer(option === prefectureName, prefectureName);
                disableAllButtons();
            };
            optionButtons.push(button); // Add button to array
            optionsContainer.appendChild(button);
        });
    }

    // Function to handle user selecting an option
    function checkAnswer(isCorrect, prefectureName) {
        const flagUrl = prefectures[currentQuestionIndex].flag;
        // Display correct or incorrect message as a floating message
        const message = isCorrect ? 'Correct!' : 'Incorrect!';
        displayFloatingMessage(message, isCorrect);

        if (isCorrect) {
            numCorrectAnswers++;
        } else {
            numWrongAnswers++;
            wrongAnswers.push({ prefecture: prefectureName, flag: flagUrl }); // Record wrong answer with prefecture name and flag URL
            console.log(flagUrl)
        }

        // Proceed to next question after a brief delay
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < prefectures.length) {
                displayQuestion();
            } else {
                endQuiz();
            }
        }, 1000); // 3 second delay
    }

    // Function to display floating message at mouse position
    function displayFloatingMessage(message, isCorrect) {
        // Create a new div element for the floating message
        const floatingMessage = document.createElement('div');
        floatingMessage.textContent = message;
        floatingMessage.style.position = 'absolute';
        floatingMessage.style.top = `${event.clientY}px`; // Set top position based on mouse Y-coordinate
        floatingMessage.style.left = `${event.clientX}px`; // Set left position based on mouse X-coordinate
        floatingMessage.style.backgroundColor = isCorrect ? 'green' : 'red'; // Set background color based on correctness
        floatingMessage.style.color = 'white';
        floatingMessage.style.padding = '8px';
        floatingMessage.style.borderRadius = '4px';
        floatingMessage.style.transition = 'opacity 0.5s ease-in-out'; // Apply fade transition
        floatingMessage.style.opacity = 1; // Start with full opacity

        // Append the floating message to the document body
        document.body.appendChild(floatingMessage);

        // Fade away after 800ms
        setTimeout(() => {
            floatingMessage.style.opacity = 0; // Set opacity to 0 for fade-out effect
            setTimeout(() => {
                floatingMessage.remove(); // Remove the floating message from the DOM after fading out
            }, 500); // Wait for the fade-out transition to complete before removing the element
        }, 800); // Wait 800ms before starting the fade-out
    }

    // Function to disable all buttons
    function disableAllButtons() {
        optionButtons.forEach(button => {
            button.disabled = true; // Disable button
        });
    }

    // Display the first question to start the quiz
    displayQuestion();

}

// Function to reset the quiz
function resetQuiz() {
    // Reset variables
    numCorrectAnswers = 0;
    numWrongAnswers = 0;
    wrongAnswers.length = 0;

    // Hide quiz container and display main menu
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';

    // Clear any existing quiz results
    // Clear any existing quiz results
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = '';
    document.getElementById('result-container').style.display = 'none';

    // Clear flag, options, and result
    document.getElementById('flag-container').innerHTML = '';
    document.getElementById('options').innerHTML = '';
    document.getElementById('result').textContent = '';
}

var slider = document.getElementById("prefecture-count");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
    output.innerHTML = this.value;
}