document.addEventListener('DOMContentLoaded', function () {
    // Load and visualize data for each week
    loadProgressData(1);
    loadProgressData(2);
    loadProgressData(3);
    loadProgressData(4);

});

function loadProgressData(weekNumber) {
    fetch(`progress_data_week_${weekNumber}.json`)
        .then(response => response.json())
        .then(data => {
            createSummaryTable(data, weekNumber);
            visualizeProgress(data, weekNumber);
        })
        .catch(error => console.error('Error loading JSON data:', error));
}

function createSummaryTable(data, weekNumber) {
    const table = document.getElementById(`tableWeek${weekNumber}`);
    table.innerHTML = `
        <tr>
            <th>Day</th>
            <th>Kanji</th>
            <th>Vocabulary</th>
            <th>Grammar</th>
        </tr>
    `;

    Object.keys(data).forEach(day => {
        const row = `
            <tr>
                <td>${day}</td>
                <td>${data[day].kanji}</td>
                <td>${data[day].goi}</td>
                <td>${data[day].bunpou}</td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

function visualizeProgress(data, weekNumber) {
    const ctx = document.getElementById(`chartWeek${weekNumber}`).getContext('2d');

    const labels = Object.keys(data);
    const kanjiScores = labels.map(day => parseInt(data[day].kanji.split('/')[0]));
    const goiScores = labels.map(day => parseInt(data[day].goi.split('/')[0]));
    const bunpouScores = labels.map(day => parseInt(data[day].bunpou.split('/')[0]));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Kanji',
                    data: kanjiScores,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    fill: false
                },
                {
                    label: 'Vocabulary',
                    data: goiScores,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    fill: false
                },
                {
                    label: 'Grammar',
                    data: bunpouScores,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
