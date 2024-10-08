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
    
    // Chores system initialization
    initializeChoreButtons();
    loadChoreStates();
    startChoreScheduleChecker();
    
    initializeConfigIcons();
    console.log('All initializations complete');

    // Add scroll functionality for chore list
    document.getElementById('scroll-left').addEventListener('click', function() {
        document.getElementById('chore-list').scrollBy({ left: -100, behavior: 'smooth' });
    });

    document.getElementById('scroll-right').addEventListener('click', function() {
        document.getElementById('chore-list').scrollBy({ left: 100, behavior: 'smooth' });
    });

    // Example of using the chores event system
    window.eventSystem.subscribe('choreStateChanged', (data) => {
        console.log(`Main.js: Chore ${data.choreName} state changed to ${data.isActive ? 'active' : 'inactive'}`);
        // You can add any global UI updates or other actions here
    });

    window.eventSystem.subscribe('allChoresReset', () => {
        console.log('Main.js: All chores have been reset');
        // You can add any global UI updates or other actions here
    });

    // Add a button to reset all chores
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset All Chores';
    resetButton.addEventListener('click', window.resetAllChores);
    document.body.appendChild(resetButton);

    // Add a button to export chore data
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Chore Data';
    exportButton.addEventListener('click', () => {
        const data = window.exportChoreData();
        console.log('Exported chore data:', data);
        // You could add code here to save the data to a file or send it to a server
    });
    document.body.appendChild(exportButton);
});

// Activate the default cycling content view
function activateDefaultView() {
    document.querySelector('#calendar-shopping .cycling-content').classList.add('active');
    document.getElementById('rss-news').classList.add('active');
}

activateDefaultView();