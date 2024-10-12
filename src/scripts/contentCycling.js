let rightWidgetIndex = 0;
let mainWidgetIndex = 0;
let rightWidgetElements = [];
let mainWidgetElements = [];

let autoScrollInterval;
let mainWidgetManualTimeout;
let rightWidgetManualTimeout;
let debugTimerIntervals = {};

const AUTO_CYCLE_INTERVAL = 5000; // 5 seconds
const MANUAL_CYCLE_DELAY = 120000; // 2 minutes

let isDebugging = localStorage.getItem('isDebugging') === 'true';

export function cycleRightWidget(direction, manual = false) {
    console.log('Cycling right widget:', direction);
    console.log('Current right widget index before cycling:', rightWidgetIndex);

    rightWidgetElements.forEach((element, index) => {
        console.log(`Right widget element ${index} (${element.id}) classList before:`, element.classList);
        element.classList.remove('active');
        console.log(`Right widget element ${index} (${element.id}) classList after removal:`, element.classList);
    });

    if (direction === 'next') {
        rightWidgetIndex = (rightWidgetIndex + 1) % rightWidgetElements.length;
    } else if (direction === 'prev') {
        rightWidgetIndex = (rightWidgetIndex - 1 + rightWidgetElements.length) % rightWidgetElements.length;
    }
    
    console.log('New right widget active index:', rightWidgetIndex);
    rightWidgetElements[rightWidgetIndex].classList.add('active');
    console.log(`Right widget element ${rightWidgetIndex} (${rightWidgetElements[rightWidgetIndex].id}) classList after adding active:`, rightWidgetElements[rightWidgetIndex].classList);

    if (manual) {
        pauseRightWidgetCycling();
    }
    updateDebugTimers('right');
}
export function cycleMainWidget(direction, manual = false) {
    console.log('Cycling main widget:', direction);
    console.log('Current main widget index before cycling:', mainWidgetIndex);

    mainWidgetElements.forEach((element, index) => {
        console.log(`Main widget element ${index} classList before:`, element.classList);
        element.classList.remove('active');
        console.log(`Main widget element ${index} classList after removal:`, element.classList);
    });

    if (direction === 'next') {
        mainWidgetIndex = (mainWidgetIndex + 1) % mainWidgetElements.length;
    } else if (direction === 'prev') {
        mainWidgetIndex = (mainWidgetIndex - 1 + mainWidgetElements.length) % mainWidgetElements.length;
    }
    
    console.log('New main widget active index:', mainWidgetIndex);
    mainWidgetElements[mainWidgetIndex].classList.add('active');
    console.log(`Main widget element ${mainWidgetIndex} classList after adding active:`, mainWidgetElements[mainWidgetIndex].classList);

    if (manual) {
        pauseMainWidgetCycling();
    }
    updateDebugTimers('main');
}


export function startAutoCycling() {
    console.log('Starting auto cycling');
    stopAutoCycling(); // Clear any existing intervals
    autoScrollInterval = setInterval(() => {
        console.log('Auto-cycling triggered');
        if (!mainWidgetManualTimeout) cycleMainWidget('next');
        if (!rightWidgetManualTimeout) cycleRightWidget('next');
    }, AUTO_CYCLE_INTERVAL);
    updateDebugTimers('both');
}

export function stopAutoCycling() {
    console.log('Stopping auto cycling');
    clearInterval(autoScrollInterval);
    clearDebugTimers();
}

function pauseMainWidgetCycling() {
    console.log('Pausing main widget cycling');
    clearTimeout(mainWidgetManualTimeout);
    mainWidgetManualTimeout = setTimeout(() => {
        mainWidgetManualTimeout = null;
        if (!rightWidgetManualTimeout) startAutoCycling();
    }, MANUAL_CYCLE_DELAY);
    updateDebugTimers('main');
}

function pauseRightWidgetCycling() {
    console.log('Pausing right widget cycling');
    clearTimeout(rightWidgetManualTimeout);
    rightWidgetManualTimeout = setTimeout(() => {
        rightWidgetManualTimeout = null;
        if (!mainWidgetManualTimeout) startAutoCycling();
    }, MANUAL_CYCLE_DELAY);
    updateDebugTimers('right');
}

