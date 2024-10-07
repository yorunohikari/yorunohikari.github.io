let books = [];
let currentBook = null;
let currentChapter = 0;
let currentPage = 1;
const wordsPerPage = 100;
let pages = [];

async function loadBooks() {
    const response = await fetch('books.json');
    const data = await response.json();
    books = data.books;
    displayBookList();
}

function displayBookList() {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';
        bookItem.innerHTML = `
            <img src="${book.cover}" alt="${book.title} cover">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
        `;
        bookItem.onclick = () => openBook(book.id);
        bookList.appendChild(bookItem);
    });
}

function openBook(bookId) {
    currentBook = books.find(book => book.id === bookId);
    currentChapter = 0;
    currentPage = 1;
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    initReader();
}

function initReader() {
    loadChapter(currentChapter);
    generateTableOfContents();
    loadBookmarks();
    loadProgress();
    setupNavigation();
}

function loadChapter(chapterIndex) {
    const content = document.getElementById('content');
    content.innerHTML = '';
    const words = currentBook.chapters[chapterIndex].content.split(' ');
    pages = [];

    for (let i = 0; i < words.length; i += wordsPerPage) {
        const pageContent = words.slice(i, i + wordsPerPage).join(' ');
        pages.push(pageContent);
    }

    currentChapter = chapterIndex;
    currentPage = 1;
    updatePageDisplay();
    updatePageInfo();
}

function updatePageDisplay() {
    const content = document.getElementById('content');
    content.innerHTML = '';
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page';
    pageDiv.textContent = pages[currentPage - 1];
    content.appendChild(pageDiv);
}

function updatePageInfo() {
    const totalPages = pages.length;
    document.getElementById('current-page').textContent = currentPage;
    document.getElementById('total-pages').textContent = `of ${totalPages}`;
    document.getElementById('page-slider').max = totalPages;
    document.getElementById('page-slider').value = currentPage;
}

function generateTableOfContents() {
    const tocList = document.getElementById('toc-list');
    tocList.innerHTML = '';
    currentBook.chapters.forEach((chapter, index) => {
        const li = document.createElement('li');
        li.textContent = chapter.title;
        li.onclick = () => {
            loadChapter(index);
            document.getElementById('toc-modal').style.display = 'none';
        };
        tocList.appendChild(li);
    });
}

function setupNavigation() {
    const leftOverlay = document.querySelector('.navigation-overlay.left');
    const rightOverlay = document.querySelector('.navigation-overlay.right');
    const content = document.getElementById('content');

    leftOverlay.onclick = (e) => {
        e.preventDefault();
        previousPage();
    };
    rightOverlay.onclick = (e) => {
        e.preventDefault();
        nextPage();
    };

    content.addEventListener('click', (e) => {
        if (isClickOnButton(e.target)) {
            return;
        }
        const rect = content.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width * 0.3) {
            previousPage();
        } else if (x > rect.width * 0.7) {
            nextPage();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') previousPage();
        if (e.key === 'ArrowRight') nextPage();
    });
}

function isClickOnButton(element) {
    while (element !== null) {
        if (element.tagName === 'BUTTON') {
            return true;
        }
        element = element.parentElement;
    }
    return false;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePageDisplay();
        updatePageInfo();
    } else if (currentChapter > 0) {
        currentChapter--;
        loadChapter(currentChapter);
    }
}

function nextPage() {
    if (currentPage < pages.length) {
        currentPage++;
        updatePageDisplay();
        updatePageInfo();
    } else if (currentChapter < currentBook.chapters.length - 1) {
        currentChapter++;
        loadChapter(currentChapter);
    }
}

function toggleBookmark() {
    const bookmark = { bookId: currentBook.id, chapter: currentChapter, page: currentPage };
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const index = bookmarks.findIndex(b => b.bookId === bookmark.bookId && b.chapter === bookmark.chapter && b.page === bookmark.page);
    if (index === -1) {
        bookmarks.push(bookmark);
        alert('Bookmark added!');
    } else {
        bookmarks.splice(index, 1);
        alert('Bookmark removed!');
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    loadBookmarks();
}

function loadBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const bookmarkList = document.getElementById('bookmark-list');
    bookmarkList.innerHTML = '';
    
    const currentBookBookmarks = bookmarks.filter(b => b.bookId === currentBook.id);
    
    currentBookBookmarks.forEach(bookmark => {
        const li = document.createElement('li');
        li.textContent = `Chapter ${bookmark.chapter + 1}, Page ${bookmark.page}`;
        li.onclick = () => {
            currentChapter = bookmark.chapter;
            loadChapter(currentChapter);
            currentPage = bookmark.page;
            updatePageDisplay();
            document.getElementById('bookmark-modal').style.display = 'none';
        };
        bookmarkList.appendChild(li);
    });
}

function saveProgress() {
    localStorage.setItem('progress', JSON.stringify({ bookId: currentBook.id, chapter: currentChapter, page: currentPage }));
}

function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('progress'));
    if (progress && progress.bookId === currentBook.id) {
        currentChapter = progress.chapter;
        currentPage = progress.page;
        loadChapter(currentChapter);
        updatePageDisplay();
        updatePageInfo();
    }
}

document.getElementById('back-btn').onclick = () => {
    document.getElementById('reader').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
};
document.getElementById('toc-btn').onclick = () => document.getElementById('toc-modal').style.display = 'block';
document.getElementById('font-btn').onclick = () => document.getElementById('font-modal').style.display = 'block';
document.getElementById('search-btn').onclick = () => document.getElementById('search-modal').style.display = 'block';
document.getElementById('bookmark-btn').onclick = () => {
    toggleBookmark();
    document.getElementById('bookmark-modal').style.display = 'block';
};

document.querySelectorAll('.font-size-btn').forEach(btn => {
    btn.onclick = () => {
        document.getElementById('content').style.fontSize = btn.dataset.size;
        document.getElementById('font-modal').style.display = 'none';
    };
});

document.getElementById('search-input').oninput = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const results = currentBook.chapters.flatMap((chapter, chapterIndex) => 
        chapter.content.toLowerCase().split(' ').map((word, wordIndex) => ({
            word,
            chapterIndex,
            wordIndex
        }))
    ).filter(item => item.word.includes(searchTerm));

    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    results.forEach(result => {
        const li = document.createElement('li');
        li.textContent = `${currentBook.chapters[result.chapterIndex].title}: ${result.word}`;
        li.onclick = () => {
            loadChapter(result.chapterIndex);
            currentPage = Math.floor(result.wordIndex / wordsPerPage) + 1;
            updatePageDisplay();
            updatePageInfo();
            document.getElementById('search-modal').style.display = 'none';
        };
        searchResults.appendChild(li);
    });
};

document.getElementById('page-slider').oninput = (e) => {
    currentPage = parseInt(e.target.value);
    updatePageDisplay();
    updatePageInfo();
};

window.onclick = (event) => {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
};

window.onload = loadBooks;
window.onbeforeunload = saveProgress;