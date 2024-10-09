// Configuration and Schedule Popup Logic

function initializeConfigIcons() {
    console.log('Initializing configuration icons...');
    const configIcons = document.querySelectorAll('.config-icon');
    const popup = document.getElementById('popup');
    const popupChoreName = document.getElementById('popup-chore-name');
    const choreTime1 = document.getElementById('chore-time-1');
    const choreTime2 = document.getElementById('chore-time-2');
    const dayCheckboxes = document.querySelectorAll('.day-selection input[type="checkbox"]');
    const saveConfigButton = document.getElementById('save-config');
    const closePopupButton = document.getElementById('close-popup');
    const allDaysButton = document.getElementById('all-days-button');

    configIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            openConfigPopup(this.dataset.chore);
            event.stopPropagation();
        });
    });

    allDaysButton.addEventListener('click', toggleAllDays);
    saveConfigButton.addEventListener('click', saveChoreConfig);
    closePopupButton.addEventListener('click', closeConfigPopup);

    // Close popup when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === popup) {
            closeConfigPopup();
        }
    });
}

function openConfigPopup(choreName) {
    const popup = document.getElementById('popup');
    const popupChoreName = document.getElementById('popup-chore-name');
    const choreTime1 = document.getElementById('chore-time-1');
    const choreTime2 = document.getElementById('chore-time-2');
    const dayCheckboxes = document.querySelectorAll('.day-selection input[type="checkbox"]');

    popupChoreName.textContent = choreName;
    
    // Load saved values
    const savedConfig = JSON.parse(localStorage.getItem(`chore-${choreName}-config`) || '{}');
    choreTime1.value = savedConfig.time1 || '';
    choreTime2.value = savedConfig.time2 || '';
    
    // Set day checkboxes
    dayCheckboxes.forEach(checkbox => {
        checkbox.checked = savedConfig.days ? savedConfig.days.includes(checkbox.value) : false;
    });
    
    popup.style.display = 'block';
    console.log('Popup displayed for chore:', choreName);
}

function toggleAllDays() {
    const dayCheckboxes = document.querySelectorAll('.day-selection input[type="checkbox"]');
    const allChecked = Array.from(dayCheckboxes).every(cb => cb.checked);
    dayCheckboxes.forEach(checkbox => {
        checkbox.checked = !allChecked;
    });
}

function saveChoreConfig() {
    const popupChoreName = document.getElementById('popup-chore-name');
    const choreTime1 = document.getElementById('chore-time-1');
    const choreTime2 = document.getElementById('chore-time-2');
    const dayCheckboxes = document.querySelectorAll('.day-selection input[type="checkbox"]');

    const choreName = popupChoreName.textContent;
    const config = {
        time1: choreTime1.value,
        time2: choreTime2.value,
        days: Array.from(dayCheckboxes).filter(cb => cb.checked).map(cb => cb.value)
    };
    
    localStorage.setItem(`chore-${choreName}-config`, JSON.stringify(config));
    console.log('Config saved for chore:', choreName, config);
    
    closeConfigPopup();
    
    // Update the chore UI if needed
    const choreButton = document.querySelector(`.chore-button[data-chore="${choreName}"]`);
    if (choreButton && window.choreToggle && window.choreToggle.updateUI) {
        window.choreToggle.updateUI(choreButton);
    }
}

function closeConfigPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
    console.log('Popup closed');
}

// Initialize configuration when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeConfigIcons);
