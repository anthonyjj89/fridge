// Chore Toggle Functionality with Scheduling

function toggleChore(button) {
    if (button.classList.contains('active')) {
        button.classList.remove('active');
    } else {
        button.classList.remove('flashing');
        button.classList.add('active');
    }
}

function setChoreAsDue(choreName) {
    const button = document.querySelector(`.chore-button[data-chore="${choreName}"]`);
    if (button) {
        button.classList.remove('active');
        button.classList.add('flashing');
    }
}

function scheduleChore(choreName, time) {
    const now = new Date();
    const scheduleTime = new Date(now.toDateString() + ' ' + time);
    
    if (scheduleTime <= now) {
        scheduleTime.setDate(scheduleTime.getDate() + 1); // Schedule for next day if time has passed
    }
    
    const timeUntilDue = scheduleTime - now;
    setTimeout(() => setChoreAsDue(choreName), timeUntilDue);
}

// Expose functions globally
window.toggleChore = toggleChore;
window.scheduleChore = scheduleChore;
