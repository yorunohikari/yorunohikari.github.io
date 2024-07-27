// Define constants
const dataKey = 'jsonData';
const entriesPerPage = 5; // Number of entries per page
let currentPage = 1; // Current page
let jsonData = loadJSON();

// Function to load JSON data from localStorage
function loadJSON() {
    const savedData = localStorage.getItem(dataKey);
    return savedData ? JSON.parse(savedData) : [];
}

// Function to save JSON data to localStorage
function saveJSON() {
    const scrollPosition = window.pageYOffset;
    if (checkForDuplicates()) {
        showWarning('Duplicate number detected! Each entry must have a unique number.');
        return;
    }
    localStorage.setItem(dataKey, JSON.stringify(jsonData));
    renderTable();
    window.scrollTo(0, scrollPosition);
}

// Function to check for duplicate entries
function checkForDuplicates(newNumber, index) {
    return jsonData.some((entry, i) => entry.number === newNumber && i !== index);
}

// Function to show a warning message
function showWarning(message) {
    const warningDiv = document.getElementById('warningDiv');
    warningDiv.innerText = message;
    warningDiv.style.display = 'block';
}

// Function to hide the warning message
function hideWarning() {
    const warningDiv = document.getElementById('warningDiv');
    warningDiv.style.display = 'none';
}

// Function to create a new entry with default values
function createNewEntry(index) {
    return {
        number: index + 1,
        type: '',
        question: '',
        options: [{ "1": "" }, { "2": "" }, { "3": "" }, { "4": "" }],
        answer: 0,  // Answer as a number
        answer_text: ''
    };
}

function createNewEntryTwo(index) {
    return {
        number: index + 1,
        type: '',
        question: '',
        options: [{ "1": "" }, { "2": "" }],
        answer: 0,  // Answer as a number
        answer_text: ''
    };
}

// Function to renumber all entries in jsonData
function renumberEntries() {
    jsonData.forEach((entry, index) => {
        entry.number = index + 1;
    });
}

// Function to update an entry's field in jsonData
function updateEntry(index, key, value) {
    if (key === 'number') {
        const newNumber = parseInt(value);
        if (checkForDuplicates(newNumber, index)) {
            showWarning('Duplicate number detected! Each entry must have a unique number.');
            return;
        } else {
            hideWarning();
            jsonData[index].number = newNumber;
        }
    } else if (key === 'options') {
        jsonData[index].options[value.optionIndex][value.optionKey] = value.optionValue;
    } else {
        // Parse as a number if the key is 'answer'
        jsonData[index][key] = key === 'answer' ? parseInt(value) : value;
    }
    saveJSON();
}

// Function to delete an entry from jsonData
function deleteEntry(index) {
    jsonData.splice(index, 1);
    renumberEntries();
    saveJSON();
}

// Function to add a new entry
function addNewEntry() {
    jsonData.push(createNewEntry(jsonData.length));
    renumberEntries();
    saveJSON();
}

function addNewEntryTwo() {
    jsonData.push(createNewEntryTwo(jsonData.length));
    renumberEntries();
    saveJSON();
}

// Function to add an entry above the given index
function addEntryAbove(index) {
    jsonData.splice(index, 0, createNewEntry(index));
    renumberEntries();
    saveJSON();
}

// Function to add an entry below the given index
function addEntryBelow(index) {
    jsonData.splice(index + 1, 0, createNewEntry(index + 1));
    renumberEntries();
    saveJSON();
}

// Function to adjust the height of a textarea to fit its content
function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

