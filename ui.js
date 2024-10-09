// UI-related functions

function initializeUI() {
    addScrollFunctionality();
    createResetButton();
    createExportButton();
    addChorePopupListeners();
}

function addScrollFunctionality() {
    document.getElementById('scroll-left').addEventListener('click', function() {
        document.getElementById('chore-list').scrollBy({ left: -100, behavior: 'smooth' });
    });

    document.getElementById('scroll-right').addEventListener('click', function() {
        document.getElementById('chore-list').scrollBy({ left: 100, behavior: 'smooth' });
    });
}

function createResetButton() {
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset All Chores';
    resetButton.addEventListener('click', window.resetAllChores);
    document.body.appendChild(resetButton);
}

function createExportButton() {
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Chore Data';
    exportButton.addEventListener('click', () => {
        const data = window.exportChoreData();
        console.log('Exported chore data:', data);
        // You could add code here to save the data to a file or send it to a server
    });
    document.body.appendChild(exportButton);
}

function addChorePopupListeners() {
    const saveButton = document.getElementById('save-chore-schedule');
    const closeButton = document.getElementById('close-popup');
    const popup = document.getElementById('chore-popup');

    saveButton.addEventListener('click', function() {
        try {
            const choreName = document.getElementById('chore-name').textContent;
            const selectedDays = Array.from(document.querySelectorAll('.day-checkbox:checked')).map(cb => cb.value);
            const time = document.getElementById('chore-time').value;

            console.log('Saving chore:', choreName, 'Days:', selectedDays, 'Time:', time);

            // Find the chore in the config and update it
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
}

// Initialize UI when the script loads
initializeUI();
console.log('UI initialized');
