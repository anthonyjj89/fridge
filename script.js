// Ensure JavaScript runs after the DOM has loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    initializeWeather();
    updateDateTime();
    updateIosAlbum();
    startCyclingContent();
    enableDragResize();
    loadPositionsAndSizes();
    initializeChoreButtons();
    initializeConfigIcons();
    startChoreScheduleChecker();
    loadChoreStates(); // Load chore states from localStorage

    // Add scroll functionality for chore list
    document.getElementById('scroll-left').addEventListener('click', function() {
        document.getElementById('chore-list').scrollBy({ left: -100, behavior: 'smooth' });
    });

    document.getElementById('scroll-right').addEventListener('click', function() {
        document.getElementById('chore-list').scrollBy({ left: 100, behavior: 'smooth' });
    });
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const dayElement = document.getElementById('day');
    const timeElement = document.getElementById('time');

    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    dayElement.textContent = days[now.getDay()];

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    timeElement.textContent = `${formattedHours}.${formattedMinutes}${ampm}`;

    // Update every minute
    setTimeout(updateDateTime, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()));
}

// Weather Widget Integration
function initializeWeather() {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
    const city = 'Dubai';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temperatureElement = document.getElementById('temperature');
            if (data && data.main) {
                const temperature = Math.round(data.main.temp);
                temperatureElement.textContent = `${temperature}°C`;
            } else {
                temperatureElement.textContent = 'Weather data unavailable';
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            const temperatureElement = document.getElementById('temperature');
            temperatureElement.textContent = 'Failed to load weather data';
        });
}

// Google Calendar integration
function initializeCalendar() {
    const apiKey = 'AIzaSyDIH9O0LARG-q2H0fTEmybeSp2o9tc9ivQ';
    const calendarId = 'primary';
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Debugging API response
            const events = data.items;
            const calendarContent = document.getElementById('calendar-content');
            let html = '<ul>';
            if (events && events.length > 0) {
                events.forEach(event => {
                    const start = new Date(event.start.dateTime || event.start.date);
                    html += `<li>${start.toLocaleDateString()}: ${event.summary}</li>`;
                });
            } else {
                html += '<li>No upcoming events found.</li>';
            }
            html += '</ul>';
            calendarContent.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching calendar events:', error);
            const calendarContent = document.getElementById('calendar-content');
            calendarContent.innerHTML = '<p>Failed to load calendar events.</p>';
        });
}

// iOS Public Album integration
function updateIosAlbum() {
    const albumUrl = 'https://www.icloud.com/sharedalbum/#B0UGrq0zwuvmn8';
    const albumContent = document.getElementById('album-content');
    
    // For demo purposes, we'll display a message indicating that the album is loading
    albumContent.innerHTML = '<p>Loading iOS album...</p>';

    // If more functionality is needed, add it here to fetch album data dynamically
}

// Start cycling content every 5 seconds
function startCyclingContent() {
    const calendarShoppingElements = document.querySelectorAll('#calendar-shopping .cycling-content');
    const rightWidgetElements = [
        document.getElementById('rss-news'),
        document.getElementById('ios-album'),
        document.getElementById('word-of-day-en'),
        document.getElementById('word-of-day-uk')
    ];
    let calendarShoppingIndex = 0;
    let rightWidgetIndex = 0;

    setInterval(() => {
        // Cycle calendar and shopping list
        calendarShoppingElements.forEach((element, index) => {
            element.classList.toggle('active', index === calendarShoppingIndex);
        });
        calendarShoppingIndex = (calendarShoppingIndex + 1) % calendarShoppingElements.length;

        // Cycle right widget content
        rightWidgetElements.forEach((element, index) => {
            element.classList.remove('active');
        });
        rightWidgetElements[rightWidgetIndex].classList.add('active');
        rightWidgetIndex = (rightWidgetIndex + 1) % rightWidgetElements.length;
    }, 5000);
}

// Enable dragging and resizing of elements
function enableDragResize() {
    const resizableElements = document.querySelectorAll('.widget');
    const gridSize = 20; // Grid size for snapping
    let isLocked = true;

    // Create lock icon
    const lockIcon = document.createElement('div');
    lockIcon.style.position = 'fixed';
    lockIcon.style.bottom = '10px';
    lockIcon.style.left = '10px';
    lockIcon.style.width = '30px';
    lockIcon.style.height = '30px';
    lockIcon.style.background = 'url(lock.png) no-repeat center center';
    lockIcon.style.backgroundSize = 'contain';
    lockIcon.style.cursor = 'pointer';
    document.body.appendChild(lockIcon);

    lockIcon.addEventListener('click', function() {
        isLocked = !isLocked;
        lockIcon.style.background = isLocked ? 'url(lock.png) no-repeat center center' : 'url(unlock.png) no-repeat center center';
        resizableElements.forEach(element => {
            element.style.resize = isLocked ? 'none' : 'both';
            element.style.cursor = isLocked ? 'default' : 'move';
            const dragHandle = element.querySelector('.drag-handle');
            if (dragHandle) {
                dragHandle.style.display = isLocked ? 'none' : 'block';
            }
        });
    });

    resizableElements.forEach(element => {
        element.style.position = 'absolute';

        // Create a handle for dragging
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.style.width = '20px';
        dragHandle.style.height = '20px';
        dragHandle.style.background = 'rgba(0, 0, 0, 0.5)';
        dragHandle.style.position = 'absolute';
        dragHandle.style.top = '0';
        dragHandle.style.left = '0';
        dragHandle.style.cursor = 'move';
        dragHandle.style.display = 'none';
        element.appendChild(dragHandle);

        // Make the element draggable from the top-left handle
        dragHandle.addEventListener('mousedown', function(e) {
            if (isLocked) return;
            const offsetX = e.clientX - element.offsetLeft;
            const offsetY = e.clientY - element.offsetTop;

            function mouseMoveHandler(e) {
                element.style.left = `${Math.round((e.clientX - offsetX) / gridSize) * gridSize}px`;
                element.style.top = `${Math.round((e.clientY - offsetY) / gridSize) * gridSize}px`;
            }

            function mouseUpHandler() {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
                savePositionsAndSizes();
            }

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });
    });
}

