# Update Notes for @grkndev/snowflakeid

This document contains a list of changes, improvements, and bug fixes for each version of the library.

## Version 1.1.0 (March 2025)

### Major Changes
- Added proper dual module support for both ES Modules and CommonJS
- Updated build system to generate both module formats

### Improvements
- Fixed sequence handling in `generateSnowflakeId` function to correctly preserve custom sequence values
- Updated the `uuid` function to use `substring()` instead of the deprecated `substr()` method
- Added default export for CommonJS compatibility
- Improved TypeScript configuration with separate configs for ESM and CommonJS outputs

### Bug Fixes
- Fixed an issue where custom sequence values weren't being preserved correctly
- Fixed test suite to account for sequence increment behavior

## Version 1.0.7 (Previous version)

Initial public release
- Basic Snowflake ID generation functionality
- Support for parsing Snowflake IDs
- Additional utility functions: randomId and uuid 