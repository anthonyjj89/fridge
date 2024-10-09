// Chore Toggle Functionality with Flashing and Due Date Checking

function toggleChore(button) {
    if (button.classList.contains('active')) {
        button.classList.remove('active');
        checkAndUpdateChoreStatus(button);
    } else {
        button.classList.remove('flashing');
        button.classList.add('active');
    }
}

function checkAndUpdateChoreStatus(button) {
    const choreName = button.dataset.chore;
    if (isChoredDue(choreName)) {
        button.classList.add('flashing');
    } else {
        button.classList.remove('flashing');
    }
}

function isChoredDue(choreName) {
    const config = JSON.parse(localStorage.getItem(`chore-${choreName}-config`) || '{}');
    if (!config.days || config.days.length === 0) return false;

    const now = new Date();
    const currentDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    if (!config.days.includes(currentDay)) return false;

    const time1 = parseTime(config.time1);
    const time2 = parseTime(config.time2);

    return (time1 <= currentTime && currentTime < time2);
}

function parseTime(timeString) {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function updateAllChores() {
    const buttons = document.querySelectorAll('.chore-button');
    buttons.forEach(checkAndUpdateChoreStatus);
}

// Set up periodic checking
setInterval(updateAllChores, 60000); // Check every minute

// Initial check when the page loads
document.addEventListener('DOMContentLoaded', updateAllChores);

// Expose functions globally
window.toggleChore = toggleChore;
window.updateAllChores = updateAllChores;