function updateDebugTimers(widgetType) {
    if (!isDebugging) return;

    const updateTimer = (elementId, duration) => {
        const timerElement = document.getElementById(elementId);
        if (!timerElement) return;

        clearInterval(debugTimerIntervals[elementId]);

        let remainingTime = duration;
        timerElement.textContent = (remainingTime / 1000).toFixed(1);

        debugTimerIntervals[elementId] = setInterval(() => {
            remainingTime -= 100;
            if (remainingTime <= 0) {
                clearInterval(debugTimerIntervals[elementId]);
                timerElement.textContent = '0.0';
            } else {
                timerElement.textContent = (remainingTime / 1000).toFixed(1);
            }
        }, 100);
    };

    if (widgetType === 'main' || widgetType === 'both') {
        updateTimer('main-widget-debug-timer', mainWidgetManualTimeout ? MANUAL_CYCLE_DELAY : AUTO_CYCLE_INTERVAL);
    }
    if (widgetType === 'right' || widgetType === 'both') {
        updateTimer('right-widget-debug-timer', rightWidgetManualTimeout ? MANUAL_CYCLE_DELAY : AUTO_CYCLE_INTERVAL);
    }
}

function clearDebugTimers() {
    Object.values(debugTimerIntervals).forEach(clearInterval);
    debugTimerIntervals = {};
}

export function toggleDebugging() {
    isDebugging = !isDebugging;
    localStorage.setItem('isDebugging', isDebugging);
    document.body.classList.toggle('debugging', isDebugging);
    if (isDebugging) {
        updateDebugTimers('both');
    } else {
        clearDebugTimers();
    }
}

function setupEventListeners() {
    console.log('Setting up event listeners');
    const mainWidgetPrev = document.getElementById('main-widget-prev');
    const mainWidgetNext = document.getElementById('main-widget-next');
    const rightWidgetPrev = document.getElementById('right-widget-prev');
    const rightWidgetNext = document.getElementById('right-widget-next');

    if (mainWidgetPrev && mainWidgetNext && rightWidgetPrev && rightWidgetNext) {
        mainWidgetPrev.addEventListener('click', (e) => {
            console.log('Main widget prev button clicked');
            e.preventDefault();
            cycleMainWidget('prev', true);
        });
        mainWidgetNext.addEventListener('click', (e) => {
            console.log('Main widget next button clicked');
            e.preventDefault();
            cycleMainWidget('next', true);
        });
        rightWidgetPrev.addEventListener('click', (e) => {
            console.log('Right widget prev button clicked');
            e.preventDefault();
            cycleRightWidget('prev', true);
        });
        rightWidgetNext.addEventListener('click', (e) => {
            console.log('Right widget next button clicked');
            e.preventDefault();
            cycleRightWidget('next', true);
        });
        console.log('Event listeners attached successfully');
    } else {
        console.error('One or more navigation buttons not found');
    }
}

export function initializeCycling() {
    console.log('Initializing content cycling');
    rightWidgetElements = [
        document.getElementById('rss-news'),
        document.getElementById('ios-album'),
        document.getElementById('word-of-day-en'),
        document.getElementById('word-of-day-uk')
    ].filter(Boolean);
    mainWidgetElements = Array.from(document.querySelectorAll('#calendar-shopping .cycling-content'));

    console.log('Main widget elements:', mainWidgetElements);
    console.log('Right widget elements:', rightWidgetElements);
    rightWidgetElements.forEach((element, index) => {
        console.log(`Right widget element ${index}:`, element.id);
    });

    if (rightWidgetElements.length > 0 && mainWidgetElements.length > 0) {
        setupEventListeners();
        startAutoCycling();
    } else {
        console.error('Widget elements not found. Cycling cannot be initialized.');
    }

    // Initialize debugging state
    document.body.classList.toggle('debugging', isDebugging);
    if (isDebugging) {
        updateDebugTimers('both');
    }
}

console.log('contentCycling.js loaded and executed');

// Export the initializeCycling function as initializeContentCycling
export { initializeCycling as initializeContentCycling };
