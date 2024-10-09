// Chore Management System

function initializeChores() {
    const buttons = document.querySelectorAll('.chore-button');
    buttons.forEach(button => {
        button.style.backgroundColor = 'red'; // Initialize all chores as red
        button.addEventListener('click', function() {
            toggleChore(this);
        });
    });
}

// Initialize chores when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeChores);
