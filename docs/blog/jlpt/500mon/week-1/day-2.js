        // Update scores
        const kanjiScore = document.getElementById('kanji-score');
        const goiScore = document.getElementById('goi-score');
        const bunpouScore = document.getElementById('bunpou-score');

        kanjiScore.textContent = '5/5';
        goiScore.textContent = '3/5';
        bunpouScore.textContent = '1/5';

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

        // Get the current page number from the URL
        const currentPageUrl = window.location.href;
        const pageNumberMatch = currentPageUrl.match(/day-(\d+)\.html/);
        const currentPageNumber = pageNumberMatch ? parseInt(pageNumberMatch[1]) : 1;

        // Previous page button
        const prevPageBtn = document.getElementById('prevPage');
        prevPageBtn.addEventListener('click', () => {
            const newPageNumber = currentPageNumber - 1;
            if (newPageNumber > 0) {
                const newUrl = currentPageUrl.replace(/day-\d+\.html/, `day-${newPageNumber}.html`);
                window.location.href = newUrl;
            }
        });

        // Next page button
        const nextPageBtn = document.getElementById('nextPage');
        nextPageBtn.addEventListener('click', () => {
            const newPageNumber = currentPageNumber + 1;
            const newUrl = currentPageUrl.replace(/day-\d+\.html/, `day-${newPageNumber}.html`);
            window.location.href = newUrl;
        });