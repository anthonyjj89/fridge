// UI-related functions

function initializeUI() {
    addScrollFunctionality();
    createResetButton();
    createExportButton();
    addChorePopupListeners();
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

function createResetButton() {
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset All Chores';
    resetButton.addEventListener('click', function() {
        if (typeof window.resetAllChores === 'function') {
            window.resetAllChores();
        } else {
            console.warn('resetAllChores function not found');
        }
    });
    document.body.appendChild(resetButton);
}

function createExportButton() {
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Chore Data';
    exportButton.addEventListener('click', () => {
        if (typeof window.exportChoreData === 'function') {
            const data = window.exportChoreData();
            console.log('Exported chore data:', data);
            // You could add code here to save the data to a file or send it to a server
        } else {
            console.warn('exportChoreData function not found');
        }
    });
    document.body.appendChild(exportButton);
}

function addChorePopupListeners() {
    const saveButton = document.getElementById('save-chore-schedule');
    const closeButton = document.getElementById('close-popup');
    const popup = document.getElementById('chore-popup');

    if (saveButton && closeButton && popup) {
        saveButton.addEventListener('click', function() {
            try {
                const choreName = document.getElementById('chore-name').textContent;
                const selectedDays = Array.from(document.querySelectorAll('.day-checkbox:checked')).map(cb => cb.value);
                const time = document.getElementById('chore-time').value;

                console.log('Saving chore:', choreName, 'Days:', selectedDays, 'Time:', time);

                // Find the chore in the config and update it
                if (window.chores && window.chores.config && window.chores.config.chores) {
                    const chore = window.chores.config.chores.find(c => c.name === choreName);
                    if (chore) {
                        chore.days = selectedDays;
                        chore.time = time;
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
    } else {
        console.warn('Chore popup elements not found in the DOM');
    }
}

// Initialize UI when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeUI();
    console.log('UI initialized');
});
