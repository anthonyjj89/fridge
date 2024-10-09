// Enable dragging and resizing of elements
function enableDragResize() {
    const resizableElements = document.querySelectorAll('.widget');
    const gridSize = 20; // Grid size for snapping
    let isLocked = true;

    // Create lock icon
    const lockIcon = document.createElement('div');
    lockIcon.style.position = 'fixed';
    lockIcon.style.bottom = '10px';
    lockIcon.style.left = '10px';
    lockIcon.style.width = '30px';
    lockIcon.style.height = '30px';
    lockIcon.style.backgroundColor = 'red'; // Changed to red square
    lockIcon.style.cursor = 'pointer';
    document.body.appendChild(lockIcon);

    lockIcon.addEventListener('click', function() {
        isLocked = !isLocked;
        lockIcon.style.backgroundColor = isLocked ? 'red' : 'green'; // Toggle between red and green
        resizableElements.forEach(element => {
            element.style.resize = isLocked ? 'none' : 'both';
            element.style.cursor = isLocked ? 'default' : 'move';
            const dragHandle = element.querySelector('.drag-handle');
            if (dragHandle) {
                dragHandle.style.display = isLocked ? 'none' : 'block';
            }
        });
    });

    resizableElements.forEach(element => {
        element.style.position = 'absolute';

        // Create a handle for dragging
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.style.width = '20px';
        dragHandle.style.height = '20px';
        dragHandle.style.background = 'rgba(0, 0, 0, 0.5)';
        dragHandle.style.position = 'absolute';
        dragHandle.style.top = '0';
        dragHandle.style.left = '0';
        dragHandle.style.cursor = 'move';
        dragHandle.style.display = 'none';
        element.appendChild(dragHandle);

        // Make the element draggable from the top-left handle
        dragHandle.addEventListener('mousedown', function(e) {
            if (isLocked) return;
            const offsetX = e.clientX - element.offsetLeft;
            const offsetY = e.clientY - element.offsetTop;

            function mouseMoveHandler(e) {
                element.style.left = `${Math.round((e.clientX - offsetX) / gridSize) * gridSize}px`;
                element.style.top = `${Math.round((e.clientY - offsetY) / gridSize) * gridSize}px`;
            }

            function mouseUpHandler() {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
                savePositionsAndSizes();
            }

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });
    });
}

// Save positions and sizes to local storage
function savePositionsAndSizes() {
    const resizableElements = document.querySelectorAll('.widget');
    const positions = [];
    resizableElements.forEach(element => {
        positions.push({
            id: element.id,
            left: element.style.left,
            top: element.style.top,
            width: element.style.width,
            height: element.style.height
        });
    });
    localStorage.setItem('widgetPositions', JSON.stringify(positions));
}

// Load positions and sizes from local storage
function loadPositionsAndSizes() {
    const positions = JSON.parse(localStorage.getItem('widgetPositions')) || [];
    positions.forEach(pos => {
        const element = document.getElementById(pos.id);
        if (element) {
            element.style.left = pos.left;
            element.style.top = pos.top;
            element.style.width = pos.width;
            element.style.height = pos.height;
        }
    });
}
