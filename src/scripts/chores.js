// Chore Management System

let choreConfig;

function loadChoreConfig() {
    const storedConfig = localStorage.getItem('choreConfig');
    if (storedConfig) {
        choreConfig = JSON.parse(storedConfig);
    } else {
        choreConfig = {
            chores: [
                { name: "dishes", days: ["mon", "wed", "fri"], time: "19:00", time2: "", lastCompleted: null },
                { name: "trash", days: ["tue", "fri"], time: "18:00", time2: "", lastCompleted: null },
                { name: "water-plants", days: ["mon", "thu"], time: "09:00", time2: "", lastCompleted: null },
                { name: "cat-litter", days: ["mon", "wed", "fri", "sun"], time: "20:00", time2: "", lastCompleted: null },
                { name: "vacuum", days: ["sat"], time: "10:00", time2: "", lastCompleted: null },
                { name: "robot-vacuum", days: ["mon", "wed", "fri"], time: "14:00", time2: "", lastCompleted: null },
                { name: "cat-dog-meds", days: ["mon", "wed", "fri"], time: "08:00", time2: "", lastCompleted: null },
                { name: "laundry", days: ["sun"], time: "11:00", time2: "", lastCompleted: null },
                { name: "dog-walking", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], time: "17:00", time2: "", lastCompleted: null },
                { name: "water-bottle", days: ["mon", "tue", "wed", "thu", "fri"], time: "22:00", time2: "", lastCompleted: null }
            ]
        };
        saveChoreConfig();
    }
    console.log('Chore configuration loaded:', choreConfig);
}

export function initialize() {
    console.log('Initializing chore system');
    loadChoreConfig();
    initializeChores();
}

function initializeChores() {
    console.log('Initializing chores');
    const buttons = document.querySelectorAll('.chore-button');
    buttons.forEach(button => {
        const choreName = button.dataset.chore;
        const chore = choreConfig.chores.find(c => c.name === choreName);
        if (chore) {
            updateChoreState(button, chore);
        }
        button.addEventListener('click', function() {
            toggleChore(this);
        });
    });

    // Initialize config icons
    const configIcons = document.querySelectorAll('.config-icon');
    configIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            openChorePopup(this.dataset.chore);
        });
    });

    // Initialize scroll buttons
    initializeScrollButtons();

    // Set up periodic checking
    setInterval(checkAllChores, 60000); // Check every minute
}

function updateChoreState(button, chore) {
    console.log('Updating chore state:', chore.name);
    console.log('Chore last completed:', chore.lastCompleted);
    const isDue = isChoredDue(chore);
    console.log('Is chore due:', isDue);
    
    if (isDue) {
        console.log('Setting chore to red (due)');
        button.style.backgroundColor = 'red';
        button.classList.add('flashing');
    } else if (chore.lastCompleted) {
        console.log('Setting chore to green (completed)');
        button.style.backgroundColor = 'green';
        button.classList.remove('flashing');
    } else {
        console.log('Setting chore to white (not due, not completed)');
        button.style.backgroundColor = 'white';
        button.classList.remove('flashing');
    }
    
    console.log('Final button background color:', button.style.backgroundColor);
}

function isChoredDue(chore) {
    const now = new Date();
    const currentDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    if (!chore.days.includes(currentDay)) return false;

    const [hours, minutes] = chore.time.split(':').map(Number);
    const scheduleTime = hours * 60 + minutes;

    const [hours2, minutes2] = chore.time2 ? chore.time2.split(':').map(Number) : [null, null];
    const scheduleTime2 = hours2 !== null ? hours2 * 60 + minutes2 : null;

    if (chore.lastCompleted) {
        const lastCompleted = new Date(chore.lastCompleted);
        const nextScheduledTime = getNextScheduledTime(lastCompleted, chore);
        return now >= nextScheduledTime;
    }

    return currentTime >= scheduleTime || (scheduleTime2 !== null && currentTime >= scheduleTime2);
}

