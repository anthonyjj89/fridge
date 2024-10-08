// Initialize chore buttons
function initializeChoreButtons() {
    console.log('Initializing chore buttons');
    const buttons = document.querySelectorAll('.chore-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Chore button clicked:', this.dataset.chore);
            this.classList.toggle('active');
            console.log('Chore active state:', this.classList.contains('active'));
            saveChoreState(this.dataset.chore, this.classList.contains('active'));
            sortChores(); // Sort chores after toggling active state
        });
    });
}

// Save chore state to localStorage
function saveChoreState(choreName, isActive) {
    console.log('Saving chore state:', choreName, isActive);
    localStorage.setItem(`chore-${choreName}`, isActive);
}

// Load chore states from localStorage
function loadChoreStates() {
    console.log('Loading chore states');
    const buttons = document.querySelectorAll('.chore-button');
    buttons.forEach(button => {
        const choreName = button.dataset.chore;
        const isActive = localStorage.getItem(`chore-${choreName}`) === 'true';
        console.log('Loaded chore state:', choreName, isActive);
        if (isActive) {
            button.classList.add('active');
        }
    });
    sortChores(); // Sort chores after loading states
}

// Sort chores function
function sortChores() {
    const choreList = document.getElementById('chore-list');
    const chores = Array.from(choreList.querySelectorAll('.chore-container'));
    
    chores.sort((a, b) => {
        const aActive = a.querySelector('.chore-button').classList.contains('active');
        const bActive = b.querySelector('.chore-button').classList.contains('active');
        if (aActive === bActive) return 0;
        return aActive ? 1 : -1;
    });
    
    chores.forEach(chore => choreList.appendChild(chore));
}

// Function to check if a chore is due
function isChoreScheduled(chore, currentDay, currentTime) {
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
}

// Function to check chore schedules and update their state
function checkChoreSchedules() {
    console.log('Checking chore schedules');
    const now = new Date();
    const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    console.log('Current day and time:', currentDay, currentTime);

    const chores = document.querySelectorAll('.chore-button');
    chores.forEach(chore => {
        const choreName = chore.dataset.chore;
        console.log('Checking chore:', choreName, 'Config:', chore.dataset);

        const isDue = isChoreScheduled(chore, currentDay, currentTime);
        const isActive = chore.classList.contains('active');

        if (isDue && !isActive) {
            console.log('Marking chore as due:', choreName);
            chore.classList.add('due');
            chore.style.backgroundColor = 'red';
        } else {
            console.log('Removing due status from chore:', choreName);
            chore.classList.remove('due');
            chore.style.backgroundColor = isActive ? 'green' : '';
        }

        // Update countdown
        const timeRemaining = calculateTimeRemaining(chore, currentDay, currentTime);
        const countdownElement = document.querySelector(`.chore-countdown[data-chore="${choreName}"]`);
        if (countdownElement) {
            if (isDue && !isActive) {
                countdownElement.textContent = 'Due Now';
            } else {
                countdownElement.textContent = `${timeRemaining.hours}h ${timeRemaining.minutes}m`;
            }
        }

        console.log('Final chore state:', choreName, {
            active: isActive,
            due: isDue
        });

        saveChoreState(choreName, isActive);
    });
}

// Start the chore schedule checker
function startChoreScheduleChecker() {
    console.log('Starting chore schedule checker');
    checkChoreSchedules(); // Check immediately on start
    setInterval(checkChoreSchedules, 60000); // Check every minute
}

// Call sortChores initially to ensure correct order on page load
document.addEventListener('DOMContentLoaded', function() {
    sortChores();
    console.log('Initial chore sorting complete');
});