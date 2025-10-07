![DownThemAll!](https://raw.githubusercontent.com/downthemall/downthemall/master/style/icon128.png)

# DownThemAll! WE

[![CI/CD Pipeline](https://github.com/GlacierEQ/downthemall/actions/workflows/ci.yml/badge.svg)](https://github.com/GlacierEQ/downthemall/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

The DownThemAll! WebExtension - A modernized and stabilized fork ready for extension store publishing.

For those still on supported browser: [Non-WebExtension legacy code](https://github.com/downthemall/downthemall-legacy).

## 🎆 Extension Store Publishing

**Ready for Upload!** This extension has been prepared for publishing to major browser stores:

### Quick Publishing

```bash
# Automated packaging for both stores
chmod +x scripts/package-for-stores.sh
./scripts/package-for-stores.sh
```

This creates store-ready packages:
- **Chrome Web Store**: `downthemall-chrome-v4.13.1.zip` (Manifest V3)
- **Firefox Add-ons**: `downthemall-firefox-v4.13.1.zip` (Manifest V2)

### Store Links
- **Chrome Web Store**: [Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
- **Firefox Add-ons**: [Developer Hub](https://addons.mozilla.org/developers/)

📚 **Detailed Instructions**: See [PUBLISHING_GUIDE.md](PUBLISHING_GUIDE.md) for complete submission process.

### For Users
Once published, users can install from:
- Chrome Web Store (search "DownThemAll")
- Firefox Add-ons (search "DownThemAll")
- Manual installation (see publishing guide)

## About

This is the WebExtension version of DownThemAll!, a complete re-development from scratch.
Being a WebExtension it lacks a ton of features the original DownThemAll! had. Sorry, but there is no way around it since Mozilla decided to adopt WebExtensions as the *only* extension type and WebExtensions are extremely limited in what they can do.

For what is planned (and not planned because impossible to do in WebExtensions), see [TODO.md](TODO.md).

What this furthermore means is that some bugs we fixed in the original DownThemAll! are back, as we cannot do our own downloads any longer but have to go through the browser download manager always, which is notoriously bad at handling certain "quirks" real web servers in the wild show. It doesn't even handle regular 404 errors.

I spent countless hours evaluating various workarounds to enable us to do our own downloads instead of relying on the downloads API (the browser built-in downloader). From using `IndexedDB` to store retrieved chunks via `XHR`, to doing nasty service-worker tricks to fake a download that the backend would retrieve with `XHR`. The last one looks promising but I have yet to get it to work in a manner that is reliable, performs well enough and doesn't eat all the system memory for breakfast. Maybe in the future...

What this also means is that we have to write our user interface in HTML, which never looks "native" and cannot offer deep OS integration.

But it is what it is...

**What we *can* do and did do is bring the mass selection, organizing (renaming masks, etc) and queueing tools of DownThemAll! over to the WebExtension, so you can easily queue up hundreds or thousands files at once without the downloads going up in flames because the browser tried to download them all at once.**

## Modernization Updates

🚀 **This fork has been comprehensively modernized** with:

- **TypeScript 5.6**: Latest language features and strict type checking
- **ESLint 9**: Modern flat configuration with enhanced rules
- **Node.js 18+**: Updated runtime requirements and dependencies
- **GitHub Actions**: Automated CI/CD pipeline with testing and building
- **Enhanced Build System**: Improved webpack configuration and scripts
- **Test Coverage**: Comprehensive testing with coverage reporting
- **Security Auditing**: Automated vulnerability scanning
- **Store Publishing**: Ready for Chrome Web Store and Firefox Add-ons

See [UPGRADE_GUIDE.md](UPGRADE_GUIDE.md) for detailed migration information.

## Translations

If you would like to help out translating DTA, please see our [translation guide](_locales/Readme.md).

## Development

### Requirements

- [Node.js](https://nodejs.org/en/) **18.0.0 or higher**
- [Yarn](https://yarnpkg.com/) (recommended package manager)
- [Python 3.9+](https://www.python.org/) (for building release packages)
- [web-ext](https://www.npmjs.com/package/web-ext) (optional, for Firefox development)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/GlacierEQ/downthemall.git
cd downthemall

# Install dependencies
yarn install

# Start development (builds + watches + runs in Firefox)
yarn dev
```

### Development Scripts

```bash
# Development workflow
yarn dev                 # Concurrent build watching + Firefox extension running
yarn watch              # Watch mode for TypeScript compilation
yarn webext             # Run extension in Firefox development profile

# Building
yarn build:dev          # Development build with source maps
yarn build:bundles      # Production build
yarn build              # Full release build (requires Python)
yarn build:cleanup      # Clean all build artifacts

# Store packaging
yarn package:chrome     # Package for Chrome Web Store
yarn package:firefox    # Package for Firefox Add-ons

# Code quality
yarn lint               # Run ESLint with auto-fix
yarn lint:check         # Run ESLint without auto-fix  
yarn type-check         # TypeScript type checking
yarn test               # Run test suite
yarn test:coverage      # Run tests with coverage report

# Utilities
yarn build:regexps      # Generate regex patterns
yarn stats              # Show code statistics
```

### Setup Details

1. **Install dependencies**: Run `yarn install` to set up the development environment with webpack, TypeScript compiler, and testing framework.

2. **Generate required files**: The build process requires regex patterns to be generated first:
   ```bash
   yarn build:regexps
   ```

3. **Start development**: Use `yarn dev` to run both the webpack watcher and Firefox extension simultaneously, or run them separately:
   ```bash
   yarn watch    # Terminal 1: TypeScript compilation
   yarn webext   # Terminal 2: Firefox extension
   ```

### Running in Firefox

The easiest way is using the combined development command:
```bash
yarn dev
```

This will:
- Start webpack in watch mode
- Launch Firefox with the extension loaded
- Create a development profile at `../dtalite.p`
- Auto-reload the extension when files change

Alternatively, build and install manually:
```bash
yarn build:bundles
# Then load the extension directory in Firefox Developer Edition
```

### Running in Chrome/Chromium

1. Build the extension:
   ```bash
   yarn build:bundles
   ```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the repository directory

### Building Release Packages

To create release packages for distribution:

```bash
# Quick store packaging (recommended)
./scripts/package-for-stores.sh

# Manual builds
yarn build

# Advanced release builds (requires Python 3.9+)
python3 util/build.py --mode=release
```

Output files will be in `web-ext-artifacts/`:
- `*-chrome-*.zip` - Chrome Web Store ready packages
- `*-firefox-*.zip` - Firefox Add-ons ready packages
- `*-fx.zip` - Firefox builds (legacy naming)
- `*-crx.zip` - Chrome/Chromium builds (legacy naming)
- `*-opr.zip` - Opera builds

### Testing

The project includes a comprehensive test suite:

```bash
yarn test              # Run all tests
yarn test:coverage     # Run with coverage report
```

Tests are written in TypeScript using Mocha and Chai. Coverage reports are generated using nyc.

### Code Quality

The project enforces high code quality standards:

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Modern flat configuration with TypeScript support
- **Automated CI**: GitHub Actions run tests on every push/PR
- **Coverage**: Test coverage tracking and reporting

### Contributing

Before submitting patches:

1. **Code Quality**: Run `yarn lint` and fix any issues
2. **Type Safety**: Run `yarn type-check` to verify TypeScript compilation
3. **Tests**: Run `yarn test` to ensure all tests pass
4. **Build**: Verify `yarn build:bundles` completes successfully

Code contributions should:
- Favor TypeScript over JavaScript
- Include appropriate tests
- Follow the existing code style (enforced by ESLint)
- Keep external dependencies to a minimum

Submit patches as Pull Requests, rebased onto the current `master` branch.

### AMO Editors Quick Guide

1. Install requirements (Node.js 18+, Python 3.9+)
2. Run: `yarn && python3 util/build.py --mode=release`  
3. Review: `web-ext-artifacts/dta-*-fx.zip`

### Code Structure

The codebase spans over 11K lines of TypeScript:

- `uikit/` - User Interface Kit
  - `VirtualTable` - Interactive HTML tables with column management
  - `ContextMenu` - HTML-based context menu system
- `lib/` - Backend functionality and shared utilities
- `windows/` - Frontend HTML pages and interactive components  
- `style/` - CSS stylesheets and images
- `tests/` - Test suite and utilities
- `util/` - Build scripts and development tools

## CI/CD Pipeline

This repository includes automated workflows:

- **Continuous Integration**: Automated testing on Node.js 18, 20, and 22
- **Code Quality**: ESLint and TypeScript checks on every commit
- **Security**: Automated dependency vulnerability scanning
- **Build Verification**: Extension packages built and tested
- **Coverage**: Test coverage reporting and tracking

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.

## Links

- **Original Project**: [downthemall/downthemall](https://github.com/downthemall/downthemall)
- **Website**: [downthemall.org](https://downthemall.org/)
- **Legacy Extension**: [downthemall-legacy](https://github.com/downthemall/downthemall-legacy)
- **Publishing Guide**: [PUBLISHING_GUIDE.md](PUBLISHING_GUIDE.md)
- **Chrome Web Store**: [Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
- **Firefox Add-ons**: [Developer Hub](https://addons.mozilla.org/developers/)