// Chore Management System

/**
 * @typedef {Object} ChoreEvent
 * @property {string} type - The type of the event
 * @property {Object} detail - The details of the event
 */

/**
 * @typedef {Object} ChoreConfig
 * @property {string[]} days - The days the chore is scheduled
 * @property {string} time1 - The first scheduled time for the chore
 * @property {string} time2 - The second scheduled time for the chore (optional)
 */

// DOM Elements
const choreList = document.getElementById('chore-list');

// Event system
const eventSystem = {
    events: {},
    subscribe: function(eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    publish: function(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(fn => {
                fn(data);
            });
        }
    }
};

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeChoreButtons();
    loadChoreStates();
    sortChores();
    startChoreScheduleChecker();
    console.log('Chore system initialized');
});

/**
 * Initialize chore buttons with event listeners
 */
function initializeChoreButtons() {
    console.log('Initializing chore buttons');
    const buttons = document.querySelectorAll('.chore-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            try {
                console.log('Chore button clicked:', this.dataset.chore);
                this.classList.toggle('active');
                this.setAttribute('aria-pressed', this.classList.contains('active'));
                console.log('Chore active state:', this.classList.contains('active'));
                saveChoreState(this.dataset.chore, this.classList.contains('active'));
                sortChores();
                updateChoreUI(this.dataset.chore);
                eventSystem.publish('choreStateChanged', { 
                    choreName: this.dataset.chore, 
                    isActive: this.classList.contains('active') 
                });
            } catch (error) {
                console.error('Error toggling chore state:', error);
            }
        });
    });
}

/**
 * Save chore state to localStorage
 * @param {string} choreName - The name of the chore
 * @param {boolean} isActive - Whether the chore is active
 */
function saveChoreState(choreName, isActive) {
    try {
        console.log('Saving chore state:', choreName, isActive);
        localStorage.setItem(`chore-${choreName}`, isActive);
    } catch (error) {
        console.error('Error saving chore state:', error);
    }
}

/**
 * Load chore states from localStorage
 */
function loadChoreStates() {
    console.log('Loading chore states');
    const buttons = document.querySelectorAll('.chore-button');
    buttons.forEach(button => {
        try {
            const choreName = button.dataset.chore;
            const isActive = localStorage.getItem(`chore-${choreName}`) === 'true';
            console.log('Loaded chore state:', choreName, isActive);
            if (isActive) {
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.setAttribute('aria-pressed', 'false');
            }
            updateChoreUI(choreName);
        } catch (error) {
            console.error('Error loading chore state:', error);
        }
    });
}

/**
 * Reset all chores to default state
 */
function resetAllChores() {
    console.log('Resetting all chores to default state');
    const buttons = document.querySelectorAll('.chore-button');
    buttons.forEach(button => {
        try {
            const choreName = button.dataset.chore;
            button.classList.remove('active', 'due');
            button.setAttribute('aria-pressed', 'false');
            button.style.backgroundColor = '';
            saveChoreState(choreName, false);
            updateChoreUI(choreName);
        } catch (error) {
            console.error('Error resetting chore:', error);
        }
    });
    sortChores();
    eventSystem.publish('allChoresReset', {});
}

/**
 * Sort chores based on their active state
 */
function sortChores() {
    const chores = Array.from(choreList.querySelectorAll('.chore-container'));
    
    chores.sort((a, b) => {
        const aActive = a.querySelector('.chore-button').classList.contains('active');
        const bActive = b.querySelector('.chore-button').classList.contains('active');
        if (aActive === bActive) return 0;
        return aActive ? 1 : -1;
    });
    
    chores.forEach(chore => choreList.appendChild(chore));
    console.log('Chores sorted');
}

/**
 * Check if a chore is scheduled for the current time
 * @param {HTMLElement} chore - The chore element
 * @param {string} currentDay - The current day
 * @param {string} currentTime - The current time
 * @returns {boolean} Whether the chore is scheduled
 */
