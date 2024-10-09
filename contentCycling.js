// Start cycling content every 5 seconds
function startCyclingContent() {
    const calendarShoppingElements = document.querySelectorAll('#calendar-shopping .cycling-content');
    const rightWidgetElements = [
        document.getElementById('rss-news'),
        document.getElementById('ios-album'),
        document.getElementById('word-of-day-en'),
        document.getElementById('word-of-day-uk')
    ];
    let calendarShoppingIndex = 0;
    let rightWidgetIndex = 0;

    setInterval(() => {
        // Cycle calendar and shopping list
        calendarShoppingElements.forEach((element, index) => {
            element.classList.toggle('active', index === calendarShoppingIndex);
        });
        calendarShoppingIndex = (calendarShoppingIndex + 1) % calendarShoppingElements.length;

        // Cycle right widget content
        rightWidgetElements.forEach((element, index) => {
            element.classList.remove('active');
        });
        rightWidgetElements[rightWidgetIndex].classList.add('active');
        rightWidgetIndex = (rightWidgetIndex + 1) % rightWidgetElements.length;
    }, 5000);
}