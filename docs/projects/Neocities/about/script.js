document.addEventListener("DOMContentLoaded", () => {
    fetch("anime.json")
        .then((res) => res.json())
        .then((data) => {
            renderAnimeSection(data.Watching, "currently-watching", "watching");
            renderAnimeSection(data.Completed, "completed-anime", "completed", 10);
            renderAnimeSection(data["On-Hold"], "on-hold-anime", "on-hold", 10);
            renderAnimeSection(data.Dropped, "dropped-anime", "dropped", 10);
        })
        .catch(() => {
            const loaders = document.querySelectorAll(".loading");
            loaders.forEach(loader => loader.innerText = "Failed to load anime data.");
        });
});

// Collapsible functionality
function toggleCollapsible(element) {
    const arrow = element.querySelector('.collapsible-arrow');
    const content = element.nextElementSibling;

    arrow.classList.toggle('expanded');
    content.classList.toggle('expanded');
}

function renderAnimeSection(animeList, containerId, status, pageSize = null) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    let page = 1;

    function renderPage() {
        container.innerHTML = "";

        const start = (page - 1) * pageSize;
        const end = pageSize ? start + pageSize : animeList.length;
        const currentPageItems = pageSize ? animeList.slice(start, end) : animeList;

        const grid = document.createElement("div");
        grid.className = "anime-grid";

        currentPageItems.forEach(anime => {
            const card = document.createElement("a");
            card.href = anime.link;
            card.className = "anime-link anime-card";
            card.target = "_blank";
            card.rel = "noopener noreferrer";

            const title = document.createElement("div");
            title.className = "anime-title";
            title.textContent = anime.name;

            const idText = document.createElement("div");
            idText.className = "anime-mal-id";
            idText.textContent = `ID: ${anime.mal_id}`;

            const badge = document.createElement("div");
            badge.className = `anime-status status-${status}`;
            badge.textContent = status;

            card.appendChild(title);
            card.appendChild(idText);
            card.appendChild(badge);

            grid.appendChild(card);
        });

        container.appendChild(grid);

        if (pageSize && animeList.length > pageSize) {
            const pagination = document.createElement("div");
            pagination.className = "pagination";

            const prev = document.createElement("button");
            prev.textContent = "Prev";
            prev.className = "pagination-btn";
            prev.disabled = page === 1;
            prev.onclick = () => {
                page--;
                renderPage();
            };

            const next = document.createElement("button");
            next.textContent = "Next";
            next.className = "pagination-btn";
            next.disabled = page * pageSize >= animeList.length;
            next.onclick = () => {
                page++;
                renderPage();
            };

            const info = document.createElement("span");
            info.className = "pagination-info";
            info.textContent = `Page ${page} of ${Math.ceil(animeList.length / pageSize)}`;

            pagination.appendChild(prev);
            pagination.appendChild(info);
            pagination.appendChild(next);

            container.appendChild(pagination);
        }
    }

    renderPage();
}