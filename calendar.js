// Mock Calendar Data
function generateMockEvents() {
    const events = [];
    const today = new Date();
    const eventTypes = ['Meeting', 'Appointment', 'Lunch', 'Workout', 'Study', 'Movie Night', 'Grocery Shopping'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const numEvents = Math.floor(Math.random() * 3) + 1; // 1 to 3 events per day
        
        for (let j = 0; j < numEvents; j++) {
            const event = {
                summary: eventTypes[Math.floor(Math.random() * eventTypes.length)],
                start: {
                    dateTime: new Date(date.setHours(9 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 60))),
                },
            };
            events.push(event);
        }
    }
    
    return events;
}

function initializeCalendar() {
    const events = generateMockEvents();
    const calendarContent = document.getElementById('calendar-content');
    let html = '<ul>';
    
    if (events && events.length > 0) {
        events.forEach(event => {
            const start = new Date(event.start.dateTime);
            html += `<li>${start.toLocaleDateString()} ${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}: ${event.summary}</li>`;
        });
    } else {
        html += '<li>No upcoming events found.</li>';
    }
    
    html += '</ul>';
    calendarContent.innerHTML = html;
}

// Initialize calendar when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCalendar);

console.log('Calendar.js loaded');
