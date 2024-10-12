import { enableDrag } from './widgetDrag.js';
import { enableResize } from './widgetResize.js';
import { toggleMaximize } from './widgetMaximize.js';
import { savePositionsAndSizes, loadPositionsAndSizes, toggleWidget, resetWidget, resetAllWidgets } from './widgetPositions.js';

let isLocked = true; // Start locked
const gridSize = 20; // Grid size for snapping

export function enableDragResize() {
    console.log('Enabling drag and resize functionality');
    const resizableElements = document.querySelectorAll('.widget');
    console.log('Found resizable elements:', resizableElements.length);

    // Remove existing lock icon if it exists
    const existingLockIcon = document.querySelector('#lock-icon');
    if (existingLockIcon) {
        existingLockIcon.remove();
    }

    // Create lock icon
    const lockIcon = document.createElement('div');
    lockIcon.id = 'lock-icon';
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
    lockIcon.style.zIndex = '9999';
    lockIcon.style.backgroundColor = 'white';
    lockIcon.style.borderRadius = '50%';
    lockIcon.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    document.body.appendChild(lockIcon);

    // Create management buttons container
    const managementButtons = document.createElement('div');
    managementButtons.id = 'management-buttons';
    managementButtons.style.position = 'fixed';
    managementButtons.style.top = '10px';
    managementButtons.style.left = '50%';
    managementButtons.style.transform = 'translateX(-50%)';
    managementButtons.style.display = 'none'; // Initially hidden
    managementButtons.style.zIndex = '9999';
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
            element.style.cursor = isLocked ? 'default' : 'grab';
            element.style.boxShadow = isLocked ? 'none' : '0 0 10px rgba(0,0,0,0.1)';
            const resizeHandle = element.querySelector('.resize-handle');
            if (resizeHandle) {
                resizeHandle.style.display = isLocked ? 'none' : 'block';
            }
            const toggleButton = element.querySelector('.widget-toggle');
            if (toggleButton) {
                toggleButton.style.display = isLocked ? 'block' : 'none'; // Show when locked, hide when unlocked
            }
        });
        console.log('Lock state updated:', isLocked ? 'locked' : 'unlocked');
    }

    lockIcon.addEventListener('click', function() {
        isLocked = !isLocked;
        updateLockState();
    });

    resizableElements.forEach(element => {
        element.style.position = 'absolute';

        // Create a handle for resizing
        let resizeHandle = element.querySelector('.resize-handle');
        if (!resizeHandle) {
            resizeHandle = document.createElement('div');
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
            resizeHandle.style.zIndex = '1000';
            element.appendChild(resizeHandle);
        }

        // Add toggle button functionality
        const toggleButton = element.querySelector('.widget-toggle');
        if (toggleButton) {
            console.log('Adding toggle functionality to widget:', element.id);
            toggleButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                console.log('Toggle button clicked for widget:', element.id);
                toggleMaximize(element);
            });
        } else {
            console.warn('No toggle button found for widget:', element.id);
        }

        // Enable drag and resize
        enableDrag(element, gridSize, () => isLocked, savePositionsAndSizes);
        enableResize(element, resizeHandle, gridSize, () => isLocked, savePositionsAndSizes);
    });

    // Initial update of lock state
    updateLockState();
}

// Initialize drag and resize functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, initializing drag and resize');
    loadPositionsAndSizes();
    enableDragResize();
});

export { toggleWidget, resetWidget, resetAllWidgets };
