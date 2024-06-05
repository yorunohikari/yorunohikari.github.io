class SearchEngine {
    constructor() {
        this.quizData = { questions: [] };
        this.currentPage = 1;
        this.resultsPerPage = 4;
        this.maxPaginationButtons = 5;
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.fetchQuizData();
            this.addEventListeners();
        });
    }

    addEventListeners() {
        const searchInput = document.getElementById('search-input');
        const clearBtn = document.getElementById('clear-btn');

        searchInput.addEventListener('keyup', () => {
            this.searchQuestions();
        });

        clearBtn.addEventListener('click', () => {
            this.clearSearch();
        });
    }

    fetchQuizData() {
        fetch('quizData.json')
            .then(response => response.json())
            .then(data => {
                this.quizData = data;
            })
            .catch(error => console.error('Error fetching the quiz data:', error));
    }

    searchQuestions() {
        const input = document.getElementById('search-input').value.toLowerCase();
        const resultsContainer = document.getElementById('results-container');
        const statisticsContainer = document.getElementById('statistics-container');
        const searchContainer = document.querySelector('.search-container');
        const logoContainer = document.querySelector('.logo-container');
        const paginationContainer = document.getElementById('pagination-container');
        const clearBtn = document.getElementById('clear-btn');

        resultsContainer.innerHTML = '';
        statisticsContainer.innerHTML = '';
        paginationContainer.innerHTML = '';

        document.title = input ? `検索猫 - ${input}` : '検索猫';

        if (input === '') {
            resultsContainer.style.display = 'none';
            searchContainer.classList.remove('with-logo');
            searchContainer.classList.add('no-logo');
            logoContainer.style.display = 'flex';
            clearBtn.style.display = 'none';
            return;
        } else {
            searchContainer.classList.add('with-logo');
            searchContainer.classList.remove('no-logo');
            logoContainer.style.display = 'none';
            clearBtn.style.display = 'block';
        }

        const filteredQuestions = this.quizData.questions.filter(q =>
            q.question.toLowerCase().includes(input) ||
            q.options.some(option => Object.values(option)[0].toLowerCase().includes(input))
        );

        if (filteredQuestions.length > 0) {
            resultsContainer.style.display = 'block';
            this.showPage(filteredQuestions, 1);
            this.setupPagination(filteredQuestions);
        } else {
            resultsContainer.style.display = 'none';
        }

        const totalResults = filteredQuestions.length;
        statisticsContainer.textContent = `${totalResults} result(s) found.`;
    }

    clearSearch() {
        document.getElementById('search-input').value = '';
        document.getElementById('clear-btn').style.display = 'none';
        this.searchQuestions();
    }

    highlightText(text, keyword) {
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    showPage(questions, page) {
        this.currentPage = page;
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '';
        const start = (page - 1) * this.resultsPerPage;
        const end = start + this.resultsPerPage;
        const paginatedQuestions = questions.slice(start, end);

        paginatedQuestions.forEach(q => {
            const questionElement = document.createElement('div');
            questionElement.className = 'question-container';

            const questionNumber = document.createElement('div');
            questionNumber.className = 'question-number';
            questionNumber.textContent = `Question ${q.number}`;

            const questionText = document.createElement('div');
            questionText.className = 'question-text';
            questionText.innerHTML = this.highlightText(q.question, document.getElementById('search-input').value.toLowerCase());

            const optionsList = document.createElement('ul');
            optionsList.className = 'options';

            q.options.forEach(option => {
                const optionItem = document.createElement('li');
                const optionKey = Object.keys(option)[0];
                const optionValue = option[optionKey];
                optionItem.innerHTML = `${optionKey}: ${this.highlightText(optionValue, document.getElementById('search-input').value.toLowerCase())}`;
                if (parseInt(optionKey) === q.answer) {
                    optionItem.classList.add('correct');
                }
                optionsList.appendChild(optionItem);
            });

            questionElement.appendChild(questionNumber);
            questionElement.appendChild(questionText);
            questionElement.appendChild(optionsList);
            resultsContainer.appendChild(questionElement);
        });
    }

    setupPagination(questions) {
        const paginationContainer = document.getElementById('pagination-container');
        const pageCount = Math.ceil(questions.length / this.resultsPerPage);
        paginationContainer.innerHTML = '';

        const createButton = (text, page) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.className = page === this.currentPage ? 'active' : '';
            button.addEventListener('click', () => {
                this.showPage(questions, page);
                this.updatePaginationButtons(questions, pageCount);
            });
            return button;
        };

        if (pageCount <= this.maxPaginationButtons) {
            for (let i = 1; i <= pageCount; i++) {
                paginationContainer.appendChild(createButton(i, i));
            }
        } else {
            if (this.currentPage > 1) {
                paginationContainer.appendChild(createButton('«', 1));
                paginationContainer.appendChild(createButton('‹', this.currentPage - 1));
            }

            let startPage, endPage;
            if (this.currentPage <= Math.ceil(this.maxPaginationButtons / 2)) {
                startPage = 1;
                endPage = this.maxPaginationButtons;
            } else if (this.currentPage >= pageCount - Math.floor(this.maxPaginationButtons / 2)) {
                startPage = pageCount - this.maxPaginationButtons + 1;
                endPage = pageCount;
            } else {
                startPage = this.currentPage - Math.floor(this.maxPaginationButtons / 2);
                endPage = this.currentPage + Math.floor(this.maxPaginationButtons / 2);
            }

            for (let i = startPage; i <= endPage; i++) {
                paginationContainer.appendChild(createButton(i, i));
            }

            if (this.currentPage < pageCount) {
                paginationContainer.appendChild(createButton('›', this.currentPage + 1));
                paginationContainer.appendChild(createButton('»', pageCount));
            }
        }
    }

    updatePaginationButtons(questions, pageCount) {
        const paginationContainer = document.getElementById('pagination-container');
        this.setupPagination(questions);
    }
}

const searchEngine = new SearchEngine();
searchEngine.init();