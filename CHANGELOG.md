# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-14

### Added
- UTF-8 charset meta tags to HTML files for proper Unicode character display
- Custom Unicode icon system replacing ionicons dependency

### Changed
- **BREAKING**: Upgraded Chrome extension manifest from v2 to v3
- **BREAKING**: Updated all npm dependencies to latest modern versions
- **BREAKING**: Migrated from bower to npm for all frontend dependencies
- Replaced deprecated `chrome.tabs.getSelected` with `chrome.tabs.query` API
- Updated build system from async-based to modern synchronous approach
- Modernized service worker background script for manifest v3 compatibility
- Updated `chrome.pageAction` to `chrome.action` API for manifest v3
- Renamed `ionicons.css` to `icons.css` to reflect Unicode-based implementation
- Fixed Chrome extension icon loading with correct relative paths for service workers

### Removed
- **BREAKING**: Completely removed Google Analytics tracking (never used)
- **BREAKING**: Removed bower dependency management system
- Removed ionicons npm dependency
- Removed `asyncTracking.js` file and all analytics references

### Fixed
- Extension icon loading errors in manifest v3 service worker context
- Add bookmark popup URL detection for current active tab
- Unicode character encoding issues causing garbled icon display
- Build system compatibility with modern npm package versions

### Technical Details
- Updated Angular to 1.8.3, jQuery to 3.7.1, jQuery UI to 1.14.1
- Migrated to npm packages: angular-bootstrap-colorpicker, normalize.css
- Build system now uses glob 11.0.0 with synchronous file operations
- Service worker uses relative asset paths compatible with manifest v3
- Extension maintains full backward compatibility with existing bookmarks and settings

### Development
- Updated `package.json` and `manifest.json` to version 1.0.0
- Modernized build process while preserving original functionality
- Enhanced CLAUDE.md documentation with modernization status