// Adding a new chore to the list
function addChore() {
    const newChore = document.getElementById('newChore').value;
    if (newChore) {
        const choresList = document.getElementById('chores');
        const listItem = document.createElement('li');
        listItem.textContent = newChore;
        choresList.appendChild(listItem);
        document.getElementById('newChore').value = ''; // Clear input
    }
}

// Adding a new item to the shopping list
function addItem() {
    const newItem = document.getElementById('newItem').value;
    if (newItem) {
        const itemsList = document.getElementById('items');
        const listItem = document.createElement('li');
        listItem.textContent = newItem;
        itemsList.appendChild(listItem);
        document.getElementById('newItem').value = ''; // Clear input
    }
}


function fetchGoogleCalendarEvents() {
    const calendarId = 'YOUR_GOOGLE_CALENDAR_ID';
    const apiKey = 'AIzaSyDIH9O0LARG-q2H0fTEmybeSp2o9tc9ivQ';

    fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            let eventsHTML = '<h2>Upcoming Events</h2>';
            data.items.forEach(event => {
                eventsHTML += `<p>${event.summary} - ${new Date(event.start.dateTime).toLocaleString()}</p>`;
            });
            document.getElementById('calendar').innerHTML = eventsHTML;
        })
        .catch(error => console.error('Error fetching calendar events:', error));
}

// Uncomment to enable Google Calendar
// fetchGoogleCalendarEvents();
