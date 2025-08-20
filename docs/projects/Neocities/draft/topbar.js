document.addEventListener("DOMContentLoaded", () => {
  const topbarHTML = `
    <div class="topbar">
      <div class="logo">goshintai</div>
      <div class="nav-links">
        <a href="/" title="Home">
          <img src="/assets/icon/icon-home.png" alt="Home Icon" class="nav-icon">
          <span class="label">Home</span>
        </a>
        <a href="/projects/" title="Projects">
          <img src="/assets/icon/icon-projects.png" alt="Projects Icon" class="nav-icon">
          <span class="label">Projects</span>
        </a>
        <a href="/blog/" title="Blog">
          <img src="/assets/icon/icon-blog.png" alt="Blog Icon" class="nav-icon">
          <span class="label">Blog</span>
        </a>
        <a href="/dreams/" title="Dreams">
          <img src="/assets/icon/icon-dreams.png" alt="Dreams Icon" class="nav-icon">
          <span class="label">Dreams</span>
        </a>
        <a href="/about/" title="About">
          <img src="/assets/icon/icon-about.png" alt="About Icon" class="nav-icon">
          <span class="label">About</span>
        </a>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("afterbegin", topbarHTML);
});
