import { enterResizeMode, exitResizeMode } from './widgetMaximize.js';

export function enableResize(element, resizeHandle, gridSize, isLockedFn, savePositionsAndSizes) {
    let isInResizeMode = false;

    resizeHandle.addEventListener('mousedown', resizeStart);
    resizeHandle.addEventListener('touchstart', resizeStart);

    // Function to update resizable state
    function updateResizableState() {
        console.log('Updating resizable state for widget:', element.id);
        if (isLockedFn()) {
            console.log('Widget is locked:', element.id);
            element.classList.remove('resizable');
            resizeHandle.style.display = 'none';
            if (isInResizeMode) {
                console.log('Exiting resize mode due to lock:', element.id);
                exitResizeMode(element);
                isInResizeMode = false;
            }
        } else {
            console.log('Widget is unlocked:', element.id);
            element.classList.add('resizable');
            resizeHandle.style.display = 'block';
            if (!isInResizeMode) {
                console.log('Entering resize mode:', element.id);
                enterResizeMode(element);
                isInResizeMode = true;
            }
        }
    }

    // Initial update of resizable state
    updateResizableState();

    // Update resizable state whenever lock state changes
    document.addEventListener('lockStateChanged', updateResizableState);

    function resizeStart(e) {
        if (isLockedFn()) {
            console.log('Resize attempted while locked:', element.id);
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        const touch = e.type === 'touchstart' ? e.touches[0] : e;
        const startX = touch.clientX;
        const startY = touch.clientY;
        const startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
        const startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);

        if (!isInResizeMode) {
            console.log('Entering resize mode during resize start:', element.id);
            enterResizeMode(element);
            isInResizeMode = true;
        }

        function moveHandler(e) {
            const touch = e.type === 'touchmove' ? e.touches[0] : e;
            const newWidth = Math.max(gridSize, Math.round((startWidth + touch.clientX - startX) / gridSize) * gridSize);
            const newHeight = Math.max(gridSize, Math.round((startHeight + touch.clientY - startY) / gridSize) * gridSize);
            element.style.width = `${newWidth}px`;
            element.style.height = `${newHeight}px`;
        }

        function endHandler() {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', endHandler);
            document.removeEventListener('touchmove', moveHandler);
            document.removeEventListener('touchend', endHandler);
            savePositionsAndSizes();
            console.log('Resize operation ended:', element.id);
            // Do not exit resize mode here, as the widget should remain resizable
        }

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', endHandler);
        document.addEventListener('touchmove', moveHandler);
        document.addEventListener('touchend', endHandler);
    }
}

console.log('WidgetResize.js loaded');
