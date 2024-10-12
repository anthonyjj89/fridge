export function enableResize(element, resizeHandle, gridSize, isLockedFn, savePositionsAndSizes) {
    resizeHandle.addEventListener('mousedown', resizeStart);
    resizeHandle.addEventListener('touchstart', resizeStart);

    function resizeStart(e) {
        if (isLockedFn()) return;
        e.stopPropagation();
        e.preventDefault();
        const touch = e.type === 'touchstart' ? e.touches[0] : e;
        const startX = touch.clientX;
        const startY = touch.clientY;
        const startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
        const startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);

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
        }

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', endHandler);
        document.addEventListener('touchmove', moveHandler);
        document.addEventListener('touchend', endHandler);
    }
}
