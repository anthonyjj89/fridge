// UI-related functions
import { toggleLock } from './main.js';

export function initializeUI() {
    addScrollFunctionality();
    addChorePopupListeners();
    addPopupAutoClose();
    initializeLockToggle();
}

function addScrollFunctionality() {
    const scrollLeft = document.getElementById('scroll-left');
    const scrollRight = document.getElementById('scroll-right');
    const choreList = document.getElementById('chore-list');

    if (scrollLeft && scrollRight && choreList) {
        scrollLeft.addEventListener('click', function() {
            choreList.scrollBy({ left: -100, behavior: 'smooth' });
        });

        scrollRight.addEventListener('click', function() {
            choreList.scrollBy({ left: 100, behavior: 'smooth' });
        });
    } else {
        console.warn('Scroll buttons or chore list not found in the DOM');
    }
}

function addChorePopupListeners() {
    const saveButton = document.getElementById('save-chore-button');
    const closeButton = document.getElementById('close-popup-button');
    const selectAllDaysButton = document.getElementById('select-all-days-button');
    const popup = document.getElementById('chore-popup');

    if (saveButton && closeButton && selectAllDaysButton && popup) {
        saveButton.addEventListener('click', function() {
            try {
                const choreName = document.getElementById('chore-name').textContent;
                const selectedDays = Array.from(document.querySelectorAll('.day-checkbox:checked')).map(cb => cb.value);
                const time = document.getElementById('chore-time').value;
                const time2 = document.getElementById('chore-time2').value;

                console.log('Saving chore:', choreName, 'Days:', selectedDays, 'Time 1:', time, 'Time 2:', time2);

                // Find the chore in the config and update it
                if (window.chores && window.chores.config && window.chores.config.chores) {
                    const chore = window.chores.config.chores.find(c => c.name === choreName);
                    if (chore) {
                        chore.days = selectedDays;
                        chore.time = time;
                        chore.time2 = time2;
                        window.chores.saveChoreConfig();
                        window.chores.updateChoreState(document.querySelector(`[data-chore="${choreName}"]`), chore);
                        console.log('Chore updated successfully');
                    } else {
                        console.error('Chore not found in config:', choreName);
                    }
                } else {
                    console.error('Chores configuration not found');
                }

                popup.style.display = 'none';
            } catch (error) {
                console.error('Error saving chore schedule:', error);
            }
        });

        closeButton.addEventListener('click', function() {
            try {
                popup.style.display = 'none';
                console.log('Chore popup closed');
            } catch (error) {
                console.error('Error closing chore popup:', error);
            }
        });

        selectAllDaysButton.addEventListener('click', function() {
            try {
                document.querySelectorAll('.day-checkbox').forEach(checkbox => {
                    checkbox.checked = true;
                });
                console.log('All days selected');
            } catch (error) {
                console.error('Error selecting all days:', error);
            }
        });
    } else {
        console.warn('Chore popup elements not found in the DOM');
    }
}

function addPopupAutoClose() {
    const popup = document.getElementById('chore-popup');
    const popupContent = popup.querySelector('.popup-content');

    document.addEventListener('click', function(event) {
        if (popup.style.display === 'block' && !popupContent.contains(event.target) && !event.target.classList.contains('config-icon')) {
            popup.style.display = 'none';
            console.log('Chore popup auto-closed');
        }
    });
}

function initializeLockToggle() {
    const lockToggle = document.getElementById('lock-toggle');
    if (lockToggle) {
        lockToggle.addEventListener('click', function() {
            toggleLock();
            updateLockUI();
        });
        updateLockUI(); // Set initial state
    } else {
        console.warn('Lock toggle button not found in the DOM');
    }
}

function updateLockUI() {
    const lockToggle = document.getElementById('lock-toggle');
    const isLocked = document.body.classList.contains('locked');
    if (lockToggle) {
        lockToggle.textContent = isLocked ? 'Unlock' : 'Lock';
        lockToggle.classList.toggle('locked', isLocked);
    }
    document.body.classList.toggle('locked', isLocked);
    console.log(`UI updated to reflect ${isLocked ? 'locked' : 'unlocked'} state`);
}

// Listen for lock state changes
document.addEventListener('lockStateChanged', function(event) {
    updateLockUI();
});

console.log('UI module loaded');
