# 🛡️ Code Quality Standards

## 🎯 Overview

This project enforces strict code quality standards through automated tooling and pre-commit hooks. All code must pass linting, formatting, type checking, and testing before being committed.

## 🔧 Tools & Configuration

### 📏 ESLint

- **Configuration**: `.eslintrc.js`
- **Purpose**: Code linting and best practices enforcement
- **Rules**: React Native, TypeScript, and custom quality rules

### 💅 Prettier

- **Configuration**: `.prettierrc.js`
- **Purpose**: Code formatting consistency
- **Settings**: Single quotes, trailing commas, 2-space indentation

### 🔍 TypeScript

- **Configuration**: `tsconfig.json`
- **Purpose**: Type checking and compile-time error detection
- **Mode**: Strict type checking enabled

### 🧪 Jest

- **Configuration**: `jest.config.js`
- **Purpose**: Unit testing and code coverage
- **Coverage**: Minimum thresholds enforced

## 🚀 Available Scripts

### Quality Check Scripts

```bash
# Run all quality checks
npm run validate

# Fix formatting and linting issues
npm run fix

# Individual checks
npm run lint          # ESLint check
npm run lint:fix      # Fix ESLint issues
npm run format        # Format code with Prettier
npm run format:check  # Check formatting
npm run type-check    # TypeScript check
npm run test          # Run tests
npm run test:coverage # Run tests with coverage
```

## 🪝 Git Hooks (Husky)

### Pre-commit Hook

Automatically runs on every commit attempt:

1. **Lint-staged**: Checks only staged files
2. **ESLint**: Fixes linting issues automatically
3. **Prettier**: Formats code automatically
4. **Type Check**: Ensures TypeScript compliance

### Commit Message Hook

Validates commit messages against conventional commit format:

**Required format**: `<type>[optional scope]: <description>`

**Valid types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Examples**:

```bash
✅ feat: add user authentication
✅ fix(api): resolve login timeout issue
✅ docs: update README with setup instructions
❌ Add new feature  # Missing type
❌ feat add feature # Missing colon
```

## 🔄 Lint-staged Configuration

Only staged files are processed during pre-commit:

```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write", "git add"],
  "*.{json,md}": ["prettier --write", "git add"]
}
```

## 🤖 GitHub Actions CI/CD

### Quality Checks Workflow (`.github/workflows/ci.yml`)

Runs on every push and PR:

1. **Multi-Node Testing**: Tests on Node 18.x and 20.x
2. **TypeScript Check**: Ensures type safety
3. **ESLint Check**: Validates code quality
4. **Prettier Check**: Ensures formatting consistency
5. **Test Coverage**: Runs full test suite with coverage
6. **Security Audit**: Checks for vulnerabilities
7. **Build Check**: Validates Expo build process

### PR Quality Workflow (`.github/workflows/pr-quality.yml`)

Validates pull requests:

1. **PR Title Validation**: Must follow conventional commits
2. **PR Size Check**: Warns for large PRs
3. **Label Requirements**: Requires categorization labels
4. **Automated Comments**: Provides feedback on PR quality

## 🚫 Quality Gates

All commits must pass these quality gates:

### ✅ Linting Rules

- No unused variables
- No console.log in production code
- Consistent code style
- React Native best practices
- TypeScript strict rules

### 🎨 Formatting Standards

- Single quotes for strings
- Trailing commas
- 2-space indentation
- 100-character line length
- LF line endings

### 🔍 Type Safety

- Strict TypeScript checking
- No implicit any types
- Explicit return types for functions (where needed)
- Proper interface definitions

### 🧪 Testing Requirements

- Minimum test coverage thresholds
- All tests must pass
- No skipped or pending tests

## 🛠️ Development Workflow

### Setting Up Quality Checks

```bash
# Install dependencies
npm install

# Husky hooks are automatically installed via `prepare` script
# Verify setup
npm run validate
```

### Daily Development

```bash
# Before starting work
git pull origin main

# During development - auto-format on save recommended
# Commit with proper message format
git add .
git commit -m "feat: implement new feature"

# Pre-commit hooks run automatically
# Fix any issues if hooks fail
npm run fix
```

### Fixing Quality Issues

```bash
# Fix all auto-fixable issues
npm run fix

# Check what still needs manual fixing
npm run validate

# Run individual checks for debugging
npm run lint
npm run type-check
npm run test
```

## 🔧 IDE Configuration

### VS Code Settings (Recommended)

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Extensions (Recommended)

- ESLint
- Prettier - Code formatter
- TypeScript Hero
- Jest Runner

## 🚨 Troubleshooting

### Pre-commit Hook Fails

```bash
# See what's failing
npm run validate

# Fix automatically where possible
npm run fix

# Manually fix remaining issues
npm run lint    # Check linting issues
npm run type-check  # Check TypeScript errors
npm run test    # Check failing tests
```

### CI/CD Failures

1. Check the GitHub Actions logs
2. Run `npm run validate` locally
3. Ensure all dependencies are installed
4. Verify Node.js version compatibility

### Commit Message Rejected

Ensure your commit message follows the format:

```bash
git commit -m "feat: your feature description"
# Not: git commit -m "add feature"
```

## 📊 Code Quality Metrics

The project tracks these quality metrics:

- **Test Coverage**: >80% line coverage required
- **Type Coverage**: 100% (no any types)
- **Lint Compliance**: 0 ESLint errors allowed
- **Format Compliance**: 100% Prettier compliance
- **Build Success**: Must build without errors

## 🎯 Quality Goals

- **Maintainability**: Code should be easy to read and modify
- **Reliability**: Comprehensive testing and type safety
- **Consistency**: Uniform code style across the project
- **Performance**: Optimized builds and runtime performance
- **Security**: Regular dependency audits and secure coding practices

---

_This document is automatically enforced through pre-commit hooks and CI/CD pipelines. All developers must follow these standards._
