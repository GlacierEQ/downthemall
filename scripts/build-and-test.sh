#!/bin/bash

# DownThemAll! Build and Test Script
# Validates the extension is ready for store publishing

set -e  # Exit on any error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo "🚀 DownThemAll! Build and Test Script"
echo "====================================="

# Check environment
print_status "Checking build environment..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+."
    exit 1
fi

if ! command -v yarn &> /dev/null; then
    print_error "Yarn is not installed. Please install Yarn package manager."
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
print_success "Node.js version: $NODE_VERSION"

if [[ "$NODE_VERSION" < "18.0.0" ]]; then
    print_error "Node.js version $NODE_VERSION is too old. Please upgrade to 18.0.0+"
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
if yarn install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Generate required regex patterns
print_status "Generating regex patterns..."
if yarn build:regexps; then
    print_success "Regex patterns generated"
else
    print_error "Failed to generate regex patterns"
    exit 1
fi

# Type checking
print_status "Running TypeScript type check..."
if yarn type-check; then
    print_success "Type checking passed"
else
    print_error "Type checking failed. Please fix TypeScript errors."
    exit 1
fi

# Linting
print_status "Running linter..."
if yarn lint:check; then
    print_success "Linting passed"
else
    print_warning "Linting issues found. Run 'yarn lint' to auto-fix."
    if yarn lint; then
        print_success "Auto-fixed linting issues"
    else
        print_warning "Some linting issues require manual fixes"
    fi
fi

# Testing
print_status "Running test suite..."
if yarn test; then
    print_success "All tests passed"
else
    print_error "Some tests failed. Please fix failing tests before publishing."
    exit 1
fi

# Build extension
print_status "Building extension for production..."
if yarn build:bundles; then
    print_success "Extension built successfully"
else
    print_error "Build failed. Check the errors above."
    exit 1
fi

# Verify manifest files
print_status "Verifying manifest files..."
if [ -f "manifest.json" ]; then
    MV2_VERSION=$(grep '"version"' manifest.json | cut -d'"' -f4)
    print_success "Manifest V2 found - version: $MV2_VERSION"
else
    print_error "manifest.json not found"
    exit 1
fi

if [ -f "manifest-v3.json" ]; then
    MV3_VERSION=$(grep '"version"' manifest-v3.json | cut -d'"' -f4)
    print_success "Manifest V3 found - version: $MV3_VERSION"
    
    if [ "$MV2_VERSION" != "$MV3_VERSION" ]; then
        print_warning "Version mismatch between manifests: V2=$MV2_VERSION, V3=$MV3_VERSION"
    fi
else
    print_warning "manifest-v3.json not found. Chrome Web Store prefers Manifest V3."
fi

# Check for required files
print_status "Verifying required files..."

REQUIRED_FILES=("bundles/background.js" "bundles/common.js" "windows/popup.html" "windows/prefs.html")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    print_success "All required files present"
else
    print_error "Missing required files:"
    for file in "${MISSING_FILES[@]}"; do
        echo "  - $file"
    done
    exit 1
fi

# Check icon files
print_status "Checking icon files..."
ICON_SIZES=(16 32 48 64 128 256)
for size in "${ICON_SIZES[@]}"; do
    if [ -f "style/icon$size.png" ]; then
        print_success "Icon $size x $size found"
    else
        print_warning "Icon style/icon$size.png missing"
    fi
done

# Final validation
echo ""
print_success "🏆 Build Validation Complete!"
echo ""
print_status "Summary:"
echo "  ✓ Dependencies installed and updated"
echo "  ✓ TypeScript compilation successful"
echo "  ✓ All tests passing"
echo "  ✓ Extension built and ready"
echo "  ✓ Manifest files validated"
echo ""
print_status "📦 Ready for packaging! Run:"
echo "  ./scripts/package-for-stores.sh"
echo ""
print_status "Or package manually:"
echo "  yarn package:chrome   # For Chrome Web Store"
echo "  yarn package:firefox  # For Firefox Add-ons"
echo ""
print_success "Extension is ready for store submission! 🎉"
