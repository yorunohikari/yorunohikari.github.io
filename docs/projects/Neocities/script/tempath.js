function updateTerminalPath() {
    const path = window.location.pathname;
    const hostname = window.location.hostname;

    let basePath;
    if (hostname.includes('neocities.org')) {
        basePath = '~/goshintai.neocities.org';
    } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        basePath = '~/localhost/goshintai';
    } else {
        basePath = '~/goshintai.neocities.org';
    }

    const fullPath = basePath + (path === '/' ? '/index.html' : path);
    document.getElementById('terminal-path').textContent = fullPath;
}

document.addEventListener('DOMContentLoaded', updateTerminalPath);

document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("terminal-path");
    const fullText = el.textContent;
    el.textContent = ""; // clear existing text

    let i = 0;
    const speed = 50; // milliseconds per character

    function typeChar() {
        if (i < fullText.length) {
            el.textContent += fullText.charAt(i);
            i++;
            setTimeout(typeChar, speed);
        }
    }

    typeChar();
});

