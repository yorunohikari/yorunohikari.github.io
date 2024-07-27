class UI {
    constructor() {
        this.mainMenu = document.getElementById('main-menu');
        this.settingsContainer = document.getElementById('settings-container');
        this.statsContainer = document.getElementById('stats-container');
        this.historyContainer = document.getElementById('history-container');
        this.settingsButton = document.getElementById('settings-button');
        this.playQuizButton = document.getElementById('play-quiz');
        this.historyNav = document.getElementById('history-nav');
        this.homeNav = document.getElementById('home-nav');
        this.statsNav = document.getElementById('stats-nav');

        this.initEventListeners();
    }

    initEventListeners() {
        this.settingsButton.addEventListener('click', () => this.showSection(this.settingsContainer));
        this.historyNav.addEventListener('click', () => this.showSection(this.historyContainer));
        this.homeNav.addEventListener('click', () => this.showSection(this.mainMenu));
        this.statsNav.addEventListener('click', () => this.showSection(this.statsContainer));

        // Add event listeners for other buttons in settings, stats, and history sections
        // For example:
        // document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
        // document.getElementById('back-to-menu').addEventListener('click', () => this.showSection(this.mainMenu));
    }

    showSection(section) {
        [this.mainMenu, this.settingsContainer, this.statsContainer, this.historyContainer].forEach(s => {
            s.style.display = 'none';
        });
        section.style.display = 'flex';
        this.updateActiveIndicator(section);
    }

    updateActiveIndicator(activeSection) {
        const navItems = [this.historyNav, this.homeNav, this.statsNav];
        navItems.forEach(item => item.querySelector('.active-indicator').style.display = 'none');

        if (activeSection === this.historyContainer) {
            this.historyNav.querySelector('.active-indicator').style.display = 'block';
        } else if (activeSection === this.mainMenu) {
            this.homeNav.querySelector('.active-indicator').style.display = 'block';
        } else if (activeSection === this.statsContainer) {
            this.statsNav.querySelector('.active-indicator').style.display = 'block';
        }
    }

    // Add other methods for functionality in settings, stats, and history sections
    // For example:
    // saveSettings() { ... }
    // resetData() { ... }
    // toggleFullscreen() { ... }
}

// Initialize the UI
const ui = new UI();