// Save positions and sizes to local storage
function savePositionsAndSizes() {
    const resizableElements = document.querySelectorAll('.widget');
    const positions = [];
    resizableElements.forEach(element => {
        positions.push({
            id: element.id,
            left: element.style.left,
            top: element.style.top,
            width: element.style.width,
            height: element.style.height
        });
    });
    localStorage.setItem('widgetPositions', JSON.stringify(positions));
}

// Load positions and sizes from local storage
function loadPositionsAndSizes() {
    const positions = JSON.parse(localStorage.getItem('widgetPositions')) || [];
    positions.forEach(pos => {
        const element = document.getElementById(pos.id);
        if (element) {
            element.style.left = pos.left;
            element.style.top = pos.top;
            element.style.width = pos.width;
            element.style.height = pos.height;
        }
    });
}

// Example: Activate the default cycling content view
function activateDefaultView() {
    document.querySelector('#calendar-shopping .cycling-content').classList.add('active');
    document.getElementById('rss-news').classList.add('active');
}

activateDefaultView();

// Initialize chore buttons
function initializeChoreButtons() {
    const buttons = document.querySelectorAll('.chore-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            saveChoreState(this.dataset.chore, this.classList.contains('active'));
            sortChores(); // Sort chores after toggling active state
        });
    });
}

// Save chore state to localStorage
function saveChoreState(choreName, isActive) {
    localStorage.setItem(`chore-${choreName}`, isActive);
}

// Load chore states from localStorage
function loadChoreStates() {
    const buttons = document.querySelectorAll('.chore-button');
    buttons.forEach(button => {
        const choreName = button.dataset.chore;
        const isActive = localStorage.getItem(`chore-${choreName}`) === 'true';
        if (isActive) {
            button.classList.add('active');
        }
    });
    sortChores(); // Sort chores after loading states
}

// Sort chores function
function sortChores() {
    const choreList = document.getElementById('chore-list');
    const chores = Array.from(choreList.querySelectorAll('.chore-container'));
    
    chores.sort((a, b) => {
        const aActive = a.querySelector('.chore-button').classList.contains('active');
        const bActive = b.querySelector('.chore-button').classList.contains('active');
        if (aActive === bActive) return 0;
        return aActive ? 1 : -1;
    });
    
    chores.forEach(chore => choreList.appendChild(chore));
}

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

    console.log('Found', configIcons.length, 'config icons');

    configIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            console.log('Config icon clicked:', this.dataset.chore);
            const choreName = this.dataset.chore;
            popupChoreName.textContent = choreName;
            
            // Load saved values
            const savedConfig = JSON.parse(localStorage.getItem(`${choreName}-config`)) || {};
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

    saveConfigButton.addEventListener('click', function() {
        const choreName = popupChoreName.textContent;
        const config = {
            time1: choreTime1.value,
            time2: choreTime2.value,
            days: Array.from(dayCheckboxes).filter(cb => cb.checked).map(cb => cb.value)
        };
        localStorage.setItem(`${choreName}-config`, JSON.stringify(config));
        popup.style.display = 'none';
        console.log('Config saved and popup hidden');
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

// Function to check if a chore is due
function isChoreScheduled(config, currentDay, currentTime) {
    if (!config.days || !config.days.includes(currentDay)) {
        return false;
    }

    const now = new Date();
    const time1 = new Date(now.toDateString() + ' ' + config.time1);
    const time2 = config.time2 ? new Date(now.toDateString() + ' ' + config.time2) : null;
    const currentDateTime = new Date(now.toDateString() + ' ' + currentTime);

    // Check if the current time is past the scheduled time(s)
    if (currentDateTime >= time1 || (time2 && currentDateTime >= time2)) {
        return true;
    }

    return false;
}

// Function to check chore schedules and update their state
function checkChoreSchedules() {
    const now = new Date();
    const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const chores = document.querySelectorAll('.chore-button');
    chores.forEach(chore => {
        const choreName = chore.dataset.chore;
        const config = JSON.parse(localStorage.getItem(`${choreName}-config`)) || {};

        if (isChoreScheduled(config, currentDay, currentTime)) {
            chore.classList.add('due');
        } else {
            chore.classList.remove('due');
        }

        // Keep the 'active' class if it's present
        if (chore.classList.contains('active')) {
            chore.classList.remove('due');
        }

        saveChoreState(choreName, chore.classList.contains('active'));
    });
}

// Start the chore schedule checker
function startChoreScheduleChecker() {
    checkChoreSchedules(); // Check immediately on start
    setInterval(checkChoreSchedules, 60000); // Check every minute
}

// Call sortChores initially to ensure correct order on page load
document.addEventListener('DOMContentLoaded', function() {
    sortChores();
});