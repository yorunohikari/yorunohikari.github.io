  // Your JSON data
  const jsonData = {
    "1": {"kanji": "4/5", "goi": "1/5", "bunpou": "1/5"},
    "2": {"kanji": "4/5", "goi": "0/5", "bunpou": "3/5"},
    "3": {"kanji": "2/5", "goi": "3/5", "bunpou": "2/5"},
    "4": {"kanji": "2/5", "goi": "2/5", "bunpou": "3/5"},
    "5": {"kanji": "2/5", "goi": "1/5", "bunpou": "2/5"},
    "6": {"kanji": "3/5", "goi": "3/5", "bunpou": "2/5"}
};

// Parsing the data to extract scores
const labels = Object.keys(jsonData);
const kanjiScores = labels.map(day => parseInt(jsonData[day].kanji.split('/')[0]));
const goiScores = labels.map(day => parseInt(jsonData[day].goi.split('/')[0]));
const bunpouScores = labels.map(day => parseInt(jsonData[day].bunpou.split('/')[0]));

// Creating the chart
const ctx = document.getElementById('scoreChart').getContext('2d');
const scoreChart = new Chart(ctx, {
    type: 'line', // You can also use 'bar', 'radar', etc.
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Kanji',
                data: kanjiScores,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false
            },
            {
                label: 'Goi',
                data: goiScores,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: false
            },
            {
                label: 'Bunpou',
                data: bunpouScores,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 5
            }
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Scores Over Days'
            }
        }
    }
});
