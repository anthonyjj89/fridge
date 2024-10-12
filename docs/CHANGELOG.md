# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.5] - 2023-05-14

### Added
- Debug mode toggle for easier development and troubleshooting.
- Widget names displayed in debug mode for clearer identification.

### Changed
- Improved widget cycling behavior:
  - Auto-cycle every 5 seconds by default.
  - Manual cycling now introduces a 120-second delay before resuming auto-cycling.
  - Each widget's cycling behavior is now independent of others.

### Fixed
- Resolved issues with widget outlines appearing outside of debug mode.
- Fixed inconsistent timer behavior when manually cycling widgets.
