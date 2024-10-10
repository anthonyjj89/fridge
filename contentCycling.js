let rightWidgetIndex = 0;
const rightWidgetElements = [
    document.getElementById('rss-news'),
    document.getElementById('ios-album'),
    document.getElementById('word-of-day-en'),
    document.getElementById('word-of-day-uk')
];

let autoScrollInterval;
let autoScrollTimeout;

function cycleRightWidget(direction) {
    console.log('Cycling right widget:', direction);
    clearInterval(autoScrollInterval);
    clearTimeout(autoScrollTimeout);

    // Remove 'active' class from all elements
    rightWidgetElements.forEach(element => element.classList.remove('active'));

    if (direction === 'next') {
        rightWidgetIndex = (rightWidgetIndex + 1) % rightWidgetElements.length;
    } else if (direction === 'prev') {
        rightWidgetIndex = (rightWidgetIndex - 1 + rightWidgetElements.length) % rightWidgetElements.length;
    }
    
    console.log('New active index:', rightWidgetIndex);
    
    // Add 'active' class to the new active element
    rightWidgetElements[rightWidgetIndex].classList.add('active');

    console.log('Active element:', rightWidgetElements[rightWidgetIndex].id);

    // Reset auto-scrolling after 20 seconds
    autoScrollTimeout = setTimeout(() => {
        startCyclingContent();
    }, 20000);
}

function startCyclingContent() {
    console.log('Starting content cycling');
    const calendarShoppingElements = document.querySelectorAll('#calendar-shopping .cycling-content');
    let calendarShoppingIndex = 0;

    // Clear any existing intervals
    clearInterval(autoScrollInterval);

    autoScrollInterval = setInterval(() => {
        // Cycle calendar and shopping list
        calendarShoppingElements.forEach((element, index) => {
            element.classList.toggle('active', index === calendarShoppingIndex);
        });
        calendarShoppingIndex = (calendarShoppingIndex + 1) % calendarShoppingElements.length;

        // Cycle right widget content
        cycleRightWidget('next');
    }, 5000);
}

// Remove the setupEventListeners function and its call

// Start the initial content cycling
startCyclingContent();

console.log('contentCycling.js loaded and executed');
