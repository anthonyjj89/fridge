// Chore Management System

// DOM Elements
const choreList = document.getElementById('chore-list');

/**
 * Initialize the chore system
 */
function initializeChores() {
    initializeChoreButtons();
    loadChoreStates();
    console.log('Chore system initialized');
}

/**
 * Initialize chore buttons with event listeners
 */
function initializeChoreButtons() {
    console.log('Initializing chore buttons');
    const buttons = document.querySelectorAll('.chore-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            toggleChoreState(this);
        });
    });
}

/**
 * Toggle chore state
 * @param {HTMLElement} button - The chore button element
 */
function toggleChoreState(button) {
    const isActive = !button.classList.contains('active');
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', isActive);
    saveChoreState(button.dataset.chore, isActive);
    console.log(`Chore ${button.dataset.chore} toggled to ${isActive ? 'active (green)' : 'inactive (flashing red/white)'}`);
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
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', isActive);
            console.log('Loaded chore state:', choreName, isActive ? 'active (green)' : 'inactive (flashing red/white)');
        } catch (error) {
            console.error('Error loading chore state:', error);
        }
    });
}

/**
 * Reset all chores to inactive state
 */
function resetAllChores() {
    console.log('Resetting all chores to inactive state (flashing red/white)');
    const buttons = document.querySelectorAll('.chore-button');
    buttons.forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
        saveChoreState(button.dataset.chore, false);
    });
}

/**
 * Export chore data as JSON
 * @returns {string} JSON string of chore data
 */
function exportChoreData() {
    const chores = document.querySelectorAll('.chore-button');
    const choreData = Array.from(chores).map(chore => ({
        name: chore.dataset.chore,
        isActive: chore.classList.contains('active')
    }));
    return JSON.stringify(choreData, null, 2);
}

// Expose functions globally
window.chores = {
    initialize: initializeChores,
    resetAll: resetAllChores,
    exportData: exportChoreData
};
