document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tracker-form');
    const progressTableBody = document.querySelector('#progress-table tbody');
    const weekSelect = document.getElementById('week-select');
    const copyButton = document.getElementById('copy-json');
    const jsonOutput = document.getElementById('json-output');

    let progressData = JSON.parse(localStorage.getItem('progressData')) || {};

    const renderProgress = () => {
        progressTableBody.innerHTML = '';
        weekSelect.innerHTML = '<option value="">Select a week</option>';
        for (const week in progressData) {
            const entry = progressData[week];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${week}</td>
                <td>${entry.kanji}</td>
                <td>${entry.goi}</td>
                <td>${entry.bunpou}</td>
            `;
            progressTableBody.appendChild(row);

            const option = document.createElement('option');
            option.value = week;
            option.textContent = `Week ${week}`;
            weekSelect.appendChild(option);
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const week = document.getElementById('week').value;
        const kanji = `${document.getElementById('kanji').value}/12`;
        const goi = `${document.getElementById('goi').value}/12`;
        const bunpou = `${document.getElementById('bunpou').value}/12`;

        if (progressData[week]) {
            if (confirm(`Data for Week ${week} already exists. Do you want to overwrite it?`)) {
                progressData[week] = { kanji, goi, bunpou };
            } else {
                return;
            }
        } else {
            progressData[week] = { kanji, goi, bunpou };
        }

        localStorage.setItem('progressData', JSON.stringify(progressData));

        renderProgress();
        form.reset();
    });

    copyButton.addEventListener('click', () => {
        const selectedWeek = weekSelect.value;
        if (selectedWeek === "") {
            alert("Please select a week to copy.");
            return;
        }

        const selectedData = { [selectedWeek]: progressData[selectedWeek] };
        const jsonData = JSON.stringify(selectedData, null, 2);
        jsonOutput.value = jsonData;
        jsonOutput.select();
        document.execCommand('copy');
        alert(`Data for Week ${selectedWeek} copied to clipboard.`);
    });

    renderProgress();
});
