import js from '@eslint/js';
import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  {
    ignores: [
      'bundles/**',
      'web-ext-artifacts/**',
      'build/**',
      'coverage/**',
      'node_modules/**',
      '**/*.min.js',
      'yarn.lock'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json'
      },
      globals: {
        ...globals.browser,
        ...globals.webextensions,
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tsEslint
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-const': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      
      // General JavaScript rules
      'no-console': 'off',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Using TypeScript version instead
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'yield-star-spacing': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'rest-spread-spacing': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-rename': 'error',
      'no-duplicate-imports': 'error',
      'arrow-spacing': 'error',
      'generator-star-spacing': 'error',
      
      // Style rules
      'indent': ['error', 2, { 'SwitchCase': 1 }],
      'quotes': ['error', 'double', { 'avoidEscape': true }],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'never'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-function-paren': ['error', 'never'],
      'keyword-spacing': 'error',
      'space-before-blocks': 'error',
      'brace-style': ['error', 'stroustrup', { 'allowSingleLine': true }],
      'curly': ['error', 'all'],
      'eqeqeq': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 1 }]
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.webextensions,
        ...globals.node
      }
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }]
    }
  },
  {
    files: ['tests/**/*'],
    languageOptions: {
      globals: {
        ...globals.mocha,
        expect: 'readonly'
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off'
    }
  },
  {
    files: ['util/**/*', 'webpack.config.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'no-console': 'off'
    }
  }
];