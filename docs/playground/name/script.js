let loader = document.getElementById('loader');
let speedDisplay = document.getElementById('speed');
let startButton = document.getElementById('startButton');
let latencyDisplay = document.getElementById('latency');
let downloadDisplay = document.getElementById('downloadSpeed');
let uploadDisplay = document.getElementById('uploadSpeed');

let totalTestTime = 30; // Test time in seconds
let latency = 0;

function testSpeed() {
    startLoader();
    testDownloadSpeed();
}

function testDownloadSpeed() {
    let imageUrl = "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png";
    let startTime, endTime;
    let totalDataDownloaded = 0;
    let iterations = 0;

    const downloadTest = () => {
        let download = new Image();
        let imageSize = 5000000; // 5MB
        download.onload = function () {
            endTime = (new Date()).getTime();
            let duration = (endTime - startTime) / 1000; // Time in seconds
            let bitsLoaded = imageSize * 8; // Convert bytes to bits
            totalDataDownloaded += bitsLoaded;
            iterations++;

            if (iterations === 1) {
                latency = duration * 1000; // Store latency on first iteration
                latencyDisplay.textContent = "Latency: " + latency.toFixed(2) + " ms";
            }

            startTime = (new Date()).getTime();

            // Continue the test until 30 seconds pass
            if (iterations < totalTestTime * 2) { // Roughly 2 iterations per second
                download.src = imageUrl + "?rand=" + Math.random();
            } else {
                showDownloadResults(totalDataDownloaded, iterations);
                testUploadSpeed();
            }
        };

        startTime = (new Date()).getTime();
        download.src = imageUrl + "?rand=" + Math.random(); // Bypass cache
    };

    downloadTest(); // Start the download test
}

function showDownloadResults(totalDataDownloaded, iterations) {
    let totalTime = iterations / 2; // Approximate seconds based on iterations
    let speedBps = totalDataDownloaded / totalTime;
    let speedMbps = speedBps / (1024 * 1024); // Convert to Mbps
    downloadDisplay.textContent = "Download Speed: " + speedMbps.toFixed(2) + " Mbps";
}

function testUploadSpeed() {
    let uploadData = new Blob([new ArrayBuffer(5000000)]); // 5MB dummy data
    let startTime, endTime;
    let totalDataUploaded = 0;
    let iterations = 0;

    const uploadTest = () => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "https://httpbin.org/post", true); // Placeholder upload endpoint
        xhr.onload = function () {
            endTime = (new Date()).getTime();
            let duration = (endTime - startTime) / 1000; // Time in seconds
            let bitsUploaded = uploadData.size * 8; // Convert bytes to bits
            totalDataUploaded += bitsUploaded;
            iterations++;

            if (iterations === 1) {
                latency = duration * 1000; // Update latency for upload if necessary
            }

            startTime = (new Date()).getTime();

            // Continue the test until 30 seconds pass
            if (iterations < totalTestTime * 2) { // Roughly 2 iterations per second
                xhr.open("POST", "https://httpbin.org/post", true); // Open again for each iteration
                xhr.send(uploadData);
            } else {
                showUploadResults(totalDataUploaded, iterations);
                stopLoader();
            }
        };

        startTime = (new Date()).getTime();
        xhr.send(uploadData); // Start the upload
    };

    uploadTest(); // Start the upload test
}

function showUploadResults(totalDataUploaded, iterations) {
    let totalTime = iterations / 2; // Approximate seconds based on iterations
    let speedBps = totalDataUploaded / totalTime;
    let speedMbps = speedBps / (1024 * 1024); // Convert to Mbps
    uploadDisplay.textContent = "Upload Speed: " + speedMbps.toFixed(2) + " Mbps";
}

// Function to start the loader animation
function startLoader() {
    loader.style.display = "block";
    loader.style.animationPlayState = "running";
    speedDisplay.textContent = "Testing...";
}

// Function to stop the loader animation
function stopLoader() {
    loader.style.animationPlayState = "paused";
    loader.style.display = "none";
    speedDisplay.textContent = "Speed Test Completed!";
}

// Add click event listener for Start button
startButton.addEventListener('click', function () {
    testSpeed();
});
