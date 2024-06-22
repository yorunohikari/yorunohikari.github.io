class SearchEngine {
    constructor() {
        this.quizData = [];
        this.bunpoData = [];
        this.currentPage = 1;
        this.resultsPerPage = 4;
        this.maxPaginationButtons = 5;
        this.currentTab = 'all'; // Track the current tab
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.fetchQuizData();
            this.fetchBunpoData();
            this.addEventListeners();
        });
    }

    addEventListeners() {
        const searchInput = document.getElementById('search-input');
        const clearBtn = document.getElementById('clear-btn');
        const tabAll = document.getElementById('tab-all');
        const tabBunpo = document.getElementById('tab-bunpo');
        const tabQuiz = document.getElementById('tab-quiz');

        searchInput.addEventListener('keyup', () => this.search());
        clearBtn.addEventListener('click', () => this.clearSearch());

        tabAll.addEventListener('click', () => this.switchTab('all'));
        tabBunpo.addEventListener('click', () => this.switchTab('bunpo'));
        tabQuiz.addEventListener('click', () => this.switchTab('quiz'));
    }

    switchTab(tab) {
        this.currentTab = tab;
        this.currentPage = 1; // Reset to the first page on tab switch
        document.querySelectorAll('.tab').forEach(button => button.classList.remove('active'));
        document.getElementById(`tab-${tab}`).classList.add('active');
        this.search();
    }

    async fetchQuizData() {
        try {
            const response = await fetch('/projects/grindmaster/quizData.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            this.quizData = data.questions;
            this.handleInitialSearch();
        } catch (error) {
            console.error('Error fetching the quiz data:', error);
            alert('Failed to load quiz data. Please try again later.');
        }
    }

    async fetchBunpoData() {
        try {
            const response = await fetch('grammar.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            this.bunpoData = data.grammar;
            this.handleInitialSearch();
        } catch (error) {
            console.error('Error fetching the bunpo data:', error);
            alert('Failed to load bunpo data. Please try again later.');
        }
    }

    handleInitialSearch() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = decodeURIComponent(urlParams.get('s') || '');
        if (searchQuery) {
            document.getElementById('search-input').value = searchQuery;
            this.search();
        }
    }

    search() {
        const input = document.getElementById('search-input').value.toLowerCase();
        const resultsContainer = document.getElementById('results-container');
        const statisticsContainer = document.getElementById('statistics-container');
        const searchContainer = document.getElementById('search-container');
        const logoContainer = document.querySelector('.logo-container');
        const tabsSect = document.querySelector('.tabs');
        const clearBtn = document.getElementById('clear-btn');
        const paginationContainer = document.getElementById('pagination-container');

        resultsContainer.innerHTML = '';
        statisticsContainer.innerHTML = '';
        paginationContainer.innerHTML = '';

        document.title = input ? `Nekomata Search - ${input}` : 'Nekomata Search';
        this.updateURL(input);

        if (input === '') {
            resultsContainer.style.display = 'none';
            searchContainer.classList.remove('with-logo');
            searchContainer.classList.add('no-logo');
            logoContainer.style.display = 'flex';
            tabsSect.style.display = 'none';
            clearBtn.style.display = 'none';
            return;
        }

        searchContainer.classList.add('with-logo');
        searchContainer.classList.remove('no-logo');
        logoContainer.style.display = 'none';
        tabsSect.style.display = 'flex';
        clearBtn.style.display = 'block';

        const bunpoResults = this.bunpoData.filter(lesson =>
            lesson.grammar_points.some(point => point.toLowerCase().includes(input))
        );

        const quizResults = this.quizData.filter(q =>
            q.question.toLowerCase().includes(input) ||
            q.options.some(option => Object.values(option)[0].toLowerCase().includes(input))
        );

        let results = [];
        if (this.currentTab === 'all') {
            results = [...bunpoResults, ...quizResults];
        } else if (this.currentTab === 'bunpo') {
            results = bunpoResults;
        } else if (this.currentTab === 'quiz') {
            results = quizResults;
        }

        if (results.length > 0) {
            resultsContainer.style.display = 'block';
            this.showPage(results, 1);
            this.setupPagination(results);
        } else {
            resultsContainer.style.display = 'none';
        }

        statisticsContainer.textContent = `${results.length} result(s) found.`;
    }

    clearSearch() {
        document.getElementById('search-input').value = '';
        document.getElementById('clear-btn').style.display = 'none';
        this.search();
    }

    updateURL(searchQuery) {
        const url = new URL(window.location);
        if (searchQuery) {
            url.searchParams.set('s', encodeURIComponent(searchQuery));
        } else {
            url.searchParams.delete('s');
        }
        history.replaceState({}, '', url);
    }

    showPage(results, page) {
        this.currentPage = page;
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '';
        const start = (page - 1) * this.resultsPerPage;
        const end = start + this.resultsPerPage;
        const paginatedResults = results.slice(start, end);

        paginatedResults.forEach(result => {
            if (result.hasOwnProperty('question')) {
                // Quiz result
                const questionElement = document.createElement('div');
                questionElement.className = 'question-container';

                const questionNumber = document.createElement('div');
                questionNumber.className = 'question-number';
                questionNumber.textContent = `Question ${result.number}`;

                const questionText = document.createElement('div');
                questionText.className = 'question-text';
                questionText.innerHTML = this.highlightText(result.question, document.getElementById('search-input').value.toLowerCase());

                const optionsList = document.createElement('ul');
                optionsList.className = 'options';

                result.options.forEach(option => {
                    const optionItem = document.createElement('li');
                    const optionKey = Object.keys(option)[0];
                    const optionValue = option[optionKey];
                    optionItem.innerHTML = `${optionKey}: ${this.highlightText(optionValue, document.getElementById('search-input').value.toLowerCase())}`;
                    if (parseInt(optionKey, 10) === result.answer) {
                        optionItem.classList.add('correct');
                    }
                    optionsList.appendChild(optionItem);
                });

                questionElement.appendChild(questionNumber);
                questionElement.appendChild(questionText);
                questionElement.appendChild(optionsList);
                resultsContainer.appendChild(questionElement);
            } else {
                // Bunpo result
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';

                const resultTitle = document.createElement('div');
                resultTitle.className = 'result-title';

                const titleLink = document.createElement('a');
                titleLink.href = result.url;
                titleLink.textContent = result.title;

                resultTitle.appendChild(titleLink);

                const resultUrl = document.createElement('div');
                resultUrl.className = 'result-url';
                resultUrl.textContent = "https://goshintai.xyz/blog/jlpt/bunpo/" + result.url;

                const resultDescription = document.createElement('div');
                resultDescription.className = 'result-description';
                resultDescription.textContent = `Grammar points: ${result.grammar_points.join(', ')}`;

                resultItem.appendChild(resultTitle);
                resultItem.appendChild(resultUrl);
                resultItem.appendChild(resultDescription);
                resultsContainer.appendChild(resultItem);
            }
        });

        // Update active state in pagination buttons
        this.updatePaginationButtons(results, Math.ceil(results.length / this.resultsPerPage));
    }

    setupPagination(results) {
        const paginationContainer = document.getElementById('pagination-container');
        const pageCount = Math.ceil(results.length / this.resultsPerPage);
        paginationContainer.innerHTML = '';

        const createButton = (text, page) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.className = page === this.currentPage ? 'active' : '';
            button.addEventListener('click', () => {
                this.showPage(results, page);
                this.updatePaginationButtons(results, pageCount);
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

    updatePaginationButtons(results, pageCount) {
        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.innerHTML = '';

        const createButton = (text, page) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.className = page === this.currentPage ? 'active' : '';
            button.addEventListener('click', () => {
                this.showPage(results, page);
                this.updatePaginationButtons(results, pageCount);
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

    highlightText(text, keyword) {
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
}

const searchEngine = new SearchEngine();
searchEngine.init();
