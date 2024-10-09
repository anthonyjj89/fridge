// Chore Toggle Functionality with Scheduling

function toggleChore(button) {
    if (button.dataset.completed === 'true') {
        resetChoreState(button);
    } else {
        window.chores.completeChore(button);
    }
    updateChoreStatus(button);
}

function updateChoreStatus(button) {
    const choreName = button.dataset.chore;
    if (isChoredDue(choreName)) {
        if (button.dataset.completed === 'true') {
            resetChoreState(button);
        }
        window.chores.setChoreOverdue(button);
    }
}

function resetChoreState(button) {
    button.dataset.completed = 'false';
    button.style.backgroundColor = 'red';
    button.classList.remove('flashing');
}

function isChoredDue(choreName) {
    const config = JSON.parse(localStorage.getItem(`chore-${choreName}-config`) || '{}');
    if (!config.days || config.days.length === 0 || !config.time) return false;

    const now = new Date();
    const currentDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    if (!config.days.includes(currentDay)) return false;

    const scheduleTime = parseTime(config.time);

    return currentTime >= scheduleTime;
}

function parseTime(timeString) {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function scheduleChores() {
    const chores = document.querySelectorAll('.chore-button');
    chores.forEach(chore => {
        updateChoreStatus(chore);
    });
}

// Set up periodic checking
setInterval(scheduleChores, 5000); // Check every minute

// Initial check when the page loads
document.addEventListener('DOMContentLoaded', scheduleChores);

// Expose functions globally
window.toggleChore = toggleChore;
window.scheduleChores = scheduleChores;
