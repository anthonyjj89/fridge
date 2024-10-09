// Configuration and Schedule Popup Logic

function initializeConfigIcons() {
    console.log('Initializing configuration icons...');
    const configIcons = document.querySelectorAll('.config-icon');
    const popup = document.getElementById('chore-popup');
    const saveConfigButton = document.getElementById('save-chore-schedule');
    const closePopupButton = document.getElementById('close-popup');

    if (configIcons.length === 0) {
        console.error('No config icons found');
        return;
    }

    configIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            event.stopPropagation();
            openConfigPopup(this.dataset.chore);
        });
    });

    if (saveConfigButton) {
        saveConfigButton.addEventListener('click', saveChoreConfig);
    } else {
        console.error('Save config button not found');
    }

    if (closePopupButton) {
        closePopupButton.addEventListener('click', closeConfigPopup);
    } else {
        console.error('Close popup button not found');
    }

    // Close popup when clicking outside
    if (popup) {
        window.addEventListener('click', function(event) {
            if (event.target === popup) {
                closeConfigPopup();
            }
        });
    } else {
        console.error('Popup element not found');
    }
}

function openConfigPopup(choreName) {
    console.log('Opening config popup for chore:', choreName);
    try {
        const popup = document.getElementById('chore-popup');
        const popupChoreName = document.getElementById('chore-name');
        const choreTime = document.getElementById('chore-time');
        const dayCheckboxes = document.querySelectorAll('.day-checkbox');

        const missingElements = [];
        if (!popup) missingElements.push('chore-popup');
        if (!popupChoreName) missingElements.push('chore-name');
        if (!choreTime) missingElements.push('chore-time');
        if (dayCheckboxes.length === 0) missingElements.push('day checkboxes');

        if (missingElements.length > 0) {
            throw new Error(`The following elements are missing: ${missingElements.join(', ')}`);
        }

        popupChoreName.textContent = choreName;
        
        // Load saved values
        const savedConfig = JSON.parse(localStorage.getItem(`chore-${choreName}-config`) || '{}');
        choreTime.value = savedConfig.time || '';
        
        // Set day checkboxes
        dayCheckboxes.forEach(checkbox => {
            checkbox.checked = savedConfig.days ? savedConfig.days.includes(checkbox.value) : false;
        });
        
        popup.style.display = 'block';
        console.log('Popup displayed for chore:', choreName);
    } catch (error) {
        console.error('Error opening config popup:', error.message);
    }
}

function saveChoreConfig() {
    console.log('Saving chore config');
    try {
        const popupChoreName = document.getElementById('chore-name');
        const choreTime = document.getElementById('chore-time');
        const dayCheckboxes = document.querySelectorAll('.day-checkbox');

        const missingElements = [];
        if (!popupChoreName) missingElements.push('chore-name');
        if (!choreTime) missingElements.push('chore-time');
        if (dayCheckboxes.length === 0) missingElements.push('day checkboxes');

        if (missingElements.length > 0) {
            throw new Error(`The following elements are missing: ${missingElements.join(', ')}`);
        }

        const choreName = popupChoreName.textContent;
        const config = {
            time: choreTime.value,
            days: Array.from(dayCheckboxes).filter(cb => cb.checked).map(cb => cb.value)
        };
        
        localStorage.setItem(`chore-${choreName}-config`, JSON.stringify(config));
        console.log('Config saved for chore:', choreName, config);
        
        // Update the chore status immediately
        if (window.chores && window.chores.updateChoreState) {
            const choreButton = document.querySelector(`[data-chore="${choreName}"]`);
            if (choreButton) {
                window.chores.updateChoreState(choreButton, { name: choreName, ...config });
            }
        } else {
            console.warn('window.chores.updateChoreState is not available');
        }

        // Close the popup after a short delay
        setTimeout(() => {
            closeConfigPopup();
            console.log('Popup closed after saving');
        }, 100);
    } catch (error) {
        console.error('Error saving chore config:', error.message);
    }
}

function closeConfigPopup() {
    console.log('Closing config popup');
    try {
        const popup = document.getElementById('chore-popup');
        if (popup) {
            popup.style.display = 'none';
            console.log('Popup closed');
        } else {
            throw new Error('Popup element not found');
        }
    } catch (error) {
        console.error('Error closing config popup:', error.message);
    }
}

// Initialize configuration when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeConfigIcons);

// Expose necessary functions globally
window.openConfigPopup = openConfigPopup;
window.saveChoreConfig = saveChoreConfig;
window.closeConfigPopup = closeConfigPopup;

console.log('config.js loaded');
