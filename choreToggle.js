// Chore Toggle Functionality with Scheduling

function toggleChore(button) {
    if (window.chores && window.chores.toggleChore) {
        window.chores.toggleChore(button);
    } else {
        console.error('window.chores.toggleChore is not available');
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("choreToggle.js: DOM fully loaded");

    // Check if window.chores is properly initialized
    if (window.chores) {
        console.log("window.chores is initialized:", window.chores);
    } else {
        console.error("window.chores is not initialized");
    }
});

// Expose functions globally
window.toggleChore = toggleChore;

console.log("choreToggle.js loaded");
