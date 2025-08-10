# Contributing to DeSo Secure Messenger

## 🔒 Proprietary Software Notice

This is proprietary software owned by **Tommyk999**. All rights are reserved.

## 📋 Contribution Policy

### Who Can Contribute
- **Owner**: Tommyk999 has full access and modification rights
- **Invited Collaborators**: Only explicitly invited contributors may submit changes
- **External Contributors**: Must get explicit permission before contributing

### Before Contributing

1. **Get Permission**: Contact Tommyk999 for explicit permission to contribute
2. **Sign Agreement**: All contributors must sign a Contributor License Agreement (CLA)
3. **Security Clearance**: All contributions must pass security review

### How to Contribute

#### For Invited Collaborators:

1. **Fork Repository** (if external) or create **feature branch** (if internal)
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow Code Standards**
   - Use TypeScript for all new code
   - Follow existing code style and patterns
   - Add comprehensive tests
   - Document all security-related changes

3. **Security Requirements**
   - All cryptographic changes require security review
   - No hardcoded secrets or credentials
   - Follow secure coding practices
   - Test encryption/decryption thoroughly

4. **Submit Pull Request**
   - Detailed description of changes
   - Security impact assessment
   - Test coverage report
   - Documentation updates

#### For Bug Reports:

1. **Security Issues**: Email Tommyk999 directly (do not create public issues)
2. **Non-Security Bugs**: Create detailed GitHub issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots if applicable

### Code Review Process

1. **Automatic Checks**
   - All tests must pass
   - Code coverage requirements
   - Security scan results
   - Linting and formatting

2. **Manual Review**
   - Code quality assessment
   - Security implications
   - Architecture consistency
   - Documentation completeness

3. **Approval Required**
   - Owner (Tommyk999) approval required for all changes
   - Security team review for crypto/auth changes
   - Two approvals minimum for major changes

### Development Setup

```bash
# Clone repository (invited collaborators only)
git clone https://github.com/tommyk999/deso-secure-messenger.git
cd deso-secure-messenger

# Setup development environment
npm run setup

# Run security audit
npm run security-audit
```

### Code Standards

#### Security First
- Never commit secrets or credentials
- All user inputs must be validated
- Crypto operations use secure random generators
- Error messages don't leak sensitive information

#### TypeScript
- Strict mode enabled
- Complete type definitions
- No `any` types without justification
- Interface over type unions

#### Testing
- Unit tests for all business logic
- Integration tests for API endpoints
- Security tests for crypto functions
- E2E tests for critical user flows

#### Documentation
- JSDoc for all public functions
- README updates for new features
- Security documentation for crypto changes
- API documentation for endpoints

### Intellectual Property

#### Copyright Assignment
All contributors assign copyright of their contributions to Tommyk999.

#### Confidentiality
Contributors must maintain confidentiality of:
- Source code architecture
- Security implementation details
- Business logic and algorithms
- User data and analytics

#### Non-Disclosure
Contributors agree not to:
- Share proprietary information
- Create competing products using gained knowledge
- Reverse engineer or analyze code for competitive purposes

### Security Guidelines

#### Reporting Security Issues
1. **DO NOT** create public GitHub issues for security vulnerabilities
2. Email security@tommyk999.com with:
   - Detailed vulnerability description
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if known)

#### Security Review Process
1. All crypto-related changes require security review
2. Authentication/authorization changes need approval
3. Database schema changes require data security assessment
4. API changes need endpoint security analysis

### Legal Requirements

#### Contributor License Agreement
All contributors must sign a CLA stating:
- Copyright assignment to Tommyk999
- No patent claims against the project
- Compliance with export control laws
- Confidentiality agreement

#### Export Control
This software may be subject to export control laws. Contributors must:
- Comply with applicable export regulations
- Not contribute from restricted countries
- Understand cryptographic export limitations

### Contact Information

**Owner**: Tommyk999
**Email**: [Contact through GitHub profile]
**Security Issues**: Security-sensitive issues only
**General Questions**: Create GitHub issue (non-security)

---

## ⚠️ Important Notice

By contributing to this project, you acknowledge that:
1. This is proprietary software owned by Tommyk999
2. All contributions become property of Tommyk999
3. You agree to maintain confidentiality
4. You will not use this code for competing products
5. You understand the security-sensitive nature of this application

**Unauthorized contributions or use of this code may result in legal action.**
