# DownThemAll! WebExtension 🚀

[![CI Status](https://github.com/glaciereq/downthemall/actions/workflows/ci.yml/badge.svg)](https://github.com/glaciereq/downthemall/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

![DownThemAll!](https://raw.githubusercontent.com/downthemall/downthemall/master/style/icon128.png)

**The ultimate mass downloader WebExtension with advanced queuing and organization capabilities.**

## ✨ About

This is the modernized WebExtension version of DownThemAll!, completely re-engineered from the ground up with TypeScript, modern tooling, and enterprise-grade CI/CD practices. While WebExtensions impose certain limitations compared to the original addon, we've maximized the available capabilities to deliver the best possible mass downloading experience.

### 🎆 What We Can Do (And Do Well!)

- **Mass Selection & Organization**: Easily queue hundreds or thousands of files with advanced filtering
- **Intelligent Renaming**: Powerful masking system for automated file organization  
- **Queue Management**: Sophisticated download scheduling prevents browser overwhelm
- **Multi-Browser Support**: Works seamlessly across Firefox, Chrome, Edge, and Opera
- **Performance Monitoring**: Built-in analytics and performance tracking
- **Enterprise Security**: Automated security scanning and dependency auditing

### ⚠️ WebExtension Limitations

Due to browser API restrictions, some features from the legacy version cannot be implemented:
- Segmented downloads (multi-part downloading)
- Custom download conflict resolution
- Speed limiting controls
- Content sniffing and request manipulation
- File integrity verification (checksums)
- Mirror support and metalink handling

For detailed technical limitations, see [TODO.md](TODO.md).

## 🛠️ Development Setup

### Prerequisites

- **Node.js**: >= 20.0.0
- **npm**: >= 10.0.0  
- **Python**: >= 3.11 (for build scripts)
- **Git**: Latest version

### Quick Start

```bash
# Clone and setup
git clone https://github.com/glaciereq/downthemall.git
cd downthemall
npm install

# Development workflow
npm run dev          # Start development with hot reload
npm run lint         # Auto-fix code formatting
npm run test         # Run comprehensive test suite
npm run typecheck    # Validate TypeScript
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Production build with optimizations |
| `npm run build:dev` | Development build with source maps |
| `npm run dev` | Concurrent watch + webext development |
| `npm run lint` | ESLint + Prettier auto-fix |
| `npm run test` | Complete test suite with coverage |
| `npm run security` | Security audit and vulnerability scan |
| `npm run update-deps` | Update and audit dependencies |

## 📊 Project Structure

```
downthemall/
├── lib/           # Core backend logic and utilities
├── uikit/         # UI components (VirtualTable, ContextMenu)
├── windows/       # Frontend HTML and interactive logic  
├── style/         # CSS styling and images
├── _locales/      # Internationalization files
├── tests/         # Comprehensive test suite
├── util/          # Build tools and utilities
└── .github/       # CI/CD workflows and templates
```

## 🚀 Browser Development

### Firefox Development

```bash
# Install web-ext globally (recommended)
npm install -g web-ext

# Start development environment
npm run webext
```

This creates a development profile at `../dtalite.p` with auto-reload on changes.

### Chrome/Edge Development

1. Build the extension: `npm run build:dev`
2. Open Chrome Extensions page
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project directory

## 🏁 Building Releases

### Development Builds
```bash
npm run build:dev    # Development build with debugging
```

### Production Releases
```bash
npm run build        # Optimized production build
```

Artifacts are generated in `web-ext-artifacts/`:
- `*-fx.zip`: Firefox extension
- `*-crx.zip`: Chrome/Edge extension  
- `*-opr.zip`: Opera extension

## 🧑‍💻 Contributing

### Code Quality Standards

- **TypeScript First**: Prefer TypeScript over JavaScript
- **Strict Linting**: ESLint + Prettier enforced via pre-commit hooks
- **Comprehensive Testing**: Maintain test coverage above 80%
- **Security Focus**: All dependencies audited and vulnerabilities addressed
- **Performance Monitoring**: Bundle size and performance tracking

### Contribution Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper TypeScript typing
4. Ensure all tests pass: `npm test`
5. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
6. Push and create a Pull Request

### Pre-commit Hooks

Husky automatically runs on every commit:
- Code formatting (Prettier)
- Linting (ESLint)
- Type checking (TypeScript)
- Test suite (if TypeScript files changed)

## 🔍 Architecture Highlights

### Modern TypeScript Stack
- **TypeScript 5.6+**: Latest language features with strict type checking
- **ES2022 Target**: Modern JavaScript for optimal performance
- **Module System**: ESNext modules with tree-shaking optimization

### Build System
- **Webpack 5**: Advanced bundling with code splitting
- **Python Build Scripts**: Cross-platform release automation
- **Multi-target Output**: Optimized builds for each browser

### Quality Assurance
- **GitHub Actions CI/CD**: Automated testing and deployment
- **Security Scanning**: Automated vulnerability detection
- **Performance Monitoring**: Bundle analysis and optimization
- **Code Coverage**: Comprehensive test coverage reporting

## 🌐 Internationalization

We support 40+ languages! To contribute translations:

1. Check existing translations in `_locales/`
2. Follow our [translation guide](_locales/Readme.md)
3. Submit translations via Pull Request

## 📊 Statistics

- **11,000+ lines** of TypeScript/JavaScript
- **40+ supported languages**
- **Cross-browser compatibility** (Firefox, Chrome, Edge, Opera)
- **Enterprise-grade** CI/CD pipeline
- **Modern development** practices and tooling

## 📜 License

MIT License - see [LICENSE.md](LICENSE.md) for details.

## 🙏 Acknowledgments

- **Nils Maier**: Original DownThemAll! creator and lead developer
- **Community Contributors**: Translations, bug reports, and feature requests
- **WebExtension Ecosystem**: Browser vendors and extension platform maintainers

---

**Built with ❤️ by the DownThemAll! community**