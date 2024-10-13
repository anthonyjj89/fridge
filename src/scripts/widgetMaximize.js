let maximizedWidget = null;
let maximizeTimer = null;
let touchStartY = 0;
let touchEndY = 0;
let isAppLocked = true; // Assume the app starts in locked state
let isSwipeEnabled = true; // Assume swipe is enabled by default

export function toggleMaximize(widget) {
    console.log('Toggling maximize for widget:', widget.id);
    if (widget.classList.contains('maximized')) {
        minimizeWidget(widget);
    } else {
        maximizeWidget(widget);
    }
}

function maximizeWidget(widget) {
    console.log('Maximizing widget:', widget.id);
    if (maximizedWidget) {
        minimizeWidget(maximizedWidget);
    }

    // Store the original position and size
    widget.dataset.originalLeft = widget.style.left;
    widget.dataset.originalTop = widget.style.top;
    widget.dataset.originalWidth = widget.style.width;
    widget.dataset.originalHeight = widget.style.height;
    widget.dataset.originalZIndex = widget.style.zIndex;
    widget.dataset.originalPosition = widget.style.position;

    // Apply maximized styles
    widget.classList.add('maximized');
    widget.style.position = 'fixed';
    widget.style.left = '30px';
    widget.style.top = '30px';
    widget.style.width = 'calc(100vw - 60px)';
    widget.style.height = 'calc(100vh - 60px)';
    widget.style.zIndex = '9999';

    // Add specific fullscreen class for widgets
    if (widget.id === 'weather') {
        widget.classList.add('weather-fullscreen');
    } else if (widget.id === 'chores') {
        widget.classList.add('chores-fullscreen');
    } else if (widget.id === 'datetime') {
        const weatherDetails = widget.querySelector('.weather-details');
        if (weatherDetails) {
            weatherDetails.style.display = 'flex';
        }
    }

    // Create clickable padding area
    const paddingArea = document.createElement('div');
    paddingArea.className = 'maximized-padding';
    paddingArea.style.position = 'fixed';
    paddingArea.style.top = '0';
    paddingArea.style.left = '0';
    paddingArea.style.width = '100vw';
    paddingArea.style.height = '100vh';
    paddingArea.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    paddingArea.style.zIndex = '9998';
    paddingArea.addEventListener('click', (e) => {
        if (e.target === paddingArea) {
            minimizeWidget(widget);
        }
    });
    document.body.appendChild(paddingArea);

    maximizedWidget = widget;
    resetMaximizeTimer();

    // Add event listeners for user interaction
    widget.addEventListener('mousemove', resetMaximizeTimer);
    widget.addEventListener('click', resetMaximizeTimer);
    widget.addEventListener('keydown', resetMaximizeTimer);

    console.log('Widget maximized:', widget.id);
}

function minimizeWidget(widget) {
    console.log('Minimizing widget:', widget.id);
    // Remove clickable padding area
    const paddingArea = document.querySelector('.maximized-padding');
    if (paddingArea) {
        paddingArea.remove();
    }

    // Restore original position and size
    widget.classList.remove('maximized');
    // Remove specific fullscreen classes
    widget.classList.remove('weather-fullscreen', 'chores-fullscreen');
    
    widget.style.position = widget.dataset.originalPosition || '';
    widget.style.left = widget.dataset.originalLeft || '';
    widget.style.top = widget.dataset.originalTop || '';
    widget.style.width = widget.dataset.originalWidth || '';
    widget.style.height = widget.dataset.originalHeight || '';
    widget.style.zIndex = widget.dataset.originalZIndex || '';

    if (widget.id === 'datetime') {
        const weatherDetails = widget.querySelector('.weather-details');
        if (weatherDetails) {
            weatherDetails.style.display = 'none';
        }
    }

    // Remove event listeners
    widget.removeEventListener('mousemove', resetMaximizeTimer);
    widget.removeEventListener('click', resetMaximizeTimer);
    widget.removeEventListener('keydown', resetMaximizeTimer);

    clearTimeout(maximizeTimer);
    maximizedWidget = null;

    console.log('Widget minimized:', widget.id);
}

function resetMaximizeTimer() {
    console.log('Resetting maximize timer');
    clearTimeout(maximizeTimer);
    maximizeTimer = setTimeout(() => {
        if (maximizedWidget) {
            console.log('Auto-minimizing widget after 2 minutes of inactivity');
            minimizeWidget(maximizedWidget);
        }
    }, 120000); // 2 minutes
}

function handleTouchStart(event) {
    console.log('Touch start event on widget:', event.target.closest('.widget').id);
    touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    console.log('Touch end event on widget:', event.target.closest('.widget').id);
    if (!isAppLocked || !isSwipeEnabled) {
        console.log('App is unlocked or swipe is disabled, swipe ignored');
        return;
    }

    touchEndY = event.changedTouches[0].clientY;
    const swipeDistance = touchStartY - touchEndY;

    if (Math.abs(swipeDistance) > 50) { // Minimum swipe distance
        const widget = event.target.closest('.widget');
        console.log('Swipe detected on widget:', widget.id, 'Distance:', swipeDistance);
        if (widget) {
            if (swipeDistance > 0) {
                // Swipe up
                if (!widget.classList.contains('maximized')) {
                    console.log('Swipe up - Maximizing widget:', widget.id);
                    maximizeWidget(widget);
                }
            } else {
                // Swipe down
                if (widget.classList.contains('maximized')) {
                    console.log('Swipe down - Minimizing widget:', widget.id);
                    minimizeWidget(widget);
                }
            }
        }
    }
}

// Add swipe gesture listeners to all widgets
export function addSwipeListeners(widget) {
    if (isAppLocked && isSwipeEnabled) {
        console.log('Adding swipe listeners to widget:', widget.id);
        widget.addEventListener('touchstart', handleTouchStart);
        widget.addEventListener('touchend', handleTouchEnd);
    } else {
        console.log('App is unlocked or swipe is disabled, swipe listeners not added to widget:', widget.id);
    }
}

// Remove swipe gesture listeners from a widget
export function removeSwipeListeners(widget) {
    console.log('Removing swipe listeners from widget:', widget.id);
    widget.removeEventListener('touchstart', handleTouchStart);
    widget.removeEventListener('touchend', handleTouchEnd);
}

// Function to be called when a widget enters resize mode
export function enterResizeMode(widget) {
    console.log('Entering resize mode for widget:', widget.id);
    removeSwipeListeners(widget);
}

// Function to be called when a widget exits resize mode
export function exitResizeMode(widget) {
    console.log('Exiting resize mode for widget:', widget.id);
    if (isAppLocked && isSwipeEnabled) {
        addSwipeListeners(widget);
    }
}

// Function to update the app's locked state
export function updateAppLockedState(locked) {
    isAppLocked = locked;
    console.log('App locked state updated:', isAppLocked);
    updateSwipeListeners();
}

// Function to update the app's swipe state
export function updateAppSwipeState(enabled) {
    isSwipeEnabled = enabled;
    console.log('App swipe state updated:', isSwipeEnabled);
    updateSwipeListeners();
}

// Function to update swipe listeners based on current app state
function updateSwipeListeners() {
    const widgets = document.querySelectorAll('.widget');
    widgets.forEach(widget => {
        if (isAppLocked && isSwipeEnabled) {
            addSwipeListeners(widget);
        } else {
            removeSwipeListeners(widget);
        }
    });
}

console.log('WidgetMaximize.js loaded');
