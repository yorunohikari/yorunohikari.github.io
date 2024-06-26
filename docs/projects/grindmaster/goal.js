class WeeklyGoals {
    constructor() {
        this.target = 0;
        this.completed = 0;
        this.startDate = new Date(); // Initialize with the current date
        this.loadProgress();
        this.checkReset(); // Check if the progress needs to be reset
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('weeklyGoals');
        if (savedProgress) {
            const data = JSON.parse(savedProgress);
            this.target = data.target;
            this.completed = data.completed;
            this.startDate = new Date(data.startDate); // Load the saved start date
            if (isNaN(this.startDate.getTime())) {
                this.startDate = new Date(); // Reset to current date if invalid
            }
        }
    }

    saveProgress() {
        const data = {
            target: this.target,
            completed: this.completed,
            startDate: this.startDate.toISOString() // Save the start date as ISO string
        };
        localStorage.setItem('weeklyGoals', JSON.stringify(data));
    }

    setTarget(target) {
        this.target = target;
        this.saveProgress();
    }

    incrementProgress(amount) {
        this.completed += amount;
        if (this.completed > this.target) {
            this.completed = this.target;
        }
        this.saveProgress();
    }

    getProgress() {
        return this.target ? (this.completed / this.target) * 100 : 0;
    }

    resetProgress() {
        this.completed = 0;
        this.startDate = new Date(); // Reset the start date to the current date
        this.saveProgress();
    }

    checkReset() {
        const now = new Date();
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds
        if (now - this.startDate >= oneWeek) {
            this.resetProgress();
        }
    }
}

class ProgressCircle {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
    }

    update(progress) {
        this.element.style.background = `conic-gradient(#fb9d9d ${progress}%, #d3d3d3 ${progress}% 100%)`;

        // Remove any existing progress classes
        this.element.classList.remove('progress-0', 'progress-25', 'progress-50', 'progress-75', 'progress-100');
        
        // Add the appropriate progress class based on the progress percentage
        if (progress >= 0 && progress < 25) {
            this.element.classList.add('progress-0');
        } else if (progress >= 25 && progress < 50) {
            this.element.classList.add('progress-25');
        } else if (progress >= 50 && progress < 75) {
            this.element.classList.add('progress-50');
        } else if (progress >= 75 && progress < 100) {
            this.element.classList.add('progress-75');
        } else if (progress === 100) {
            this.element.classList.add('progress-100');
        }
    }
}

window.weeklyGoals = new WeeklyGoals();
const progressCircle = new ProgressCircle('progress-circle');

function updateUI() {
    progressCircle.update(window.weeklyGoals.getProgress());
    document.getElementById('progress-text').innerText = `${window.weeklyGoals.completed} / ${window.weeklyGoals.target}`;
}

// Ensure that the check for resetting the progress is called periodically
setInterval(() => {
    window.weeklyGoals.checkReset();
    updateUI();
}, 1000 * 60 * 60); // Check every hour (adjust as needed)
