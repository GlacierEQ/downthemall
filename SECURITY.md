# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 4.1.x   | ✅ Yes             |
| 4.0.x   | ✅ Yes             |
| < 4.0   | ❌ No              |

## Security Standards

### Automated Security Measures

- **Dependency Scanning**: Automated vulnerability scanning via GitHub Dependabot
- **Code Analysis**: Static analysis security testing (SAST) in CI/CD pipeline
- **Supply Chain Security**: Signed releases and verified dependencies
- **Regular Audits**: Weekly automated security audits via `npm audit`

### Browser Extension Security

- **Minimal Permissions**: Request only essential browser permissions
- **Content Security Policy**: Strict CSP headers to prevent XSS attacks
- **Secure Communication**: HTTPS-only connections for all external requests
- **Input Validation**: Comprehensive sanitization of user inputs and URLs
- **Sandboxed Execution**: Isolated execution contexts for untrusted content

## Reporting a Vulnerability

### Responsible Disclosure

We take security seriously and appreciate responsible disclosure of vulnerabilities. Please do not report security vulnerabilities through public GitHub issues.

### Security Contact

**Primary Contact**: [GLACIER.EQUILIBRIUM@GMAIL.COM](mailto:GLACIER.EQUILIBRIUM@GMAIL.COM)

### Reporting Process

1. **Email Security Report**
   - Send detailed vulnerability report to security contact
   - Include steps to reproduce the issue
   - Provide proof-of-concept if possible
   - Specify affected versions and browsers

2. **Acknowledgment**
   - We will acknowledge receipt within 24 hours
   - Initial assessment provided within 72 hours
   - Regular updates on investigation progress

3. **Investigation Timeline**
   - **Critical vulnerabilities**: Fix within 7 days
   - **High severity**: Fix within 14 days  
   - **Medium severity**: Fix within 30 days
   - **Low severity**: Fix within 90 days

4. **Coordinated Disclosure**
   - Security fixes released before public disclosure
   - Credit provided to security researchers (if desired)
   - Public security advisory published after fix

### What to Include in Reports

- **Vulnerability Type** (XSS, injection, privilege escalation, etc.)
- **Affected Components** (specific files, functions, or features)
- **Browser/Platform Details** (Firefox/Chrome version, OS)
- **Reproduction Steps** (detailed step-by-step instructions)
- **Impact Assessment** (potential consequences and exploit scenarios)
- **Suggested Mitigation** (if you have recommendations)

### Security Research Guidelines

#### Acceptable Research Activities
- Analysis of publicly released extension code
- Testing on your own browser installations
- Responsible testing that doesn't harm users
- Research using isolated test environments

#### Prohibited Activities
- Accessing other users' data without permission
- Denial-of-service attacks or resource exhaustion
- Social engineering of project maintainers or users
- Testing on production systems without authorization
- Public disclosure before coordinated release

### Security Researcher Recognition

We maintain a security researchers hall of fame for those who help improve our security:

- Public acknowledgment in security advisories
- Credit in release notes and documentation
- Optional listing in project contributors
- Coordinated disclosure timeline that respects your research

## Security Best Practices for Users

### Installation Security
- **Official Sources Only**: Install from official browser extension stores
- **Verify Publisher**: Confirm extensions are published by verified accounts
- **Review Permissions**: Understand what permissions you're granting
- **Regular Updates**: Keep extensions updated to latest versions

### Usage Security
- **HTTPS Websites**: Use DownThemAll! primarily on HTTPS sites
- **Trusted Sources**: Only download from reputable websites
- **Scan Downloads**: Use antivirus software on downloaded files
- **Monitor Activity**: Review download history and file locations

## Security Architecture

### Permission Model
We implement principle of least privilege:
- `downloads`: Core downloading functionality
- `storage`: Local preferences and queue persistence
- `contextMenus`: Right-click menu integration
- `activeTab`: Current page download detection only

### Data Protection
- **Local Storage Only**: No cloud storage or external data transmission
- **Encrypted Preferences**: Sensitive settings encrypted locally
- **Temporary Data Cleanup**: Automatic cleanup of temporary download data
- **No Telemetry**: No usage data collection or tracking

### Content Security
- **Input Sanitization**: All user inputs sanitized against injection attacks
- **URL Validation**: Comprehensive URL validation and filtering
- **File Type Restrictions**: Configurable file type filtering
- **Size Limits**: Configurable download size limits to prevent abuse

## Incident Response

In case of security incidents:

1. **Immediate Assessment**: Evaluate severity and impact scope
2. **User Notification**: Prompt notification via GitHub and extension stores
3. **Emergency Patches**: Expedited release process for critical fixes
4. **Post-Incident Review**: Analysis and documentation of lessons learned

## Compliance and Standards

- **OWASP Guidelines**: Follow OWASP secure coding practices
- **Browser Security Policies**: Comply with all browser extension security requirements
- **Data Protection**: Respect user privacy and data protection regulations
- **Open Source Security**: Transparent security practices through public code review

---

**Last Updated**: September 30, 2025
**Next Review**: December 30, 2025

For questions about this security policy, contact: [GLACIER.EQUILIBRIUM@GMAIL.COM](mailto:GLACIER.EQUILIBRIUM@GMAIL.COM)