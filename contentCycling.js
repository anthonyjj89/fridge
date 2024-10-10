let rightWidgetIndex = 0;
let mainWidgetIndex = 0;
const rightWidgetElements = [
    document.getElementById('rss-news'),
    document.getElementById('ios-album'),
    document.getElementById('word-of-day-en'),
    document.getElementById('word-of-day-uk')
];
const mainWidgetElements = document.querySelectorAll('#calendar-shopping .cycling-content');

let autoScrollInterval;
let autoScrollTimeout;

function cycleRightWidget(direction) {
    console.log('Cycling right widget:', direction);
    clearInterval(autoScrollInterval);
    clearTimeout(autoScrollTimeout);

    rightWidgetElements.forEach(element => element.classList.remove('active'));

    if (direction === 'next') {
        rightWidgetIndex = (rightWidgetIndex + 1) % rightWidgetElements.length;
    } else if (direction === 'prev') {
        rightWidgetIndex = (rightWidgetIndex - 1 + rightWidgetElements.length) % rightWidgetElements.length;
    }
    
    console.log('New right widget active index:', rightWidgetIndex);
    rightWidgetElements[rightWidgetIndex].classList.add('active');
    console.log('Active right widget element:', rightWidgetElements[rightWidgetIndex].id);

    resetAutoScroll();
}

function cycleMainWidget(direction) {
    console.log('Cycling main widget:', direction);
    clearInterval(autoScrollInterval);
    clearTimeout(autoScrollTimeout);

    mainWidgetElements.forEach(element => element.classList.remove('active'));

    if (direction === 'next') {
        mainWidgetIndex = (mainWidgetIndex + 1) % mainWidgetElements.length;
    } else if (direction === 'prev') {
        mainWidgetIndex = (mainWidgetIndex - 1 + mainWidgetElements.length) % mainWidgetElements.length;
    }
    
    console.log('New main widget active index:', mainWidgetIndex);
    mainWidgetElements[mainWidgetIndex].classList.add('active');
    console.log('Active main widget element:', mainWidgetElements[mainWidgetIndex].id);

    resetAutoScroll();
}

function resetAutoScroll() {
    console.log('Resetting auto-scroll');
    autoScrollTimeout = setTimeout(() => {
        startCyclingContent();
    }, 20000);
}

function startCyclingContent() {
    console.log('Starting content cycling');
    clearInterval(autoScrollInterval);

    autoScrollInterval = setInterval(() => {
        cycleMainWidget('next');
        cycleRightWidget('next');
    }, 5000);
}

function setupEventListeners() {
    console.log('Setting up event listeners');
    const mainWidgetPrev = document.getElementById('main-widget-prev');
    const mainWidgetNext = document.getElementById('main-widget-next');
    const rightWidgetPrev = document.getElementById('right-widget-prev');
    const rightWidgetNext = document.getElementById('right-widget-next');

    if (mainWidgetPrev && mainWidgetNext && rightWidgetPrev && rightWidgetNext) {
        mainWidgetPrev.addEventListener('click', () => {
            console.log('Main widget prev clicked');
            cycleMainWidget('prev');
        });
        mainWidgetNext.addEventListener('click', () => {
            console.log('Main widget next clicked');
            cycleMainWidget('next');
        });
        rightWidgetPrev.addEventListener('click', () => {
            console.log('Right widget prev clicked');
            cycleRightWidget('prev');
        });
        rightWidgetNext.addEventListener('click', () => {
            console.log('Right widget next clicked');
            cycleRightWidget('next');
        });
        console.log('Event listeners attached successfully');
    } else {
        console.error('One or more navigation buttons not found');
    }
}

// Ensure the DOM is fully loaded before setting up event listeners and starting content cycling
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM content loaded');
        setupEventListeners();
        startCyclingContent();
    });
} else {
    console.log('DOM already loaded');
    setupEventListeners();
    startCyclingContent();
}

console.log('contentCycling.js loaded and executed');
