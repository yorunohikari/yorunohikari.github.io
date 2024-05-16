// Update scores
const kanjiScore = document.getElementById('kanji-score');
const goiScore = document.getElementById('goi-score');
const bunpouScore = document.getElementById('bunpou-score');

// Get the current day number from the HTML
const bannerElement = document.querySelector('.banner');
const dayMatch = bannerElement.textContent.match(/日: (\d+)/);
const currentDay = dayMatch ? parseInt(dayMatch[1]) : 1;

// Fetch data from JSON file based on the current day number
fetch('progress_data.json')
    .then(response => response.json())
    .then(data => {
        // Get scores for the current day
        const scoresForDay = data[currentDay];

        // Update scores
        kanjiScore.textContent = scoresForDay.kanji;
        goiScore.textContent = scoresForDay.goi;
        bunpouScore.textContent = scoresForDay.bunpou;

        // Convert score strings to percentages
        const kanjiPercentage = parseInt(kanjiScore.textContent.split('/')[0]) / parseInt(kanjiScore.textContent.split('/')[1]) * 100;
        const goiPercentage = parseInt(goiScore.textContent.split('/')[0]) / parseInt(goiScore.textContent.split('/')[1]) * 100;
        const bunpouPercentage = parseInt(bunpouScore.textContent.split('/')[0]) / parseInt(bunpouScore.textContent.split('/')[1]) * 100;

        // Update chart data
        myChart.data.datasets[0].data = [kanjiPercentage, goiPercentage, bunpouPercentage];
        myChart.update();
    })
    .catch(error => {
        console.error('Error fetching progress data:', error);
    });


// Get the canvas element
const progressChart = document.getElementById('progress-chart');

// Convert score strings to percentages
const kanjiPercentage = parseInt(kanjiScore.textContent.split('/')[0]) / parseInt(kanjiScore.textContent.split('/')[1]) * 100;
const goiPercentage = parseInt(goiScore.textContent.split('/')[0]) / parseInt(goiScore.textContent.split('/')[1]) * 100;
const bunpouPercentage = parseInt(bunpouScore.textContent.split('/')[0]) / parseInt(bunpouScore.textContent.split('/')[1]) * 100;

// Create a new chart instance
const myChart = new Chart(progressChart, {
    type: 'radar',
    data: {
        labels: ['漢字', '語い', '文法'],
        datasets: [{
            label: '進捗状況',
            data: [kanjiPercentage, goiPercentage, bunpouPercentage],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scale: {
            ticks: {
                beginAtZero: true,
                max: 100,
                stepSize: 20
            },
            startAngle: 0 // Set the starting angle to 0 degrees
        }
    }
});

// Fetch new words data from JSON file based on the current day number
fetch('new_words_data.json')
    .then(response => response.json())
    .then(data => {
        // Get new words for the current day
        const newWordsForDay = data[currentDay];

        // Select the container for new words
        const newWordsContainer = document.querySelector('.new-words');

        // Clear existing content
        newWordsContainer.innerHTML = '';

        // Loop through new words for the day and create HTML elements
        newWordsForDay.forEach(word => {
            // Create new word element
            const newWordElement = document.createElement('div');
            newWordElement.classList.add('new-word');

            // Create heading for the word
            const wordHeading = document.createElement('h3');
            wordHeading.textContent = word.word;
            newWordElement.appendChild(wordHeading);

            // Create paragraph for the meaning
            const meaningParagraph = document.createElement('p');
            meaningParagraph.textContent = `Meaning: ${word.meaning}`;
            newWordElement.appendChild(meaningParagraph);

            // Append new word element to container
            newWordsContainer.appendChild(newWordElement);
        });
    })
    .catch(error => {
        console.error('Error fetching new words data:', error);
    });


// Get the current page URL
const currentPageUrl = window.location.href;

// Extract the current week and day from the URL
const weekMatch = currentPageUrl.match(/week-(\d+)/);
const currentDayMatch = currentPageUrl.match(/day-(\d+)\.html/);

const currentWeekNumber = weekMatch ? parseInt(weekMatch[1]) : 1;
const currentDayNumber = currentDayMatch ? parseInt(currentDayMatch[1]) : 1;

// Previous page button
const prevPageBtn = document.getElementById('prevPage');
prevPageBtn.addEventListener('click', () => {
    let newDayNumber = currentDayNumber - 1;
    let newWeekNumber = currentWeekNumber;

    if (newDayNumber < 1) {
        newWeekNumber = Math.max(currentWeekNumber - 1, 1);
        newDayNumber = 7;
    }

    const newUrl = currentPageUrl
        .replace(/week-\d+/, `week-${newWeekNumber}`)
        .replace(/day-\d+\.html/, `day-${newDayNumber}.html`);
    window.location.href = newUrl;
});

// Next page button
const nextPageBtn = document.getElementById('nextPage');
nextPageBtn.addEventListener('click', () => {
    let newDayNumber = currentDayNumber + 1;
    let newWeekNumber = currentWeekNumber;

    if (newDayNumber > 7) {
        newWeekNumber += 1;
        newDayNumber = 1;
    }

    const newUrl = currentPageUrl
        .replace(/week-\d+/, `week-${newWeekNumber}`)
        .replace(/day-\d+\.html/, `day-${newDayNumber}.html`);
    window.location.href = newUrl;
});
