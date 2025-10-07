# Extension Publishing Guide

## Overview

This guide covers how to publish the DownThemAll! WebExtension to various browser stores, including Chrome Web Store and Firefox Add-ons.

## Prerequisites

### Development Environment
- Node.js 18.0.0 or higher
- Yarn package manager
- Python 3.9+ (for release builds)

### Build Requirements
1. **Fix Dependencies** (COMPLETED ✓)
   - Removed non-existent `@types/whatwg-mimetype` 
   - Removed redundant `@types/psl`
   - Updated version to match manifest

2. **Install Dependencies**
   ```bash
   yarn install
   ```

3. **Build Extension**
   ```bash
   yarn build:regexps
   yarn build:bundles
   ```

## Chrome Web Store Publishing

### 1. Manifest Version Considerations

**Current Status**: The extension uses Manifest V2, but Chrome is deprecating MV2:
- **June 2025**: Final deadline for enterprises
- **Now**: New extensions should use Manifest V3

**Recommendation**: Use the provided `manifest-v3.json` for Chrome Web Store submission.

### 2. Prepare Chrome Package

```bash
# Option A: Use Manifest V3 (Recommended for new submissions)
cp manifest-v3.json manifest.json
yarn package:chrome

# Option B: Keep Manifest V2 (Works until June 2025)
yarn package:chrome
```

### 3. Chrome Web Store Submission Process

1. **Create Developer Account**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Pay $5 one-time registration fee
   - Choose account type (Individual/Trader)

2. **Upload Extension**
   - Click "Add a New Item"
   - Upload the `.zip` file from `web-ext-artifacts/`
   - Ensure `manifest.json` is at root level

3. **Fill Metadata**
   - **Name**: DownThemAll!
   - **Description**: Use existing description from manifest
   - **Category**: Productivity
   - **Screenshots**: Required (1280x800 or 640x400)
   - **Icons**: All sizes provided in `style/` folder
   - **Privacy Policy**: Required if handling user data

4. **Review Process**
   - Google reviews all extensions
   - Typical review time: 1-3 days for updates, 1-7 days for new extensions
   - Extensions with minimal permissions may get expedited review

### 4. Chrome Web Store Compliance Tips

- **Permissions**: Only request minimum required permissions
- **Code Quality**: Include comments for reviewers
- **Screenshots**: Show actual functionality
- **Description**: Clear, accurate description of features
- **Privacy**: Be transparent about data usage

## Firefox Add-ons Publishing

### 1. Prepare Firefox Package

```bash
# Firefox uses Manifest V2 (no need to change)
yarn package:firefox
```

### 2. Firefox Add-ons Submission

