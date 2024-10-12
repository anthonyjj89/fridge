// Enable dragging and resizing of elements
function enableDragResize() {
    const resizableElements = document.querySelectorAll('.widget');
    const gridSize = 20; // Grid size for snapping
    let isLocked = true;

    // Create lock icon
    const lockIcon = document.createElement('div');
    lockIcon.innerHTML = '&#x1F512;'; // Lock emoji (U+1F512)
    lockIcon.style.position = 'fixed';
    lockIcon.style.bottom = '10px';
    lockIcon.style.left = '10px';
    lockIcon.style.width = '30px';
    lockIcon.style.height = '30px';
    lockIcon.style.fontSize = '24px';
    lockIcon.style.cursor = 'pointer';
    lockIcon.style.userSelect = 'none';
    lockIcon.style.display = 'flex';
    lockIcon.style.justifyContent = 'center';
    lockIcon.style.alignItems = 'center';
    document.body.appendChild(lockIcon);

    // Create management buttons container
    const managementButtons = document.createElement('div');
    managementButtons.id = 'management-buttons';
    managementButtons.style.position = 'fixed';
    managementButtons.style.top = '10px';
    managementButtons.style.left = '50%';
    managementButtons.style.transform = 'translateX(-50%)';
    managementButtons.style.display = 'none';
    document.body.appendChild(managementButtons);

    // Create management buttons
    const buttonLabels = ['Calendar/Shopping', 'Time/Weather', 'Chores', 'Word/RSS/Album'];
    const buttonIds = ['main-widget', 'datetime', 'chores', 'right-widget'];

    buttonIds.forEach((id, index) => {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'inline-block';
        buttonContainer.style.marginRight = '10px';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = buttonLabels[index];
        toggleButton.addEventListener('click', () => toggleWidget(id));
        buttonContainer.appendChild(toggleButton);

        const resetButton = document.createElement('button');
        resetButton.innerHTML = '⟲👁'; // Reset symbol + eye
        resetButton.addEventListener('click', () => resetWidget(id));
        buttonContainer.appendChild(resetButton);

        managementButtons.appendChild(buttonContainer);
    });

    // Add global reset buttons
    const globalResetVisible = document.createElement('button');
    globalResetVisible.innerHTML = '⟲👁 Reset All Visible';
    globalResetVisible.addEventListener('click', () => resetAllWidgets(true));
    managementButtons.appendChild(globalResetVisible);

    const globalResetNonVisible = document.createElement('button');
    globalResetNonVisible.innerHTML = '⟲👁‍🗨 Reset All Non-Visible';
    globalResetNonVisible.addEventListener('click', () => resetAllWidgets(false));
    managementButtons.appendChild(globalResetNonVisible);

    function updateLockState() {
        lockIcon.innerHTML = isLocked ? '&#x1F512;' : '&#x1F513;'; // 🔒 when locked, 🔓 when unlocked
        managementButtons.style.display = isLocked ? 'none' : 'flex';
        resizableElements.forEach(element => {
            element.style.cursor = isLocked ? 'default' : 'move';
            const resizeHandle = element.querySelector('.resize-handle');
            if (resizeHandle) {
                resizeHandle.style.display = isLocked ? 'none' : 'block';
            }
        });
    }

    lockIcon.addEventListener('click', function() {
        isLocked = !isLocked;
        updateLockState();
    });

    resizableElements.forEach(element => {
        element.style.position = 'absolute';

        // Create a handle for resizing
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        resizeHandle.innerHTML = '&#x2921;'; // South East Double Arrow (U+2921)
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.bottom = '0';
        resizeHandle.style.right = '0';
        resizeHandle.style.width = '20px';
        resizeHandle.style.height = '20px';
        resizeHandle.style.display = 'flex';
        resizeHandle.style.justifyContent = 'center';
        resizeHandle.style.alignItems = 'center';
        resizeHandle.style.color = 'white';
        resizeHandle.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        resizeHandle.style.cursor = 'nwse-resize';
        resizeHandle.style.fontSize = '20px';
        resizeHandle.style.display = 'none';
        element.appendChild(resizeHandle);

        // Make the entire element draggable
        element.addEventListener('mousedown', dragStart);
        element.addEventListener('touchstart', dragStart);

        function dragStart(e) {
            if (isLocked || e.target === resizeHandle) return;
            e.preventDefault();
            const touch = e.type === 'touchstart' ? e.touches[0] : e;
            const offsetX = touch.clientX - element.offsetLeft;
            const offsetY = touch.clientY - element.offsetTop;

            function moveHandler(e) {
                const touch = e.type === 'touchmove' ? e.touches[0] : e;
                element.style.left = `${Math.round((touch.clientX - offsetX) / gridSize) * gridSize}px`;
                element.style.top = `${Math.round((touch.clientY - offsetY) / gridSize) * gridSize}px`;
            }

            function endHandler() {
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', endHandler);
                document.removeEventListener('touchmove', moveHandler);
                document.removeEventListener('touchend', endHandler);
                savePositionsAndSizes();
            }

            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', endHandler);
            document.addEventListener('touchmove', moveHandler);
            document.addEventListener('touchend', endHandler);
        }

        // Make the element resizable from the bottom-right corner
        resizeHandle.addEventListener('mousedown', resizeStart);
        resizeHandle.addEventListener('touchstart', resizeStart);

        function resizeStart(e) {
            if (isLocked) return;
            e.stopPropagation();
            e.preventDefault();
            const touch = e.type === 'touchstart' ? e.touches[0] : e;
            const startX = touch.clientX;
            const startY = touch.clientY;
            const startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
            const startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);

            function moveHandler(e) {
                const touch = e.type === 'touchmove' ? e.touches[0] : e;
                const newWidth = Math.round((startWidth + touch.clientX - startX) / gridSize) * gridSize;
                const newHeight = Math.round((startHeight + touch.clientY - startY) / gridSize) * gridSize;
                element.style.width = `${newWidth}px`;
                element.style.height = `${newHeight}px`;
            }

            function endHandler() {
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', endHandler);
                document.removeEventListener('touchmove', moveHandler);
                document.removeEventListener('touchend', endHandler);
                savePositionsAndSizes();
            }

            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', endHandler);
            document.addEventListener('touchmove', moveHandler);
            document.addEventListener('touchend', endHandler);
        }
    });

    // Initial update of lock state
    updateLockState();
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
            height: element.style.height,
            visible: element.style.display !== 'none'
        });
    });
    localStorage.setItem('widgetPositions', JSON.stringify(positions));
    console.log('Saved positions:', positions);
}

// Load positions and sizes from local storage
function loadPositionsAndSizes() {
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
            element.style.left = '20px';
            element.style.top = '20px';
            element.style.display = 'block';
        }
        console.log(`Widget ${element.id} display:`, element.style.display);
    });
}

// Toggle widget visibility
function toggleWidget(id) {
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

// Reset a single widget
function resetWidget(id) {
    const widget = document.getElementById(id);
    if (widget) {
        widget.style.left = '20px';
        widget.style.top = '20px';
        widget.style.display = 'block';
        savePositionsAndSizes();
    }
}

// Reset all widgets
function resetAllWidgets(visibleOnly) {
    const widgets = document.querySelectorAll('.widget');
    let topOffset = 20;
    widgets.forEach(widget => {
        if (!visibleOnly || widget.style.display !== 'none') {
            widget.style.left = '20px';
            widget.style.top = `${topOffset}px`;
            widget.style.display = 'block';
            topOffset += 50; // Offset each widget by 50px vertically
        }
    });
    savePositionsAndSizes();
}

// Initialize drag and resize functionality
document.addEventListener('DOMContentLoaded', () => {
    loadPositionsAndSizes();
    enableDragResize();
});
