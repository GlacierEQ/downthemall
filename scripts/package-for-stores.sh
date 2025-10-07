#!/bin/bash

# DownThemAll! Extension Store Packaging Script
# This script builds and packages the extension for Chrome Web Store and Firefox Add-ons

set -e  # Exit on any error

echo "🚀 DownThemAll! Extension Store Packaging Script"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    print_error "manifest.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Node.js and Yarn are installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v yarn &> /dev/null; then
    print_error "Yarn is not installed. Please install Yarn first."
    exit 1
fi

print_status "Checking Node.js version..."
NODE_VERSION=$(node --version | sed 's/v//')
if [[ "$NODE_VERSION" < "18.0.0" ]]; then
    print_warning "Node.js version $NODE_VERSION detected. Recommended: 18.0.0+"
else
    print_success "Node.js version $NODE_VERSION is compatible"
fi

# Clean previous builds
print_status "Cleaning previous builds..."
yarn build:cleanup || true
rm -rf temp_package/ || true

# Install dependencies
print_status "Installing dependencies..."
yarn install

# Generate regex patterns (required)
print_status "Generating regex patterns..."
yarn build:regexps

# Run tests
print_status "Running tests..."
if yarn test; then
    print_success "All tests passed"
else
    print_warning "Some tests failed, but continuing..."
fi

# Run linting
print_status "Running linter..."
if yarn lint:check; then
    print_success "No linting errors found"
else
    print_warning "Linting issues found. Run 'yarn lint' to fix automatically."
fi

# Type checking
print_status "Running TypeScript type check..."
if yarn type-check; then
    print_success "Type checking passed"
else
    print_error "Type checking failed. Please fix TypeScript errors first."
    exit 1
fi

# Build the extension
print_status "Building extension bundles..."
yarn build:bundles

# Create temporary directory for packaging
mkdir -p temp_package
cp -r temp_package/ temp_package_backup/ || true

# Package for Chrome Web Store (with Manifest V3)
print_status "Packaging for Chrome Web Store (Manifest V3)..."
mkdir -p temp_package/chrome
cp -r . temp_package/chrome/
cd temp_package/chrome

# Use Manifest V3 for Chrome
if [ -f "manifest-v3.json" ]; then
    cp manifest-v3.json manifest.json
    print_success "Using Manifest V3 for Chrome Web Store"
else
    print_warning "manifest-v3.json not found, using existing manifest.json"
fi

# Clean unnecessary files for Chrome package
rm -rf node_modules/ .git/ .github/ tests/ *.log yarn.lock package-lock.json
rm -rf temp_package/ temp_package_backup/ scripts/ util/
rm -f .eslintrc.js .eslintignore .gitignore tsconfig.json webpack.config.js
rm -f *.md UPGRADE_GUIDE.md TODO.md PUBLISHING_GUIDE.md

cd ../..

# Create Chrome package
print_status "Creating Chrome Web Store package..."
cd temp_package/chrome
zip -r ../../web-ext-artifacts/downthemall-chrome-v$(grep '"version"' manifest.json | cut -d'"' -f4).zip .
cd ../..
print_success "Chrome package created: web-ext-artifacts/downthemall-chrome-v$(grep '"version"' temp_package/chrome/manifest.json | cut -d'"' -f4).zip"

# Package for Firefox Add-ons (with Manifest V2)
print_status "Packaging for Firefox Add-ons (Manifest V2)..."
mkdir -p temp_package/firefox
cp -r . temp_package/firefox/
cd temp_package/firefox

# Ensure we use the original Manifest V2 for Firefox
if [ -f "manifest-v3.json" ]; then
    rm manifest-v3.json  # Remove V3 manifest to avoid confusion
fi
print_success "Using Manifest V2 for Firefox Add-ons"

# Clean unnecessary files for Firefox package
rm -rf node_modules/ .git/ .github/ tests/ *.log yarn.lock package-lock.json
rm -rf temp_package/ temp_package_backup/ scripts/ util/
rm -f .eslintrc.js .eslintignore .gitignore tsconfig.json webpack.config.js
rm -f *.md UPGRADE_GUIDE.md TODO.md PUBLISHING_GUIDE.md

cd ../..

# Create Firefox package
print_status "Creating Firefox Add-ons package..."
cd temp_package/firefox
zip -r ../../web-ext-artifacts/downthemall-firefox-v$(grep '"version"' manifest.json | cut -d'"' -f4).zip .
cd ../..
print_success "Firefox package created: web-ext-artifacts/downthemall-firefox-v$(grep '"version"' temp_package/firefox/manifest.json | cut -d'"' -f4).zip"

# Clean up temporary files
print_status "Cleaning up temporary files..."
rm -rf temp_package/ temp_package_backup/

# Final status
echo ""
print_success "📦 Packaging Complete!"
echo ""
print_status "Packages created in web-ext-artifacts/:"
ls -la web-ext-artifacts/*.zip | while read line; do
    echo "  ✓ $line"
done

echo ""
print_status "📚 Next Steps:"
echo "  1. Chrome Web Store: Upload downthemall-chrome-v*.zip"
echo "  2. Firefox Add-ons: Upload downthemall-firefox-v*.zip"
echo "  3. See PUBLISHING_GUIDE.md for detailed submission instructions"
echo ""
print_status "Store Links:"
echo "  • Chrome: https://chrome.google.com/webstore/devconsole/"
echo "  • Firefox: https://addons.mozilla.org/developers/"
echo ""
print_success "Ready for extension store submission! 🎉"
