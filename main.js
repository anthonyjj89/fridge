// Main entry point
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
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
    console.log('All initializations complete');

    // Add scroll functionality for chore list
    document.getElementById('scroll-left').addEventListener('click', function() {
        document.getElementById('chore-list').scrollBy({ left: -100, behavior: 'smooth' });
    });

    document.getElementById('scroll-right').addEventListener('click', function() {
        document.getElementById('chore-list').scrollBy({ left: 100, behavior: 'smooth' });
    });
});

// Activate the default cycling content view
function activateDefaultView() {
    document.querySelector('#calendar-shopping .cycling-content').classList.add('active');
    document.getElementById('rss-news').classList.add('active');
}

activateDefaultView();