function isChoreScheduled(chore, currentDay, currentTime) {
    try {
        const config = {
            days: JSON.parse(chore.dataset.days || '[]'),
            time1: chore.dataset.time1,
            time2: chore.dataset.time2
        };

        console.log('Checking chore schedule:', chore.dataset.chore, config, currentDay, currentTime);
        if (!config.days.includes(currentDay)) {
            console.log('Chore not scheduled for today');
            return false;
        }

        const now = new Date();
        const currentDateTime = new Date(now.toDateString() + ' ' + currentTime);
        const time1 = new Date(now.toDateString() + ' ' + config.time1);
        const time2 = config.time2 ? new Date(now.toDateString() + ' ' + config.time2) : null;

        if (currentDateTime >= time1 && (!time2 || currentDateTime < time2)) {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error checking chore schedule:', error);
        return false;
    }
}

/**
 * Calculate time remaining until next chore
 * @param {HTMLElement} chore - The chore element
 * @param {string} currentDay - The current day
 * @param {string} currentTime - The current time
 * @returns {{hours: number, minutes: number}} Time remaining
 */
function calculateTimeRemaining(chore, currentDay, currentTime) {
    try {
        const config = {
            days: JSON.parse(chore.dataset.days || '[]'),
            time1: chore.dataset.time1,
            time2: chore.dataset.time2
        };

        const now = new Date();
        const currentDateTime = new Date(now.toDateString() + ' ' + currentTime);
        const time1 = new Date(now.toDateString() + ' ' + config.time1);
        const time2 = config.time2 ? new Date(now.toDateString() + ' ' + config.time2) : null;

        let nextChoreTime;
        if (currentDateTime < time1) {
            nextChoreTime = time1;
        } else if (time2 && currentDateTime < time2) {
            nextChoreTime = time2;
        } else {
            // Find the next occurrence of the chore
            const currentDayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(currentDay);
            let daysUntilNextChore = 7;
            for (let i = 1; i <= 7; i++) {
                const nextDay = (currentDayIndex + i) % 7;
                if (config.days.includes(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][nextDay])) {
                    daysUntilNextChore = i;
                    break;
                }
            }
            nextChoreTime = new Date(now.getTime() + daysUntilNextChore * 24 * 60 * 60 * 1000);
            nextChoreTime.setHours(time1.getHours(), time1.getMinutes(), 0, 0);
        }

        const timeDiff = nextChoreTime - currentDateTime;
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        return { hours, minutes };
    } catch (error) {
        console.error('Error calculating time remaining:', error);
        return { hours: 0, minutes: 0 };
    }
}

/**
 * Update the UI for a specific chore
 * @param {string} choreName - The name of the chore to update
 */
function updateChoreUI(choreName) {
    const chore = document.querySelector(`.chore-button[data-chore="${choreName}"]`);
    const countdownElement = document.querySelector(`.chore-countdown[data-chore="${choreName}"]`);
    if (!chore || !countdownElement) return;

    const now = new Date();
    const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const isDue = isChoreScheduled(chore, currentDay, currentTime);
    const isActive = chore.classList.contains('active');

    if (isDue && !isActive) {
        chore.classList.add('due');
        chore.style.backgroundColor = 'red';
        chore.setAttribute('aria-label', `${choreName} is due now`);
        countdownElement.textContent = 'Due Now';
    } else {
        chore.classList.remove('due');
        chore.style.backgroundColor = isActive ? 'green' : '';
        chore.setAttribute('aria-label', choreName);
        const timeRemaining = calculateTimeRemaining(chore, currentDay, currentTime);
        countdownElement.textContent = `${timeRemaining.hours}h ${timeRemaining.minutes}m`;
    }

    countdownElement.setAttribute('aria-label', `Time remaining for ${choreName}: ${countdownElement.textContent}`);
}

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in milliseconds
 * @returns {Function} The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedCheckChoreSchedules = debounce(() => {
    const chores = document.querySelectorAll('.chore-button');
    chores.forEach(chore => {
        try {
            updateChoreUI(chore.dataset.chore);
        } catch (error) {
            console.error('Error updating chore UI:', error);
        }
    });
}, 1000); // Debounce for 1 second

/**
 * Start the chore schedule checker
 */
function startChoreScheduleChecker() {
    console.log('Starting chore schedule checker');
    debouncedCheckChoreSchedules(); // Check immediately on start
    setInterval(debouncedCheckChoreSchedules, 60000); // Check every minute
}

/**
 * Export chore data as JSON
 * @returns {string} JSON string of chore data
 */
function exportChoreData() {
    const chores = document.querySelectorAll('.chore-button');
    const choreData = Array.from(chores).map(chore => ({
        name: chore.dataset.chore,
        isActive: chore.classList.contains('active'),
        config: {
            days: JSON.parse(chore.dataset.days || '[]'),
            time1: chore.dataset.time1,
            time2: chore.dataset.time2
        }
    }));
    return JSON.stringify(choreData, null, 2);
}

// Expose functions globally
window.resetAllChores = resetAllChores;
window.exportChoreData = exportChoreData;

// Example usage of the event system
eventSystem.subscribe('choreStateChanged', (data) => {
    console.log(`Chore ${data.choreName} state changed to ${data.isActive ? 'active' : 'inactive'}`);
});

eventSystem.subscribe('allChoresReset', () => {
    console.log('All chores have been reset');
});