function getNextScheduledTime(lastCompleted, chore) {
    const [hours, minutes] = chore.time.split(':').map(Number);
    const [hours2, minutes2] = chore.time2 ? chore.time2.split(':').map(Number) : [null, null];
    let nextScheduled = new Date(lastCompleted);
    nextScheduled.setHours(hours, minutes, 0, 0);

    if (nextScheduled <= lastCompleted) {
        // If the scheduled time for the day of last completion has passed,
        // check the second time slot if it exists
        if (hours2 !== null) {
            nextScheduled.setHours(hours2, minutes2, 0, 0);
        }
        
        // If both time slots have passed, find the next scheduled day
        if (nextScheduled <= lastCompleted) {
            do {
                nextScheduled.setDate(nextScheduled.getDate() + 1);
                nextScheduled.setHours(hours, minutes, 0, 0);
            } while (!chore.days.includes(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][nextScheduled.getDay()]));
        }
    }

    return nextScheduled;
}

function toggleChore(button) {
    console.log('Toggling chore:', button.dataset.chore);
    const choreName = button.dataset.chore;
    const chore = choreConfig.chores.find(c => c.name === choreName);
    
    if (chore) {
        console.log('Current chore state:', chore);
        if (button.style.backgroundColor === 'green') {
            console.log('Chore was completed, resetting');
            chore.lastCompleted = null;
        } else {
            console.log('Marking chore as completed');
            chore.lastCompleted = new Date().toISOString();
        }
        updateChoreState(button, chore);
        saveChoreConfig();
        console.log('Updated chore state:', chore);
    }
}

function saveChoreConfig() {
    console.log('Saving chore configuration');
    localStorage.setItem('choreConfig', JSON.stringify(choreConfig));
    console.log('Chore configuration saved');
}

export function checkAllChores() {
    console.log('Checking all chores');
    try {
        const buttons = document.querySelectorAll('.chore-button');
        buttons.forEach(button => {
            const choreName = button.dataset.chore;
            const chore = choreConfig.chores.find(c => c.name === choreName);
            if (chore) {
                updateChoreState(button, chore);
            }
        });
    } catch (error) {
        console.error('Error checking chores:', error);
    }
}

function initializeScrollButtons() {
    const scrollLeftButton = document.getElementById('scroll-left');
    const scrollRightButton = document.getElementById('scroll-right');
    const choreList = document.getElementById('chore-list');

    if (scrollLeftButton && scrollRightButton && choreList) {
        scrollLeftButton.addEventListener('click', () => scrollChores('left'));
        scrollRightButton.addEventListener('click', () => scrollChores('right'));
    }
}

function scrollChores(direction) {
    const choreList = document.getElementById('chore-list');
    const scrollAmount = 200; // Adjust this value to control scroll distance

    if (direction === 'left') {
        choreList.scrollLeft -= scrollAmount;
    } else if (direction === 'right') {
        choreList.scrollLeft += scrollAmount;
    }
}

export function openChorePopup(choreName) {
    console.log('Opening chore popup for:', choreName);
    const chore = choreConfig.chores.find(c => c.name === choreName);
    if (chore) {
        document.getElementById('chore-name').textContent = chore.name;
        document.querySelectorAll('.day-checkbox').forEach(checkbox => {
            checkbox.checked = chore.days.includes(checkbox.value);
        });
        document.getElementById('chore-time').value = chore.time;
        document.getElementById('chore-time2').value = chore.time2 || '';
        
        document.getElementById('chore-popup').style.display = 'block';
    }
}

export function saveChorePopup() {
    const choreName = document.getElementById('chore-name').textContent;
    const chore = choreConfig.chores.find(c => c.name === choreName);
    if (chore) {
        chore.days = Array.from(document.querySelectorAll('.day-checkbox:checked')).map(cb => cb.value);
        chore.time = document.getElementById('chore-time').value;
        chore.time2 = document.getElementById('chore-time2').value;
        saveChoreConfig();
        closeChorePopup();
        checkAllChores();
    }
}

function closeChorePopup() {
    document.getElementById('chore-popup').style.display = 'none';
}

export function selectAllDays() {
    document.querySelectorAll('.day-checkbox').forEach(checkbox => {
        checkbox.checked = true;
    });
}

// Export functions and config for external use
export const chores = {
    initialize,
    setChoreOverdue: (button) => {
        button.classList.add('flashing');
    },
    completeChore: (button) => {
        button.style.backgroundColor = 'green';
        button.classList.remove('flashing');
    },
    resetChore: (button) => {
        button.style.backgroundColor = 'white';
        button.classList.remove('flashing');
    },
    openChorePopup,
    saveChoreConfig,
    toggleChore,
    updateChoreState,
    checkAllChores,
    get config() {
        return choreConfig;
    }
};

console.log('Chores.js loaded and initialized');
