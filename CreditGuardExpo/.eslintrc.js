module.exports = {
  extends: [
    '@react-native/eslint-config',
    'prettier', // Add prettier to avoid conflicts
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.expo/',
    'build/',
    'android/',
    'ios/',
    '*.d.ts'
  ],
  rules: {
    // Disable problematic React Native rules for now
    'react-native/no-unused-styles': 'off',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'off',

    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // General code quality
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'prefer-arrow-callback': 'error',
  },
};
