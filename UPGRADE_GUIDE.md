# DownThemAll! Upgrade Guide

This guide documents the comprehensive modernization and stabilization changes made to the DownThemAll! WebExtension repository.

## Overview of Changes

The repository has been significantly modernized with updated dependencies, improved tooling, and enhanced development workflows.

## Major Updates

### Dependencies Modernization

| Package | Old Version | New Version | Breaking Changes |
|---------|-------------|-------------|------------------|
| TypeScript | `^3.6.3` | `^5.6.2` | Yes - see TypeScript section |
| ESLint | `^6.5.1` | `^9.11.1` | Yes - new flat config |
| @types/node | `^12.7.8` | `^22.5.0` | Minor API changes |
| Webpack | `^5.81.0` | `^5.95.0` | No |
| Mocha | `^6.2.1` | `^10.7.3` | Minor test syntax changes |
| Chai | `^4.1.2` | `^5.1.1` | Minor assertion changes |
| webextension-polyfill | `^0.10.0` | `^0.12.0` | No |

### New Development Tools

- **Test Coverage**: Added `nyc` for code coverage reporting
- **Concurrent Development**: Added `concurrently` for running multiple dev processes
- **Modern TypeScript**: Full TypeScript 5.x support with strict mode
- **GitHub Actions**: Complete CI/CD pipeline

## Migration Steps

### 1. Update Your Development Environment

```bash
# Ensure you have Node.js 18+ installed
node --version  # Should be 18.0.0 or higher

# Clear old dependencies
rm -rf node_modules yarn.lock

# Install updated dependencies
yarn install
```

### 2. TypeScript Configuration Changes

The TypeScript configuration has been significantly updated:

- **Target**: Updated to `ES2022`
- **Strict Mode**: All strict checks are now enabled
- **Module System**: Improved module resolution
- **New Compiler Options**: Added modern TypeScript 5.x features

#### Breaking Changes in TypeScript

1. **Stricter Type Checking**: Code must now handle all `null` and `undefined` cases
2. **No Implicit Any**: All variables must have explicit or inferred types
3. **Unused Parameters**: Must be prefixed with `_` or removed
4. **Function Return Types**: More inference, but explicit types may be needed

### 3. ESLint Configuration Migration

ESLint has been updated to v9 with the new flat configuration format:

- **Old**: `.eslintrc.js` (deprecated)
- **New**: `eslint.config.js` (flat config)

#### Key Changes

- Flat config format with explicit rule definitions
- Updated TypeScript ESLint parser and plugin
- Improved WebExtension-specific rules
- Better integration with modern JavaScript features

### 4. New npm Scripts

Several new scripts have been added to improve the development workflow:

```bash
# Development
yarn dev                 # Run watch + webext concurrently
yarn build:dev          # Development build
yarn build:cleanup      # Clean build artifacts

# Quality Assurance
yarn lint               # Run ESLint with auto-fix
yarn lint:check         # Run ESLint without auto-fix
yarn type-check         # TypeScript type checking only
yarn test:coverage      # Run tests with coverage report

# WebExtension
yarn webext:build       # Build extension package
```

## CI/CD Pipeline

A comprehensive GitHub Actions workflow has been added:

### Workflow Jobs

1. **Lint & Type Check**: ESLint and TypeScript validation
2. **Test Suite**: Multi-Node.js version testing (18, 20, 22)
3. **Build**: Development and production builds
4. **Security Audit**: Dependency vulnerability scanning

### Artifacts

- Extension packages (Firefox, Chrome, Opera)
- Build bundles for debugging
- Test coverage reports

## Troubleshooting

### Common Migration Issues

#### TypeScript Errors

**Problem**: `error TS2322: Type 'null' is not assignable to type 'string'`

**Solution**: Handle null cases explicitly:
```typescript
// Before
const value: string = getValue();

// After
const value: string = getValue() || "";
// or
const value: string | null = getValue();
```

#### ESLint Configuration Issues

**Problem**: `Error: Failed to load config "@typescript-eslint" to extend from.`

**Solution**: Remove old `.eslintrc.js` if it exists and ensure `eslint.config.js` is being used.

#### Build Failures

**Problem**: `Module not found` errors during webpack build

**Solution**: 
1. Clear node_modules and reinstall
2. Run `yarn build:regexps` first
3. Check TypeScript compilation with `yarn type-check`

### Development Environment Issues

#### Node.js Version

Ensure you're using Node.js 18+ for compatibility with modern dependencies.

#### Yarn vs npm

The project uses Yarn for dependency management. Using npm may cause lock file conflicts.

## Performance Improvements

### Build Performance

- **Webpack 5**: Improved bundling and tree-shaking
- **TypeScript 5**: Faster compilation and better incremental builds
- **Concurrent Processes**: `yarn dev` runs multiple processes simultaneously

### Development Experience

- **Better Error Messages**: TypeScript 5 provides more helpful error diagnostics
- **Faster Linting**: ESLint v9 with flat config is more efficient
- **Test Coverage**: Detailed coverage reports help identify untested code

## Breaking Changes Summary

### For Contributors

1. **Node.js Requirement**: Minimum Node.js 18.0.0
2. **TypeScript**: Strict null checks and stricter typing
3. **ESLint**: New flat configuration format
4. **Test Framework**: Updated Mocha and Chai APIs

### For Extension Users

- No breaking changes for end users
- Extension functionality remains the same
- Performance improvements may be noticeable

## Next Steps

### Immediate Actions

1. **Update Development Environment**: Follow migration steps above
2. **Run Tests**: Ensure all tests pass with `yarn test`
3. **Build Verification**: Confirm builds work with `yarn build:bundles`
4. **Code Quality**: Address any new linting errors

### Future Improvements

1. **Remove `any` Types**: Gradually replace remaining `any` types with proper types
2. **Expand Test Coverage**: Add tests for uncovered code paths
3. **Performance Optimization**: Implement vtable column width caching
4. **Feature Development**: Focus on P2 priority items from TODO.md

## Support

If you encounter issues during the upgrade process:

1. Check this troubleshooting guide first
2. Ensure your development environment meets the new requirements
3. Clear `node_modules` and reinstall dependencies
4. Run the new diagnostic commands (`yarn type-check`, `yarn lint:check`)

The modernization provides a solid foundation for continued development with improved reliability, performance, and maintainability.
