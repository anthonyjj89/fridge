// Chore Toggle Functionality with Scheduling

export function toggleChore(button) {
    if (window.chores && window.chores.toggleChore) {
        window.chores.toggleChore(button);
    } else {
        console.error('window.chores.toggleChore is not available');
    }
}

export function initializeChoreToggle() {
    console.log("choreToggle.js: Initializing");

    // Check if window.chores is properly initialized
    if (window.chores) {
        console.log("window.chores is initialized:", window.chores);
    } else {
        console.error("window.chores is not initialized");
    }
}

console.log("choreToggle.js loaded");
