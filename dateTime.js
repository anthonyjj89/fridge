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