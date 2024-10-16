export function savePositionsAndSizes() {
    const resizableElements = document.querySelectorAll('.widget');
    const positions = [];
    resizableElements.forEach(element => {
        positions.push({
            id: element.id,
            left: element.style.left,
            top: element.style.top,
            width: element.style.width,
            height: element.style.height,
            visible: element.style.display !== 'none'
        });
    });
    localStorage.setItem('widgetPositions', JSON.stringify(positions));
    console.log('Saved positions:', positions);
}

export function loadPositionsAndSizes() {
    const positions = JSON.parse(localStorage.getItem('widgetPositions')) || [];
    console.log('Loaded positions:', positions);
    const resizableElements = document.querySelectorAll('.widget');
    
    resizableElements.forEach(element => {
        const savedPosition = positions.find(pos => pos.id === element.id);
        if (savedPosition) {
            element.style.left = savedPosition.left;
            element.style.top = savedPosition.top;
            element.style.width = savedPosition.width;
            element.style.height = savedPosition.height;
            element.style.display = savedPosition.visible ? 'block' : 'none';
        } else {
            // If no saved position, set default values
            setDefaultWidgetSize(element);
            element.style.left = '20px';
            element.style.top = '20px';
            element.style.display = 'block';
        }
        console.log(`Widget ${element.id} display:`, element.style.display);
    });
}

export function toggleWidget(id) {
    const widget = document.getElementById(id);
    if (widget) {
        console.log(`Toggling widget ${id}. Current display:`, widget.style.display);
        if (widget.style.display === 'none') {
            widget.style.display = 'block';
            if (!widget.style.left && !widget.style.top) {
                // If the widget has no position, center it
                const rect = widget.getBoundingClientRect();
                widget.style.left = `${(window.innerWidth - rect.width) / 2}px`;
                widget.style.top = `${(window.innerHeight - rect.height) / 2}px`;
            }
        } else {
            widget.style.display = 'none';
        }
        console.log(`Widget ${id} new display:`, widget.style.display);
        savePositionsAndSizes();
    }
}

export function resetWidget(id) {
    const widget = document.getElementById(id);
    if (widget) {
        setDefaultWidgetSize(widget);
        widget.style.left = '20px';
        widget.style.top = '20px';
        widget.style.display = 'block';
        savePositionsAndSizes();
    }
}

export function resetAllWidgets(visibleOnly) {
    const widgets = document.querySelectorAll('.widget');
    let topOffset = 20;
    widgets.forEach(widget => {
        if (!visibleOnly || widget.style.display !== 'none') {
            setDefaultWidgetSize(widget);
            widget.style.left = '20px';
            widget.style.top = `${topOffset}px`;
            widget.style.display = 'block';
            topOffset += 50; // Offset each widget by 50px vertically
        }
    });
    savePositionsAndSizes();
}

function setDefaultWidgetSize(widget) {
    if (widget.id === 'chores') {
        widget.style.width = '400px';
        widget.style.height = '100px';
    } else {
        widget.style.width = '400px';
        widget.style.height = '400px';
    }
}

console.log('WidgetPositions.js loaded');
