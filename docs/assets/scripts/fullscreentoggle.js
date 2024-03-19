const poemTitle = document.querySelector('.poem-title');
        const poemContent = document.querySelector('.poem-content');

        poemContent.style.display = 'none';

        poemTitle.addEventListener('click', () => {
            if (poemContent.style.display === 'none') {
                poemContent.style.display = 'block';
                poemTitle.textContent = 'Ada';
            } else {
                poemContent.style.display = 'none';
                poemTitle.textContent = 'Tak Ada';
            }
        });

        const lines = document.querySelectorAll('.line');
        const initialMessage = document.getElementById('initialMessage');
        const revealButton = document.getElementById('revealButton');
        let currentIndex = 0;

        function revealLinesAutomatically() {
            if (currentIndex < lines.length) {
                lines[currentIndex].classList.add('show-line');
                currentIndex++;

                // Scroll to the end after revealing each line
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

                if (currentIndex === lines.length) {
                    // Change the button text to "Selesai" after the last reveal
                    revealButton.textContent = 'Selesai';
                }
            } else if (revealButton.textContent === 'Selesai') {
                // Stop revealing lines after all lines are revealed
                clearInterval(revealInterval);
            }
        }



        // Function to handle button click event
        function handleButtonClick() {

            if (currentIndex === 0) {
                // Hide the initial message on first reveal
                initialMessage.style.display = 'none';
                revealButton.style.display = 'none';

                // Start revealing lines automatically after clicking the button
                revealInterval = setInterval(revealLinesAutomatically, 1000); // Adjust interval as needed
            }
        }

        // Add event listener to the button
        revealButton.addEventListener('click', handleButtonClick);


        if (document.fullscreenEnabled || document.webkitFullscreenEnabled) {
            const toggleBtn = document.querySelector('.js-toggle-fullscreen-btn');

            const styleEl = document.createElement('link');
            styleEl.setAttribute('rel', 'stylesheet');
            styleEl.setAttribute('href', 'https://codepen.io/tiggr/pen/poJoLyW.css');
            styleEl.addEventListener('load', function () {
                toggleBtn.hidden = false;
            });
            document.head.appendChild(styleEl);

            toggleBtn.addEventListener('click', function () {
                if (document.fullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitFullscreenElement) {
                    document.webkitCancelFullScreen()
                } else if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else {
                    document.documentElement.webkitRequestFullScreen();
                }
            });

            document.addEventListener('fullscreenchange', handleFullscreen);
            document.addEventListener('webkitfullscreenchange', handleFullscreen);


            function handleFullscreen() {
                if (document.fullscreen || document.webkitFullscreenElement) {
                    toggleBtn.classList.add('on');
                    toggleBtn.setAttribute('aria-label', 'Exit fullscreen mode');
                } else {
                    toggleBtn.classList.remove('on');
                    toggleBtn.setAttribute('aria-label', 'Enter fullscreen mode');
                }
            }
        }
