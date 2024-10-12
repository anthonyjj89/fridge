export function enableDrag(element, gridSize, isLockedFn, savePositionsAndSizes) {
    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart);

    function dragStart(e) {
        console.log('Drag start attempted');
        if (isLockedFn()) {
            console.log('Drag prevented: locked');
            return;
        }
        if (e.target.classList.contains('resize-handle') || e.target.classList.contains('widget-toggle')) {
            console.log('Drag prevented: clicked on resize handle or toggle button');
            return;
        }
        if (element.classList.contains('maximized')) {
            console.log('Drag prevented: widget is maximized');
            return;
        }

        console.log('Drag started');
        e.preventDefault();
        const touch = e.type === 'touchstart' ? e.touches[0] : e;
        const offsetX = touch.clientX - element.offsetLeft;
        const offsetY = touch.clientY - element.offsetTop;

        element.style.cursor = 'grabbing';

        function moveHandler(e) {
            const touch = e.type === 'touchmove' ? e.touches[0] : e;
            const newLeft = Math.round((touch.clientX - offsetX) / gridSize) * gridSize;
            const newTop = Math.round((touch.clientY - offsetY) / gridSize) * gridSize;
            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;
            console.log(`Widget moved to: (${newLeft}, ${newTop})`);
        }

        function endHandler() {
            console.log('Drag ended');
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', endHandler);
            document.removeEventListener('touchmove', moveHandler);
            document.removeEventListener('touchend', endHandler);
            element.style.cursor = 'grab';
            savePositionsAndSizes();
        }

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', endHandler);
        document.addEventListener('touchmove', moveHandler);
        document.addEventListener('touchend', endHandler);
    }

    // Set initial cursor style
    element.style.cursor = 'grab';
}

console.log('WidgetDrag.js loaded');
