# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-10-26

### Added
- **Complete implementation** of branch cleanup functionality
- **Auto-delete merged branches** when pull requests are merged
- **Stale branch cleanup** for branches with no recent activity
- **Protected branches** configuration with comma-separated list
- **Wildcard support** for protected branch patterns (e.g., `release/*`)
- **Dry-run mode** for testing without actually deleting branches
- **Configurable stale threshold** (default: 90 days)
- **Detailed logging** for all operations
- **Fork detection** - skips branches from forked repositories
- **Error handling** for edge cases (already deleted branches, etc.)
- Comprehensive documentation in README.md
- Example workflow files for common use cases
- CONTRIBUTING.md with development guidelines

### Changed
- Updated action.yml with all configuration inputs
- Enhanced README with detailed usage examples
- Improved branding icon to 'trash-2' for better representation

### Fixed
- Missing implementation in src/index.js
- Missing dist/index.js build output
- Incomplete documentation

## [0.1.0] - Initial Release

### Added
- Basic project structure
- Placeholder implementation
- Initial README
- MIT License

