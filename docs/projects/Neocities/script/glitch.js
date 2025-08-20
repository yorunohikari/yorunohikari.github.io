// Glitch Effect Configuration
const GLITCH_CONFIG = {
    // Timing settings (in milliseconds)
    minInterval: 3000,      // Minimum time between glitches
    maxInterval: 8000,      // Maximum time between glitches
    glitchDuration: 150,    // How long each glitch lasts
    multiGlitchChance: 0.3, // Chance of multiple rapid glitches (0-1)
    
    // Visual settings
    glitchIntensity: 0.7,   // How different the glitched text should be (0-1)
    
    // Glitch text patterns - customize these!
    glitchPatterns: [
        // Terminal/hacker style
        '###_###',
        'ERR_404',
        'NULL_##',
        '???_???',
        'SYSERR',
        'MEM_😀#',
        'CORR_##',
        'LOST_##',
        'VOID_##',
        'MULYONO',
        
        // Random characters
        'X##_X##',
        '???_X##',
        'DATA_##',
        'HACK_##',
        'TERM_##',
        '5138008',
        'FAIL_##',
        'DUMP_##',
        
        // Symbols and noise
        '▓▓▓_▓▓▓',
        '██████',
        '░░░_░░░',
        '▒▒▒_▒▒▒',
        '|||_|||',
        '###-###',
        'XXX-XXX',
        '000_000'
    ]
};

class GlitchEffect {
    constructor(config = {}) {
        this.config = { ...GLITCH_CONFIG, ...config };
        this.activeGlitches = new Map();
        this.init();
    }
    
    init() {
        // Start glitching existing elements
        this.startGlitching();
        
        // Watch for new elements (when pagination loads new dreams)
        this.observeNewElements();
    }
    
    startGlitching() {
        const dreamIds = document.querySelectorAll('.dream-id');
        dreamIds.forEach(element => {
            if (!this.activeGlitches.has(element)) {
                this.scheduleGlitch(element);
            }
        });
    }
    
    observeNewElements() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const dreamIds = node.querySelectorAll ? 
                            node.querySelectorAll('.dream-id') : [];
                        dreamIds.forEach(element => {
                            if (!this.activeGlitches.has(element)) {
                                this.scheduleGlitch(element);
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    scheduleGlitch(element) {
        const scheduleNext = () => {
            const delay = this.randomBetween(
                this.config.minInterval, 
                this.config.maxInterval
            );
            
            const timeoutId = setTimeout(() => {
                if (document.contains(element)) {
                    this.executeGlitch(element);
                    scheduleNext(); // Schedule the next glitch
                } else {
                    // Element was removed, clean up
                    this.activeGlitches.delete(element);
                }
            }, delay);
            
            this.activeGlitches.set(element, timeoutId);
        };
        
        scheduleNext();
    }
    
    executeGlitch(element) {
        const originalText = element.dataset.originalText || element.textContent;
        
        // Store original text if not stored yet
        if (!element.dataset.originalText) {
            element.dataset.originalText = originalText;
        }
        
        // Decide if this will be a multi-glitch
        const isMultiGlitch = Math.random() < this.config.multiGlitchChance;
        const glitchCount = isMultiGlitch ? this.randomBetween(2, 4) : 1;
        
        this.performGlitchSequence(element, originalText, glitchCount);
    }
    
    performGlitchSequence(element, originalText, remainingGlitches) {
        if (remainingGlitches <= 0) {
            // Restore original text
            element.textContent = originalText;
            return;
        }
        
        // Apply glitch
        const glitchedText = this.generateGlitchedText(originalText);
        element.textContent = glitchedText;
        
        // Schedule next glitch in sequence or restoration
        setTimeout(() => {
            if (remainingGlitches === 1) {
                // Last glitch, restore original
                element.textContent = originalText;
            } else {
                // Continue glitch sequence
                this.performGlitchSequence(element, originalText, remainingGlitches - 1);
            }
        }, this.config.glitchDuration);
    }
    
    generateGlitchedText(originalText) {
        // Choose random glitch pattern
        const pattern = this.config.glitchPatterns[
            Math.floor(Math.random() * this.config.glitchPatterns.length)
        ];
        
        // Replace # with random numbers/characters
        const glitchedPattern = pattern.replace(/#/g, () => {
            return Math.floor(Math.random() * 10).toString();
        });
        
        // Sometimes mix original text with glitch
        if (Math.random() > this.config.glitchIntensity) {
            return this.mixTexts(originalText, glitchedPattern);
        }
        
        return glitchedPattern;
    }
    
    mixTexts(original, glitched) {
        const result = [];
        const maxLength = Math.max(original.length, glitched.length);
        
        for (let i = 0; i < maxLength; i++) {
            const useOriginal = Math.random() > 0.5;
            const char = useOriginal ? 
                (original[i] || '') : 
                (glitched[i] || '');
            result.push(char);
        }
        
        return result.join('');
    }
    
    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Public methods for customization
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    
    addGlitchPatterns(patterns) {
        this.config.glitchPatterns.push(...patterns);
    }
    
    stop() {
        this.activeGlitches.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });
        this.activeGlitches.clear();
        
        // Restore all original texts
        document.querySelectorAll('.dream-id').forEach(element => {
            if (element.dataset.originalText) {
                element.textContent = element.dataset.originalText;
            }
        });
    }
    
    start() {
        this.startGlitching();
    }
}

// Initialize glitch effect when DOM is ready
let dreamGlitch;

document.addEventListener('DOMContentLoaded', () => {
    dreamGlitch = new GlitchEffect();
});

// Expose global functions for easy customization
window.customizeGlitch = (config) => {
    if (dreamGlitch) {
        dreamGlitch.updateConfig(config);
    }
};

window.addGlitchPatterns = (patterns) => {
    if (dreamGlitch) {
        dreamGlitch.addGlitchPatterns(patterns);
    }
};

window.stopGlitch = () => {
    if (dreamGlitch) {
        dreamGlitch.stop();
    }
};

window.startGlitch = () => {
    if (dreamGlitch) {
        dreamGlitch.start();
    }
};