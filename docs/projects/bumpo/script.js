// script.js

document.addEventListener('DOMContentLoaded', function() {
    loadFormData();
    document.getElementById('save-button').addEventListener('click', function() {
        if (validateForm()) {
            saveHtml();
        }
    });
    document.getElementById('clear-button').addEventListener('click', clearForm);

    // Save form data to local storage on input change
    document.querySelectorAll('input, textarea').forEach(element => {
        element.addEventListener('input', saveFormData);
    });
});

function validateForm() {
    const requiredFields = ['grammar-title', 'meaning', 'translation', 'connection'];
    let isValid = true;

    requiredFields.forEach(id => {
        const element = document.getElementById(id);
        if (!element.value.trim()) {
            alert(`${element.previousElementSibling.innerText} is required.`);
            isValid = false;
        }
    });

    return isValid;
}

function saveHtml() {
    const grammarTitle = document.getElementById('grammar-title').value.trim();
    const meaning = document.getElementById('meaning').value.trim();
    const translation = document.getElementById('translation').value.trim();
    const connection = document.getElementById('connection').value.trim();
    const notes = document.getElementById('notes').value.trim();
    const examples = document.getElementById('examples').value.trim().split('\n');

    const htmlContent = `
    <div class="mySlides fade">
        <div class="container-slide">
            <section class="grammar-point">
                <h3 class="grammar-title">文型：${grammarTitle}</h3>
                <div class="structure">
                    <p class="grammar-description">
                        <strong>[意味]</strong><br />${meaning}
                    </p>
                    <p class="grammar-description">
                        <strong>[英訳]</strong><br />${translation}
                    </p>
                    <p class="grammar-description">
                        <strong>[接続]</strong><br />${connection}
                    </p>
                    <p class="grammar-note">
                        <strong>[備考]</strong><br />${notes}
                    </p>
                </div>
                <div class="examples">
                    <p><strong>例文:</strong></p>
                    <ul>
                        ${examples.map(example => `<li>${example}</li>`).join('')}
                    </ul>
                </div>
            </section>
        </div>
    </div>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${grammarTitle}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('File saved successfully.');
}

function saveFormData() {
    const formData = {
        grammarTitle: document.getElementById('grammar-title').value,
        meaning: document.getElementById('meaning').value,
        translation: document.getElementById('translation').value,
        connection: document.getElementById('connection').value,
        notes: document.getElementById('notes').value,
        examples: document.getElementById('examples').value
    };

    localStorage.setItem('grammarFormData', JSON.stringify(formData));
}

function loadFormData() {
    const savedData = localStorage.getItem('grammarFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        document.getElementById('grammar-title').value = formData.grammarTitle || '';
        document.getElementById('meaning').value = formData.meaning || '';
        document.getElementById('translation').value = formData.translation || '';
        document.getElementById('connection').value = formData.connection || '';
        document.getElementById('notes').value = formData.notes || '';
        document.getElementById('examples').value = formData.examples || '';
    }
}

function clearForm() {
    if (confirm("Are you sure you want to clear the form and local storage?")) {
        document.getElementById('grammar-form').reset();
        localStorage.removeItem('grammarFormData');
        alert('Form and local storage cleared.');
    }
}
