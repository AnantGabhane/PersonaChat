module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    'no-useless-escape': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-undef': 'error'
  },
  settings: {
    react: {
      version: 'detect'
    },
    next: {
      rootDir: './',
    },
  },
}
