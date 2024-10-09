// Configuration and Schedule Popup Logic

function initializeConfigIcons() {
    console.log('Initializing configuration icons...');
    const configIcons = document.querySelectorAll('.config-icon');
    const popup = document.getElementById('popup');
    const popupChoreName = document.getElementById('popup-chore-name');
    const choreTime = document.getElementById('chore-time');
    const saveConfigButton = document.getElementById('save-config');
    const closePopupButton = document.getElementById('close-popup');

    configIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            openConfigPopup(this.dataset.chore);
            event.stopPropagation();
        });
    });

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
    const choreTime = document.getElementById('chore-time');

    popupChoreName.textContent = choreName;
    
    // Load saved values
    const savedConfig = JSON.parse(localStorage.getItem(`chore-${choreName}-config`) || '{}');
    choreTime.value = savedConfig.time || '';
    
    popup.style.display = 'block';
    console.log('Popup displayed for chore:', choreName);
}

function saveChoreConfig() {
    const popupChoreName = document.getElementById('popup-chore-name');
    const choreTime = document.getElementById('chore-time');

    const choreName = popupChoreName.textContent;
    const config = {
        time: choreTime.value
    };
    
    localStorage.setItem(`chore-${choreName}-config`, JSON.stringify(config));
    console.log('Config saved for chore:', choreName, config);
    
    // Schedule the chore
    if (window.scheduleChore) {
        window.scheduleChore(choreName, config.time);
    }
    
    closeConfigPopup();
}

function closeConfigPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
    console.log('Popup closed');
}

// Initialize configuration when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeConfigIcons);
