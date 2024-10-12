# Developer Log

IMPORTANT: When updating this log, add new entries at the top of the file. Do not overwrite or remove previous entries. You may add information to previous entries if necessary, but preserve all existing content.

## Version 0.1.6 - 2023-05-21

### Implemented Features
1. "All Days" button in chore scheduling popup
   - Added a new button to the chore scheduling popup for selecting all days at once
   - Implemented the functionality in chores.js to handle the "All Days" button click
   - Updated the UI to include the new button in the popup

2. Second time slot for chore scheduling
   - Modified the chore configuration structure to include a second optional time slot
   - Updated the chore scheduling popup to display and handle the second time slot
   - Adjusted the chore checking logic to account for the second time slot

3. Auto-close functionality for popups
   - Implemented a new function in ui.js to handle closing popups when clicking outside
   - Added event listeners to detect clicks outside the popup area
   - Ensured that clicks on the config icon don't trigger the auto-close functionality

### Changed Features
1. Centered chore icons
   - Updated the CSS in components/chores.css to center the icons within their containers
   - Adjusted the layout of chore buttons to ensure consistent alignment across different screen sizes

2. Non-scrollable page layout
   - Modified the main.css file to make the page fit all content on a single screen without scrolling
   - Adjusted the layout of widgets and other elements to fit within the viewport
   - Implemented fixed positioning for the debug toggle and lock icon

### Removed Features
1. "Reset All Chores" and "Export Chore Data" buttons
   - Removed the HTML elements for these buttons from the index.html file
   - Deleted associated JavaScript functions from chores.js
   - Removed related CSS styles from components/chores.css

### Fixed Issues
1. Timer behavior in content cycling
   - Refactored the contentCycling.js file to address issues with timer behavior
   - Implemented separate timers for manual and auto-cycling to prevent interference
   - Ensured that the 120-second delay after manual cycling works correctly before resuming auto-cycling

### Code Refactoring
1. chores.js
   - Updated the chore configuration structure to include the second time slot
   - Modified functions related to chore scheduling and checking to handle the new time slot
   - Implemented the "All Days" selection functionality

2. ui.js
   - Added new function addPopupAutoClose() to handle the auto-close functionality for popups
   - Updated event listeners to incorporate the new auto-close feature

3. main.css
   - Reorganized styles to implement the non-scrollable page layout
   - Added styles for fixed positioning of debug toggle and lock icon
   - Adjusted widget styles to fit within the new layout

4. index.html
   - Updated the chore popup structure to include the "All Days" button and second time slot input
   - Removed HTML elements related to the "Reset All Chores" and "Export Chore Data" buttons

### Known Issues
1. Main widget size change on cycling
   - On initial load or reset, the main widget changes size on each cycle
   - This affects the layout stability and user experience
   - Further investigation is needed to determine the root cause

2. Right widget debug outlines visible outside debug mode
   - Blue and green lines for the right widget are still visible when debug mode is not active
   - This is likely a CSS issue that needs to be addressed

3. Incorrect initial chore states
   - On initial load or without a scheduled trigger, chores are only displayed in white
   - They should be in their appropriate white or red flashing state based on their due status
   - The chore checking logic may need to be adjusted to properly set initial states

### Future Improvements
- Consider adding more customization options for chore scheduling
- Explore ways to optimize the auto-close functionality for better performance
- Investigate potential improvements for the non-scrollable layout on various device sizes
- Address the known issues listed above in the next patch or update

### Lessons Learned
1. Importance of thorough testing when implementing new UI features
2. Benefits of modular code structure when adding new functionality
3. Significance of considering user experience when removing features
4. Need for comprehensive testing across different states (initial load, reset, etc.)

### Development Environment
- No changes to the development environment in this version

### Third-party Dependencies
- No new dependencies were added in this version
- Existing dependencies remain compatible with the current implementation

## Version 0.1.5 - 2023-05-14

[Previous content remains unchanged]
