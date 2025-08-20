function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function truncateText(text, max = 100) {
  if (!text) return "";
  return text.length <= max ? text : text.slice(0, max) + "...";
}

let allPosts = [];
let loadedCount = 0;
const loadStep = 10;
let isLoading = false;

function renderPosts(posts) {
  const container = document.querySelector(".main-col");
  const postsToLoad = posts.slice(loadedCount, loadedCount + loadStep);

  postsToLoad.forEach((post) => {
    const div = document.createElement("div");
    div.className = "card post";

    const dateStr = formatDate(post.modified);
    const desc = truncateText(post.description || "", 100);
    const title = post.title || post.path;

    div.innerHTML = `
      <div class="post-header">
        <img src="/assets/avaiyah.jpg" alt="Profile" class="post-avatar">
        <div class="post-meta">
          <span class="post-name">goshintai</span>
          <span class="post-date">${dateStr}</span>
        </div>
      </div>
      <div class="post-content">
        <p>${title} – ${desc}<a href="/${post.path}" class="read-more"> Read more</a></p>
      </div>
    `;

    container.appendChild(div);
  });

  loadedCount += postsToLoad.length;
  isLoading = false;

  if (loadedCount >= posts.length) {
    const endMsg = document.createElement("div");
    endMsg.className = "end-message";
    endMsg.textContent = "You've reached the bottom.";
    container.appendChild(endMsg);
    window.removeEventListener("scroll", onScroll);
  }
}

function onScroll() {
  if (isLoading) return;

  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    isLoading = true;
    renderPosts(allPosts);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("posts.json")
    .then((res) => res.json())
    .then((posts) => {
      allPosts = posts.sort((a, b) => new Date(b.modified) - new Date(a.modified));
      renderPosts(allPosts);
      window.addEventListener("scroll", onScroll);
    })
    .catch((err) => {
      console.error("Failed to load posts.json:", err);
    });
});
