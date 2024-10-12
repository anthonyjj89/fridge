import { enableDragResize } from './dragResize.js';
import { loadPositionsAndSizes } from './widgetPositions.js';
import { toggleMaximize } from './widgetMaximize.js';

console.log('Main.js execution started');

export function initializeApp() {
    console.log('Initializing app version v0.1.5');
    
    const initializationTimeout = setTimeout(() => {
        console.error('Initialization timed out after 6 seconds');
    }, 6000);

    // Initialize core components
    const components = [
        { name: 'Calendar', func: window.initializeCalendar || (() => console.log('Calendar initialization not available')) },
        { name: 'Weather', func: window.initializeWeather || (() => console.log('Weather initialization not available')) },
        { name: 'DateTime', func: window.updateDateTime || (() => console.log('DateTime update not available')) },
        { name: 'IosAlbum', func: window.updateIosAlbum || (() => console.log('IosAlbum update not available')) },
        { name: 'DragResize', func: enableDragResize },
        { name: 'PositionsAndSizes', func: loadPositionsAndSizes },
        { name: 'RSS', func: window.initializeRSSFeed || (() => console.log('RSS initialization not available')) },
    ];

    components.forEach(component => {
        try {
            console.log(`Initializing ${component.name}...`);
            component.func();
            console.log(`${component.name} initialized`);
            
            if (component.name === 'Calendar') {
                const calendarWidget = document.getElementById('main-widget');
                console.log('Calendar widget display after initialization:', calendarWidget ? calendarWidget.style.display : 'Widget not found');
            }
        } catch (error) {
            console.error(`Error initializing ${component.name}:`, error);
        }
    });

    // Initialize chores system
    try {
        console.log('Initializing chores system...');
        if (window.chores && window.chores.initialize) {
            window.chores.initialize();
            console.log('Chores system initialized');
        } else {
            console.warn('Chores system not available');
        }
    } catch (error) {
        console.error('Error initializing chores system:', error);
    }
    
    // Initialize UI components
    try {
        console.log('Initializing UI components...');
        if (window.initializeUI) {
            window.initializeUI();
            console.log('UI components initialized');
        } else {
            console.warn('UI initialization not available');
        }
    } catch (error) {
        console.error('Error initializing UI components:', error);
    }
    
    // Initialize chore status checking
    try {
        console.log('Setting up chore checking...');
        if (window.chores && window.chores.checkAllChores) {
            window.chores.checkAllChores();
            setInterval(() => {
                try {
                    window.chores.checkAllChores();
                } catch (error) {
                    console.error('Error checking chores:', error);
                }
            }, 60000); // Check every minute
            console.log('Chore checking set up');
        } else {
            console.warn('Chore checking not available');
        }
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

    // Initialize toggle buttons
    try {
        console.log('Initializing toggle buttons...');
        initializeToggleButtons();
        console.log('Toggle buttons initialized');
    } catch (error) {
        console.error('Error initializing toggle buttons:', error);
    }
    
    console.log('All initializations complete');

    activateDefaultView();
    clearTimeout(initializationTimeout);

    // Final check of main widget visibility
    const mainWidget = document.getElementById('main-widget');
    console.log('Final main widget display:', mainWidget ? mainWidget.style.display : 'Widget not found');
    console.log('Main widget computed style display:', mainWidget ? window.getComputedStyle(mainWidget).display : 'Widget not found');
}

// Activate the default cycling content view
function activateDefaultView() {
    console.log('Activating default view');
    const calendarContent = document.querySelector('#calendar-shopping .cycling-content');
    if (calendarContent) {
        calendarContent.classList.add('active');
        console.log('Calendar content class list after activation:', calendarContent.classList);
    } else {
        console.warn('Calendar content not found');
    }
    
    const rssNews = document.getElementById('rss-news');
    if (rssNews) {
        rssNews.classList.add('active');
        console.log('RSS news class list after activation:', rssNews.classList);
    } else {
        console.warn('RSS news element not found');
    }
}

// Initialize content cycling and set up event listeners
function initializeContentCycling() {
    if (typeof window.startCyclingContent === 'function') {
        window.startCyclingContent();
    } else {
        console.warn('startCyclingContent function not found');
    }

    const prevButton = document.getElementById('right-widget-prev');
    const nextButton = document.getElementById('right-widget-next');

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            console.log('Prev button clicked');
            if (typeof window.cycleRightWidget === 'function') {
                window.cycleRightWidget('prev');
            } else {
                console.warn('cycleRightWidget function not found');
            }
        });
        nextButton.addEventListener('click', () => {
            console.log('Next button clicked');
            if (typeof window.cycleRightWidget === 'function') {
                window.cycleRightWidget('next');
            } else {
                console.warn('cycleRightWidget function not found');
            }
        });
        console.log('Event listeners for right widget buttons set up');
    } else {
        console.warn('Right widget navigation buttons not found');
    }
}

// Initialize toggle buttons
function initializeToggleButtons() {
    const toggleButtons = document.querySelectorAll('.widget-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const widget = event.target.closest('.widget');
            if (widget) {
                console.log(`Toggle button clicked for widget: ${widget.id}`);
                toggleMaximize(widget);
            } else {
                console.warn('Widget not found');
            }
        });
    });
    console.log('Toggle buttons initialized');
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

// Initialize app when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, initializing app');
    initializeApp();
});

console.log('Main.js loaded');
