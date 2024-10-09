// Main entry point
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    
    // Initialize core components
    initializeCalendar();
    initializeWeather();
    updateDateTime();
    updateIosAlbum();
    startCyclingContent();
    enableDragResize();
    loadPositionsAndSizes();
    
    // Initialize chores system
    window.chores.initialize();
    
    // Initialize UI components
    initializeUI();
    
    initializeConfigIcons();
    
    console.log('All initializations complete');

    activateDefaultView();
});

// Activate the default cycling content view
function activateDefaultView() {
    document.querySelector('#calendar-shopping .cycling-content').classList.add('active');
    document.getElementById('rss-news').classList.add('active');
}
