# Developer Log

## Version 0.1.5 - 2023-05-14

### Implemented Features
1. Debug mode toggle
   - Added a button to enable/disable debug mode
   - Implemented localStorage to persist debug mode state across page reloads
   - Debug mode now displays widget outlines, names, and timers for easier development and troubleshooting

2. Widget naming in debug mode
   - Added widget names to each widget's HTML structure
   - Implemented CSS to show/hide widget names based on debug mode
   - This feature significantly improves the ability to identify and work with specific widgets during development

3. Attempted improvement of widget cycling behavior
   - Implemented independent timers for main and right widgets
   - Attempted to add 120-second delay after manual cycling before resuming auto-cycling
   - Aimed to ensure each widget's cycling behavior is independent

### Fixed Issues
1. Widget outlines appearing outside debug mode
   - Modified CSS to only show outlines when debug mode is active
   - Fixed issue with right widget having a blue outline instead of green
   - Root cause: CSS specificity issues and lack of proper debug mode checks
   - Solution: Implemented a 'debugging' class on the body element and used it to control debug-related styles

2. Inconsistent timer behavior
   - Refactored timer logic to handle manual and auto-cycling correctly
   - Fixed issue where both widgets' timers were affected by cycling one widget
   - Root cause: Shared timer variables between widgets and lack of independent cycling logic
   - Solution: Implemented separate timer variables and cycling functions for each widget

### Ongoing Issues
1. Double-jumping in widget cycling
   - Problem: Widgets still skip two items instead of one when cycling
   - Current behavior: When cycling, the widget moves two positions instead of one
   - Expected behavior: The widget should move only one position at a time
   - Potential causes:
     a. Event listeners might be triggered multiple times
     b. Cycling logic may be incrementing the index twice
     c. Possible race condition in the cycling functions
   - Next steps:
     a. Review event listener implementation in contentCycling.js
     b. Add additional logging to track index changes during cycling
     c. Investigate potential asynchronous operations that might interfere with cycling

2. 120-second delay not functioning correctly
   - Problem: The 120-second delay after manual cycling is not working as intended
   - Current behavior: The timer is visible in debug mode but resets to 120 seconds every 5 seconds
   - Expected behavior: After manual cycling, there should be a 120-second delay before auto-cycling resumes
   - Potential causes:
     a. Auto-cycling timer might be overriding the manual cycling delay
     b. Incorrect implementation of the delay logic
     c. Possible conflict between different timing functions
   - Next steps:
     a. Review the implementation of the delay logic in contentCycling.js
     b. Add more detailed logging to track timer state changes
     c. Investigate the interaction between auto-cycling and manual cycling timers

### Code Refactoring
1. contentCycling.js
   - Separated concerns for main and right widget cycling
   - Implemented pauseMainWidgetCycling and pauseRightWidgetCycling functions
   - Updated event listeners to handle manual cycling correctly
   - Improved code organization and readability

2. main.css
   - Reorganized debug-related styles
   - Improved specificity of debug mode styles to prevent unintended styling
   - Centralized widget-related styles for easier maintenance

3. index.html
   - Restructured widget containers for better consistency
   - Added data attributes for easier JavaScript selection and manipulation

### Known Issues
- Double-jumping in widget cycling (as described in Ongoing Issues)
- 120-second delay after manual cycling not functioning correctly

### Future Improvements
- Resolve the double-jumping issue in widget cycling
- Fix the 120-second delay functionality after manual cycling
- Implement more robust timing and cycling logic
- Consider adding more detailed logging in debug mode
- Explore options for customizable widget cycling intervals
- Implement unit tests for critical cycling and timer functions
- Optimize performance for devices with lower processing power

### Lessons Learned
1. Importance of independent state management for each widget
2. Benefits of implementing a comprehensive debug mode for development
3. Necessity of thorough testing for timing-related features
4. Value of clear separation of concerns in JavaScript modules
5. Importance of careful event listener management to prevent unintended behavior
6. Complexity of managing multiple timers and cycling behaviors simultaneously

### Development Environment
- Ensure all developers are using the same linter settings to maintain code consistency
- Consider implementing a pre-commit hook to run linter and tests automatically

### Third-party Dependencies
- No new dependencies were added in this version
- Existing dependencies are up-to-date and compatible with the current implementation
