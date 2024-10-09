// Chore Management System

function initializeChores() {
    const buttons = document.querySelectorAll('.chore-button');
    buttons.forEach(button => {
        button.style.backgroundColor = 'red'; // Initialize all chores as red
        button.addEventListener('click', function() {
            toggleChore(this);
        });
    });

    // Initialize scroll buttons
    initializeScrollButtons();
}

function toggleChore(button) {
    if (button.classList.contains('flashing') || button.style.backgroundColor === 'red') {
        completeChore(button);
    } else {
        resetChore(button);
    }
}

function completeChore(button) {
    button.classList.remove('flashing');
    button.style.backgroundColor = 'green';
    button.dataset.completed = 'true';
}

function resetChore(button) {
    button.style.backgroundColor = 'red';
    button.dataset.completed = 'false';
}

function setChoreOverdue(button) {
    if (button.dataset.completed !== 'true') {
        button.classList.add('flashing');
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

// Initialize chores when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeChores);

// Expose functions for external use
window.chores = {
    setChoreOverdue: setChoreOverdue,
    completeChore: completeChore,
    resetChore: resetChore
};
