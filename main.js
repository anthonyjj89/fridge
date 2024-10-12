console.log('Main.js execution started');

function initializeApp() {
    console.log('Initializing app version v0.1.3');
    
    const initializationTimeout = setTimeout(() => {
        console.error('Initialization timed out after 6 seconds');
    }, 6000);

    // Initialize core components
    const components = [
        { name: 'Calendar', func: initializeCalendar },
        { name: 'Weather', func: initializeWeather },
        { name: 'DateTime', func: updateDateTime },
        { name: 'IosAlbum', func: updateIosAlbum },
        { name: 'DragResize', func: enableDragResize },
        { name: 'PositionsAndSizes', func: loadPositionsAndSizes },
        { name: 'RSS', func: initializeRSSFeed }, // Add RSS feed initialization
    ];

    components.forEach(component => {
        try {
            console.log(`Initializing ${component.name}...`);
            component.func();
            console.log(`${component.name} initialized`);
            
            if (component.name === 'Calendar') {
                const calendarWidget = document.getElementById('main-widget');
                console.log('Calendar widget display after initialization:', calendarWidget.style.display);
            }
        } catch (error) {
            console.error(`Error initializing ${component.name}:`, error);
        }
    });

    // Initialize chores system
    try {
        console.log('Initializing chores system...');
        window.chores.initialize();
        console.log('Chores system initialized');
    } catch (error) {
        console.error('Error initializing chores system:', error);
    }
    
    // Initialize UI components
    try {
        console.log('Initializing UI components...');
        initializeUI();
        console.log('UI components initialized');
    } catch (error) {
        console.error('Error initializing UI components:', error);
    }
    
    // Initialize chore status checking
    try {
        console.log('Setting up chore checking...');
        window.chores.checkAllChores();
        setInterval(() => {
            try {
                window.chores.checkAllChores();
            } catch (error) {
                console.error('Error checking chores:', error);
            }
        }, 60000); // Check every minute
        console.log('Chore checking set up');
    } catch (error) {
        console.error('Error setting up chore checking:', error);
    }

    // Initialize content cycling and set up event listeners
    try {
        console.log('Initializing content cycling...');
        initializeContentCycling();
        console.log('Content cycling initialized');
    } catch (error) {
        console.error('Error initializing content cycling:', error);
    }
    
    console.log('All initializations complete');

    activateDefaultView();
    clearTimeout(initializationTimeout);

    // Final check of main widget visibility
    const mainWidget = document.getElementById('main-widget');
    console.log('Final main widget display:', mainWidget.style.display);
    console.log('Main widget computed style display:', window.getComputedStyle(mainWidget).display);
}

// Activate the default cycling content view
function activateDefaultView() {
    console.log('Activating default view');
    const calendarContent = document.querySelector('#calendar-shopping .cycling-content');
    calendarContent.classList.add('active');
    console.log('Calendar content class list after activation:', calendarContent.classList);
    
    const rssNews = document.getElementById('rss-news');
    rssNews.classList.add('active');
    console.log('RSS news class list after activation:', rssNews.classList);
}

// Initialize content cycling and set up event listeners
function initializeContentCycling() {
    if (typeof startCyclingContent === 'function') {
        startCyclingContent();
    } else {
        console.error('startCyclingContent function not found');
    }

    const prevButton = document.getElementById('right-widget-prev');
    const nextButton = document.getElementById('right-widget-next');

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            console.log('Prev button clicked');
            if (typeof cycleRightWidget === 'function') {
                cycleRightWidget('prev');
            } else {
                console.error('cycleRightWidget function not found');
            }
        });
        nextButton.addEventListener('click', () => {
            console.log('Next button clicked');
            if (typeof cycleRightWidget === 'function') {
                cycleRightWidget('next');
            } else {
                console.error('cycleRightWidget function not found');
            }
        });
        console.log('Event listeners for right widget buttons set up');
    } else {
        console.error('Right widget navigation buttons not found');
    }
}

// Expose the onChoreConfigSaved function globally
window.onChoreConfigSaved = function() {
    console.log('Chore config saved, updating chores');
    if (window.chores && window.chores.checkAllChores) {
        try {
            window.chores.checkAllChores();
        } catch (error) {
            console.error('Error updating chores after config save:', error);
        }
    } else {
        console.warn('Chore checking function not available');
    }
};

// Run initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

console.log('Main.js loaded');
