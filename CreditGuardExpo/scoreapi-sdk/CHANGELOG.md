# Changelog

All notable changes to the ScoreAPI SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-01

### Added
- Initial release of ScoreAPI SDK
- **Authentication Module**
  - User login with username/password
  - Customer login for B2B portal access
  - User registration
  - Automatic token refresh
  - Password recovery and reset
  - Pre-auth token exchange
  - Logout functionality

- **Identity Verification Module**
  - Submit identity information
  - DIT (Digital Identity Trust) verification
  - SMFA (SMS) verification flow

- **User Profile Module**
  - Get user profile
  - Update email, password, notifications
  - Update recovery question
  - Close account
  - Initialize UI configuration

- **Credit Score Module**
  - Get latest credit scores
  - Get score history
  - Get score projection (what-if scenarios)
  - Get Equifax configuration

- **Credit Report Module**
  - Get latest full credit report
  - Get report summary

- **Alert Module**
  - Get all credit monitoring alerts
  - Unread alert count

- **Core Features**
  - Full TypeScript support with complete type definitions
  - Automatic token management and refresh
  - Multi-platform support (Web, React Native, Node.js)
  - Custom error handling with predefined error codes
  - Storage adapters (localStorage, AsyncStorage, in-memory)
  - Request/response interceptors
  - Comprehensive documentation and examples

### Platform Support
- Browser (ES6+)
- React Native
- Node.js (>=14.0.0)

### Documentation
- Complete README with API reference
- Quick start guide
- Web example (HTML/JavaScript)
- React Native example
- Node.js example
- Implementation summary

## [Unreleased]

### Planned Features
- Unit tests with Jest
- Integration tests
- CI/CD pipeline
- Rate limiting support
- Request retry logic
- Offline mode support
- Cache management utilities
- Webhook signature verification
- Direct API endpoints (B2B server-side integration)

---

## Release Notes

### v1.0.0 - Initial Release

This is the first stable release of the ScoreAPI SDK, providing a complete client-side integration solution for web and mobile applications.

**Key Highlights:**
- ✅ Production-ready authentication with automatic token management
- ✅ Simplified identity verification (DIT + SMFA only)
- ✅ Full credit score and report access
- ✅ Type-safe TypeScript API
- ✅ Multi-platform support
- ✅ Comprehensive examples

**What's Not Included:**
- IDFS Quiz verification (not needed for client integration)
- OTP/Mobile verification (not needed for client integration)
- Direct API endpoints (for server-side B2B integration only)
- Admin endpoints (internal use only)

For migration guides and breaking changes in future versions, see the [UPGRADING.md](./UPGRADING.md) file.