1. **Create Developer Account**
   - Go to [Firefox Add-ons Developer Hub](https://addons.mozilla.org/developers/)
   - Free account creation

2. **Upload Extension**
   - Submit the `.zip` file from `web-ext-artifacts/`
   - Choose distribution method:
     - **On this site**: Listed on AMO (recommended)
     - **Self-distributed**: Signed but not listed

3. **Review Process**
   - **Automatic review**: Most extensions get approved automatically
   - **Manual review**: Required for sensitive permissions
   - **Review time**: Minutes to hours for automatic, 1-14 days for manual

## Build Commands Reference

```bash
# Development
yarn dev                    # Watch mode + Firefox testing
yarn watch                  # TypeScript watch mode
yarn webext                 # Run in Firefox

# Building
yarn build:regexps          # Generate regex patterns (required)
yarn build:bundles          # Production build
yarn build:dev              # Development build
yarn build                  # Full release build (Python required)

# Packaging
yarn package:chrome         # Build + package for Chrome
yarn package:firefox        # Build + package for Firefox
yarn webext:build           # Generic web-ext build

# Quality Assurance
yarn lint                   # ESLint with fixes
yarn lint:check             # ESLint without fixes
yarn type-check             # TypeScript type checking
yarn test                   # Run test suite
yarn test:coverage          # Tests with coverage
```

## File Structure for Upload

Your packaged extension should contain:

```
├── manifest.json          # Extension manifest
├── bundles/
│   ├── common.js           # Shared code
│   └── background.js       # Background script
├── style/
│   ├── icon16.png          # Icons (all sizes)
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon64.png
│   ├── icon128.png
│   └── icon256.png
├── windows/
│   ├── popup.html          # Extension popup
│   └── prefs.html          # Preferences page
├── _locales/               # Internationalization
└── data/                   # Extension data
```

## Store-Specific Considerations

### Chrome Web Store

✅ **Advantages**:
- Large user base
- Good discovery
- Automatic updates

⚠️ **Challenges**:
- Stricter review process
- MV2 deprecation pressure
- $5 developer fee

**Required Assets**:
- Screenshots (1280x800 minimum)
- Detailed description
- Privacy policy (if applicable)
- Icons in multiple sizes

### Firefox Add-ons

✅ **Advantages**:
- Free developer account
- Usually automatic approval
- Supports MV2 longer-term

⚠️ **Considerations**:
- Smaller user base
- Manual review for complex extensions

**Required Assets**:
- Screenshots (optional but recommended)
- Description
- Icons (48x48, 96x96 minimum)

## Troubleshooting Common Issues

### Build Failures

1. **Dependency Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules yarn.lock
   yarn install
   ```

2. **TypeScript Errors**
   ```bash
   yarn type-check
   # Fix reported type issues
   ```

3. **Linting Errors**
   ```bash
   yarn lint:check
   yarn lint  # Auto-fix where possible
   ```

### Store Rejections

1. **Chrome Web Store**
   - Review permissions carefully
   - Ensure all code is included (no remote loading)
   - Test thoroughly before submission
   - Include detailed description of functionality

2. **Firefox Add-ons**
   - Check for policy violations
   - Ensure manifest is valid
   - Test on latest Firefox version

## Publishing Checklist

### Pre-Submission
- [ ] Dependencies installed and building successfully
- [ ] All tests passing (`yarn test`)
- [ ] No linting errors (`yarn lint:check`)
- [ ] TypeScript compilation successful (`yarn type-check`)
- [ ] Extension tested in target browser
- [ ] Version number updated in manifest and package.json
- [ ] Screenshots prepared (multiple browsers if applicable)
- [ ] Description and metadata reviewed

### Chrome Web Store
- [ ] Developer account created and verified
- [ ] Manifest V3 version prepared (if submitting new extension)
- [ ] Privacy policy created (if handling user data)
- [ ] Screenshots meet size requirements (1280x800)
- [ ] Package built and tested: `yarn package:chrome`
- [ ] All permissions justified in description

### Firefox Add-ons
- [ ] Mozilla developer account created
- [ ] Extension package built: `yarn package:firefox`
- [ ] Source code prepared (if using minification/compilation)
- [ ] Distribution method chosen (AMO vs self-hosted)

### Post-Submission
- [ ] Monitor review status
- [ ] Respond to reviewer feedback promptly
- [ ] Test published extension after approval
- [ ] Update documentation with store links
- [ ] Plan for future updates and maintenance

## Advanced: Enterprise/Side-loading

For users who want to install without going through stores:

1. **Chrome**: Load unpacked in Developer Mode
2. **Firefox**: about:debugging > Load Temporary Add-on
3. **Enterprise**: Use group policy for deployment

See the main README for detailed development instructions.

## Support

If you encounter issues during publishing:

1. Check the [GitHub Issues](https://github.com/GlacierEQ/downthemall/issues)
2. Review store-specific documentation
3. Contact store support if needed
4. Consider community forums for troubleshooting

---

**Next Steps**: Follow this guide to publish your extension to the Chrome Web Store and Firefox Add-ons. The build process has been fixed and is ready for packaging!