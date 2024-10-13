let maximizedWidget = null;
let maximizeTimer = null;
let touchStartY = 0;
let touchEndY = 0;

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
    widget.style.position = widget.dataset.originalPosition;
    widget.style.left = widget.dataset.originalLeft;
    widget.style.top = widget.dataset.originalTop;
    widget.style.width = widget.dataset.originalWidth;
    widget.style.height = widget.dataset.originalHeight;
    widget.style.zIndex = widget.dataset.originalZIndex;

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
    touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    touchEndY = event.changedTouches[0].clientY;
    const swipeDistance = touchStartY - touchEndY;

    if (Math.abs(swipeDistance) > 50) { // Minimum swipe distance
        const widget = event.target.closest('.widget');
        if (widget) {
            if (swipeDistance > 0) {
                // Swipe up
                if (!widget.classList.contains('maximized')) {
                    maximizeWidget(widget);
                }
            } else {
                // Swipe down
                if (widget.classList.contains('maximized')) {
                    minimizeWidget(widget);
                }
            }
        }
    }
}

// Add swipe gesture listeners to all widgets
export function addSwipeListeners() {
    const widgets = document.querySelectorAll('.widget');
    widgets.forEach(widget => {
        widget.addEventListener('touchstart', handleTouchStart);
        widget.addEventListener('touchend', handleTouchEnd);
    });
}

console.log('WidgetMaximize.js loaded');
