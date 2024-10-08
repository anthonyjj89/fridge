// Initialize configuration icons
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

    console.log('Found', configIcons.length, 'config icons');

    configIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            console.log('Config icon clicked:', this.dataset.chore);
            const choreName = this.dataset.chore;
            popupChoreName.textContent = choreName;
            
            // Load saved values
            const savedConfig = JSON.parse(localStorage.getItem(`${choreName}-config`)) || {};
            console.log('Loaded saved config:', savedConfig);
            choreTime1.value = savedConfig.time1 || '';
            choreTime2.value = savedConfig.time2 || '';
            
            // Set day checkboxes
            dayCheckboxes.forEach(checkbox => {
                checkbox.checked = savedConfig.days ? savedConfig.days.includes(checkbox.value) : false;
            });
            
            popup.style.display = 'block';
            console.log('Popup displayed');
            event.stopPropagation(); // Prevent event from bubbling up
        });
    });

    allDaysButton.addEventListener('click', function() {
        const allChecked = Array.from(dayCheckboxes).every(cb => cb.checked);
        dayCheckboxes.forEach(checkbox => {
            checkbox.checked = !allChecked;
        });
    });

    saveConfigButton.addEventListener('click', function() {
        const choreName = popupChoreName.textContent;
        const config = {
            time1: choreTime1.value,
            time2: choreTime2.value,
            days: Array.from(dayCheckboxes).filter(cb => cb.checked).map(cb => cb.value)
        };
        console.log('Saving config:', choreName, config);
        localStorage.setItem(`${choreName}-config`, JSON.stringify(config));
        popup.style.display = 'none';
        console.log('Config saved and popup hidden');
        updateChoreSchedule(choreName, config);
    });

    closePopupButton.addEventListener('click', function() {
        popup.style.display = 'none';
        console.log('Popup closed');
    });

    // Close popup when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';
            console.log('Popup closed by clicking outside');
        }
    });
}

// Function to update chore schedule
function updateChoreSchedule(choreName, config) {
    const chore = document.querySelector(`.chore-button[data-chore="${choreName}"]`);
    if (!chore) {
        console.error('Chore not found:', choreName);
        return;
    }

    chore.dataset.days = JSON.stringify(config.days);
    chore.dataset.time1 = config.time1;
    chore.dataset.time2 = config.time2;

    console.log('Updated chore schedule:', choreName, chore.dataset);
}