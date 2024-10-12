import { enableDragResize, loadPositionsAndSizes } from './dragResize.js';
import { toggleMaximize } from './widgetMaximize.js';
import { initializeCalendar } from './calendar.js';
import { initializeWeather } from './weather.js';
import { updateDateTime } from './dateTime.js';
import { updateIosAlbum } from './iosAlbum.js';
import { initializeRSSFeed } from './rss.js';
import { initialize as initializeChores, checkAllChores, chores } from './chores.js';
import { initializeUI } from './ui.js';
import { initializeContentCycling, cycleRightWidget } from './contentCycling.js';

console.log('Main.js execution started');

export function initializeApp() {
    console.log('Initializing app version v0.1.7');
    
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
        { name: 'RSS', func: initializeRSSFeed },
    ];

    components.forEach(component => {
        try {
            console.log(`Initializing ${component.name}...`);
            component.func();
            console.log(`${component.name} initialized successfully`);
            
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
        initializeChores();
        console.log('Chores system initialized successfully');
        console.log('Chores config:', chores.config);
    } catch (error) {
        console.error('Error initializing chores system:', error);
    }
    
    // Initialize UI components
    try {
        console.log('Initializing UI components...');
        initializeUI();
        console.log('UI components initialized successfully');
    } catch (error) {
        console.error('Error initializing UI components:', error);
    }
    
    // Initialize chore status checking
    try {
        console.log('Setting up chore checking...');
        checkAllChores();
        setInterval(checkAllChores, 10000); // Check every 10 sec
        console.log('Chore checking set up successfully');
    } catch (error) {
        console.error('Error setting up chore checking:', error);
    }

    // Initialize content cycling and set up event listeners
    try {
        console.log('Initializing content cycling...');
        initializeContentCycling();
        console.log('Content cycling initialized successfully');
    } catch (error) {
        console.error('Error initializing content cycling:', error);
    }

    // Initialize toggle buttons
    try {
        console.log('Initializing toggle buttons...');
        initializeToggleButtons();
        console.log('Toggle buttons initialized successfully');
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

    // Log all widget elements
    const widgets = document.querySelectorAll('.widget');
    console.log('All widget elements:', widgets);
    widgets.forEach((widget, index) => {
        console.log(`Widget ${index + 1}:`, widget.id, 'Display:', widget.style.display);
    });
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

// Initialize toggle buttons
function initializeToggleButtons() {
    const toggleButtons = document.querySelectorAll('.widget-toggle');
    console.log('Toggle buttons found:', toggleButtons.length);
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

// Initialize app when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, initializing app');
    initializeApp();
});

console.log('Main.js loaded');
