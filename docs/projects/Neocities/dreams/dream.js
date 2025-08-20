let allDreams = [];
let filteredDreams = [];
let currentPage = 1;
const dreamsPerPage = 6; 

async function loadDreams() {
    try {
        const response = await fetch('dreams.json');
        const data = await response.json();
        allDreams = data.dreams.sort((a, b) => new Date(b.date) - new Date(a.date));
        filteredDreams = [...allDreams];
        updateStats();
        renderDreams();
        renderPagination();
    } catch (error) {
        console.error('Error loading dreams:', error);
        document.getElementById('dreamsGrid').innerHTML = 
            '<div class="no-results">Error loading dreams. Reload the page to try again.</div>';
    }
}

function updateStats() {
    const totalDreams = allDreams.length;
    const lucidDreams = allDreams.filter(dream => dream.lucidity >= 3).length;
    const avgLucidity = totalDreams > 0 ? 
        (allDreams.reduce((sum, dream) => sum + dream.lucidity, 0) / totalDreams).toFixed(1) : 0;
    
    document.getElementById('totalDreams').textContent = totalDreams;
    document.getElementById('lucidDreams').textContent = lucidDreams;
    document.getElementById('avgLucidity').textContent = avgLucidity;
}

function getCurrentPageDreams() {
    const startIndex = (currentPage - 1) * dreamsPerPage;
    const endIndex = startIndex + dreamsPerPage;
    return filteredDreams.slice(startIndex, endIndex);
}

function getTotalPages() {
    return Math.ceil(filteredDreams.length / dreamsPerPage);
}

function renderDreams() {
    const grid = document.getElementById('dreamsGrid');
    const currentDreams = getCurrentPageDreams();
    
    if (filteredDreams.length === 0) {
        grid.innerHTML = '<div class="no-results">No dreams found matching your search.</div>';
        return;
    }
    
    if (currentDreams.length === 0) {
        currentPage = 1;
        renderDreams();
        renderPagination();
        return;
    }
    
    grid.innerHTML = currentDreams.map(dream => `
        <a href="${dream.link}" class="dream-card">
            <div class="dream-header">
                <div class="dream-id">${dream.id}</div>
                <div class="dream-title">${dream.title}</div>
                <div class="dream-date">${formatDate(dream.date)}</div>
            </div>
            
            <div class="dream-metadata">
                <span>mood: ${dream.mood}</span>
                <div class="lucidity-display">
                    <span>lucidity:</span>
                    <div class="lucidity-dots">
                        ${[1,2,3,4,5].map(i => 
                            `<div class="lucidity-dot ${i <= dream.lucidity ? 'active' : ''}"></div>`
                        ).join('')}
                    </div>
                </div>
            </div>
            
            <div class="dream-tags">
                ${dream.tags.map(tag => `<span class="dream-tag">${tag}</span>`).join('')}
            </div>
            
            <div class="dream-excerpt">${dream.brief_narrative}</div>
        </a>
    `).join('');
}

function renderPagination() {
    const totalPages = getTotalPages();
    const paginationContainer = document.getElementById('pagination');
    
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) {
            paginationContainer.style.display = 'none';
        }
        return;
    }
    
    paginationContainer.style.display = 'flex';
    
    let paginationHTML = '';
    
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage - 1})">‹ prev</button>`;
    }
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage ? 'active' : '';
        paginationHTML += `<button class="pagination-btn ${isActive}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage + 1})">next ›</button>`;
    }
    
    const startItem = (currentPage - 1) * dreamsPerPage + 1;
    const endItem = Math.min(currentPage * dreamsPerPage, filteredDreams.length);
    const pageInfo = `<div class="pagination-info">showing ${startItem}-${endItem} of ${filteredDreams.length} dreams</div>`;
    
    paginationContainer.innerHTML = paginationHTML + pageInfo;
}

function goToPage(page) {
    const totalPages = getTotalPages();
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderDreams();
        renderPagination();
        document.getElementById('dreamsGrid').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
}

function searchDreams(query) {
    if (!query.trim()) {
        filteredDreams = [...allDreams];
    } else {
        const lowerQuery = query.toLowerCase();
        filteredDreams = allDreams.filter(dream => 
            dream.title.toLowerCase().includes(lowerQuery) ||
            dream.brief_narrative.toLowerCase().includes(lowerQuery) ||
            dream.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
            dream.mood.toLowerCase().includes(lowerQuery)
        );
    }
    
    currentPage = 1;
    renderDreams();
    renderPagination();
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    searchDreams(e.target.value);
});

document.addEventListener('keydown', (e) => {
    if (e.target.tagName.toLowerCase() === 'input') return; 
    
    const totalPages = getTotalPages();
    
    if (e.key === 'ArrowLeft' && currentPage > 1) {
        e.preventDefault();
        goToPage(currentPage - 1);
    } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        e.preventDefault();
        goToPage(currentPage + 1);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateTerminalPath();
    loadDreams();
});