// Function to export jsonData as a JSON file
function exportJSON() {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `data-${timestamp}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}


// Function to import JSON data from a file
function importJSON(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            jsonData = JSON.parse(e.target.result);
            saveJSON();
        } catch (error) {
            alert("Invalid JSON file.");
        }
    };
    reader.readAsText(file);
}

// Function to render the data table
function renderTable() {
    const tbody = document.getElementById('jsonTable').querySelector('tbody');
    tbody.innerHTML = '';

    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, jsonData.length);

    for (let i = startIndex; i < endIndex; i++) {
        const entry = jsonData[i];
        const row = document.createElement('tr');

        // Add data-type attribute based on entry type
        row.setAttribute('data-type', getTypeNumber(entry.type));

        row.innerHTML = `
            <td><input type="number" value="${entry.number}" onchange="updateEntry(${i}, 'number', this.value)"></td>
            <td>
                <select onchange="updateEntry(${i}, 'type', this.value); updateRowType(this)">
                    <option value="" ${entry.type === '' ? 'selected' : ''}></option>
                    <option value="moji" ${entry.type === 'moji' ? 'selected' : ''}>moji</option>
                    <option value="goi" ${entry.type === 'goi' ? 'selected' : ''}>goi</option>
                    <option value="bunpo" ${entry.type === 'bunpo' ? 'selected' : ''}>bunpo</option>
                </select>
            </td>
            <td><textarea class="qinput" rows="2" oninput="adjustTextareaHeight(this)" onchange="updateEntry(${i}, 'question', this.value)">${entry.question}</textarea></td>
            <td class="options-container">
                ${entry.options.map((opt, j) => `
                    <div class="option-input">
                        <label>${j + 1}</label>
                        <input type="text" value="${opt[j + 1]}" onchange="updateEntry(${i}, 'options', {optionIndex: ${j}, optionKey: ${j + 1}, optionValue: this.value})">
                    </div>`).join('')}
            </td>
            <td>
                <select onchange="updateEntry(${i}, 'answer', parseInt(this.value))">
                    <option value="" ${entry.answer === 0 ? 'selected' : ''}></option>
                    <option value="1" ${entry.answer === 1 ? 'selected' : ''}>1</option>
                    <option value="2" ${entry.answer === 2 ? 'selected' : ''}>2</option>
                    <option value="3" ${entry.answer === 3 ? 'selected' : ''}>3</option>
                    <option value="4" ${entry.answer === 4 ? 'selected' : ''}>4</option>
                </select>
            </td>
            <td><input type="text" value="${entry.answer_text}" onchange="updateEntry(${i}, 'answer_text', this.value)"></td>
            <td>
                <button title="Click to delete this row" class="btn" onclick="deleteEntry(${i})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
        adjustTextareaHeight(row.querySelector('textarea'));
    }

    renderPaginationButtons();
}

// Helper function to convert type string to number
function getTypeNumber(type) {
    switch (type) {
        case 'moji': return '1';
        case 'goi': return '2';
        case 'bunpo': return '3';
        default: return '';
    }
}

// Function to update row type when select changes
function updateRowType(selectElement) {
    const row = selectElement.closest('tr');
    const type = getTypeNumber(selectElement.value);
    row.setAttribute('data-type', type);
}

// Function to render pagination buttons
function renderPaginationButtons() {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    const totalPages = Math.ceil(jsonData.length / entriesPerPage);
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);

    if (endPage - startPage < 4) {
        startPage = Math.max(endPage - 4, 1);
    }

    // First page button
    addPageButton('<<', 1, currentPage !== 1);

    // Previous page button
    addPageButton('<', currentPage - 1, currentPage > 1);

    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i, i, true, i === currentPage);
    }

    // Next page button
    addPageButton('>', currentPage + 1, currentPage < totalPages);

    // Last page button
    addPageButton('>>', totalPages, currentPage !== totalPages);

    function addPageButton(text, pageNumber, enabled, isCurrent = false) {
        const button = document.createElement('button');
        button.className = `btn${isCurrent ? ' current-page' : ''}`;
        button.innerText = text;
        button.disabled = !enabled;
        button.onclick = () => {
            currentPage = pageNumber;
            renderTable();
        };
        paginationDiv.appendChild(button);
    }
}

