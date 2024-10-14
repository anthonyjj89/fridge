# Internal Patch Roadmap

- When updating this document, do not remove previous entries. Amend the file by adding new entries at the top.

## Version 0.1.9 - Planned Release

### Overview
Version 0.1.9 aims to address remaining known issues from 0.1.8 and implement new features to enhance user experience.

### Key Updates & Priorities

1. **Fix Chore State Initialization** - **Priority: High**
   - Address the issue where chores may not initialize in the correct state on first load or reset.
   - **Estimated Timeline**: 2 days.
   - **Risks**: This involves logic changes, so regression tests are important to ensure this doesn't introduce new bugs.

2. **Implement Day/Night Themes** - **Priority: High**
   - Create day and night themes for the application.
   - Implement automatic theme switching based on the time of day.
   - **Estimated Timeline**: 3-4 days.
   - **Risks**: Ensure smooth transitions between themes and maintain readability of all widgets in both themes.

### Development Considerations
- Comprehensive testing across different devices and screen sizes is crucial.
- Ensure that the new features (especially the day/night themes) don't negatively impact performance.
- Test the swipe functionality thoroughly to ensure it doesn't interfere with other touch-based interactions.

---

## Version 0.1.8 - Completed Release

### Overview
Version 0.1.8 focused on implementing full-screen functionality for widgets, improving weather information display, and enhancing the overall user experience.

### Key Updates & Priorities

1. **Swipe Function for Full Screen** - **Completed**
   - Implemented swipe up gesture to make widgets fullscreen.
   - Implemented swipe down gesture to return widgets to normal size.
   - Maintained existing toggle button functionality.

2. **Weather Widget Background in Full Screen** - **Completed**
   - Added a background to the weather widget when it goes full screen.

3. **Remove Scroll Bars in Resize Mode** - **Completed**
   - Eliminated scroll bars when widgets are in resize mode.

### Remaining Issues
- Chores may not always initialize in the correct state (flashing red-white) on first load or reset.

---

## Version 0.1.7 - Completed Release

### Overview
Version 0.1.7 focused on improving widget functionality, addressing scrollbar issues, and enhancing the overall user experience. The folder restructure was completed in this version.

### Remaining Issues
- Chores may not always initialize in the correct state (flashing red-white) on first load or reset.

---

## Version 0.2.0 - Planned Release

### Overview
Version 0.2.0 focuses on introducing major new features that significantly expand the functionality of the application.

### Key Features & Priorities
1. **RSS Feed Integration** - **Priority: High**
   - Allow users to pull in external content via an RSS feed reader.
   - **Estimated Timeline**: 3-4 days.
   - **Risks**: Parsing RSS data may introduce performance issues depending on the source.

2. **Ukrainian & English Word of the Day** - **Priority: High**
   - Use the external API to display a word of the day in Ukrainian and English with cross translation.
   - **Estimated Timeline**: 2 days.
   - **Risks**: API integration could introduce latency or dependency issues.

3. **iOS Public Album Slideshow** - **Priority: Medium**
   - Add functionality to display images from an iOS public album in a slideshow format.
   - **Estimated Timeline**: 3 days.
   - **Risks**: Handling image loading efficiently to avoid performance bottlenecks.

4. **Google Maps Upcoming Events List** - **Priority: Medium**
   - Display a list of upcoming events based on the user's location using Google Maps integration.
   - **Estimated Timeline**: 4-5 days.
   - **Risks**: API limits and ensuring proper handling of geolocation permissions.

5. **Shopping List with Scheduling** - **Priority: High**
   - Create a grid-based shopping list similar to the chores system, with user-settable schedules based on average consumption.
   - **Estimated Timeline**: 4-5 days.
   - **Risks**: Complexity in ensuring the scheduling logic works as expected and doesn't interfere with existing functionalities.

### Development Considerations
- These features require comprehensive testing, especially API-driven ones, to ensure reliability.
- Plan for performance optimization for features that involve external data fetching (RSS, APIs).

---

## Version 0.3.0 - Planned Release

### Overview
Version 0.3.0 will implement changes and improvements based on user feedback.

### Key Areas of Improvement
- Focus on UI/UX improvements and optimization.
- Refactor or enhance features that receive user feedback during testing.

### Development Considerations
- Plan feedback-gathering mechanisms (surveys, analytics, etc.).
- Allocate time for bug fixes or refactoring based on user-reported issues.

---

## Version 1.0.0 - Planned Release

### Overview
Version 1.0.0 will introduce user login functionality and establish the application as a DAK board replacement with fully customizable widgets.
