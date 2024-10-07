let inputCode = "";

// Function to add number to code
function enterCode(number) {
    if (inputCode.length < 4) {
        inputCode += number;
        updateDisplay();
    }
}

// Function to clear the code
function clearCode() {
    inputCode = "";
    updateDisplay();
}

// Function to update the display (for visual feedback)
function updateDisplay() {
    let display = inputCode.padEnd(4, '*');
    document.getElementById('input-display').textContent = display;
}

// Function to check if the code is correct
function checkCode() {
    const hashedCorrectCode = "03ac674216f3e15c761ee1a5e255f067953623c8f9664f560c8c20c2f6d7ea57"; // Hash of "1234"
    const inputHash = CryptoJS.SHA256(inputCode).toString();
    
    if (inputHash === hashedCorrectCode) {
        localStorage.setItem('authenticated', 'true');  // Store authentication token
        document.getElementById('passcode-panel').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    } else {
        alert("Incorrect passcode");
        clearCode();
    }
}

// On page load, check if the user is already authenticated
document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem('authenticated') === 'true') {
        document.getElementById('passcode-panel').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    }
});

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