function clearGotoForm() {
    document.getElementById('gotoNumber').value = '';
}

// Function to navigate to a specific entry by number
function goToEntry(number) {
    const entryIndex = jsonData.findIndex(entry => entry.number == number);
    if (entryIndex !== -1) {
        currentPage = Math.ceil((entryIndex + 1) / entriesPerPage);
        renderTable();
    } else {
        alert('Entry not found.');
    }

}

function goToNumber() {
    const number = parseInt(document.getElementById('gotoNumber').value);
    if (!isNaN(number)) {
        goToEntry(number);
    } else {
        alert('Please enter a valid number.');
    }
    document.getElementById('gotoDiv').style.display = 'none';
}


// Function to insert ruby text at the cursor position
function insertRubyAtCursor() {
    const rubyText = "<ruby><rt></rt></ruby>";
    const activeElement = document.activeElement;

    if (activeElement && (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT")) {
        if (activeElement.tagName === "TEXTAREA") {
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            activeElement.value = activeElement.value.substring(0, start) + rubyText + activeElement.value.substring(end);
            activeElement.selectionStart = start + 6; // Adjust cursor position inside <rt> tag
            activeElement.selectionEnd = start + 6;
        } else if (activeElement.tagName === "INPUT") {
            const currentValue = activeElement.value;
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            activeElement.value = currentValue.substring(0, start) + rubyText + currentValue.substring(end);
            activeElement.selectionStart = start + 6; // Adjust cursor position inside <rt> tag
            activeElement.selectionEnd = start + 6;
        }
        activeElement.focus();
    } else {
        alert("Please place the cursor in a textarea or input field to insert ruby text.");
    }
}


function insertEmAtCursor() {
    const emText = "<em></em>";
    const activeElement = document.activeElement;

    if (activeElement && (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT")) {
        if (activeElement.tagName === "TEXTAREA") {
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            activeElement.value = activeElement.value.substring(0, start) + emText + activeElement.value.substring(end);
            activeElement.selectionStart = start + 4; // Adjust cursor position inside <em> tag
            activeElement.selectionEnd = start + 4;
        } else if (activeElement.tagName === "INPUT") {
            const currentValue = activeElement.value;
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            activeElement.value = currentValue.substring(0, start) + emText + currentValue.substring(end);
            activeElement.selectionStart = start + 4; // Adjust cursor position inside <em> tag
            activeElement.selectionEnd = start + 4;
        }
        activeElement.focus();
    } else {
        alert("Please place the cursor in a textarea or input field to insert em text.");
    }
}


// Event listener for the keydown event
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'r') {
        insertRubyAtCursor();
        event.preventDefault();
    }
    if (event.ctrlKey && event.key === 'm') {
        insertEmAtCursor();
        event.preventDefault();
    }
    if (event.ctrlKey && event.key === 'q') {
        addNewEntry();
    }
    if (event.ctrlKey && event.key === 'e') {
        addNewEntryTwo();
    }
    if (event.ctrlKey && event.key === 'g') {
        event.preventDefault(); // Prevent the default browser action
        toggleGotoDiv();
    }
});

document.getElementById('gotoForm').addEventListener('submit', function (event) {
    event.preventDefault();
    goToNumber();
});


function toggleGotoDiv() {
    const gotoDiv = document.getElementById('gotoDiv');
    if (gotoDiv.style.display === 'none' || gotoDiv.style.display === '') {
        gotoDiv.style.display = 'flex';
        document.getElementById('gotoNumber').focus();
    } else {
        gotoDiv.style.display = 'none';
    }
    clearGotoForm();
}

document.addEventListener('click', function (event) {
    const gotoDiv = document.getElementById('gotoDiv');
    if (event.target !== gotoDiv && !gotoDiv.contains(event.target)) {
        gotoDiv.style.display = 'none';
    }
});

// Initial rendering of the table
renderTable();
