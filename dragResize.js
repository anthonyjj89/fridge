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

    function updateLockState() {
        lockIcon.innerHTML = isLocked ? '&#x1F512;' : '&#x1F513;'; // 🔒 when locked, 🔓 when unlocked
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
