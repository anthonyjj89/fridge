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