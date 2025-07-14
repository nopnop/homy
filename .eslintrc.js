module.exports = {
  extends: ['standard'],
  env: {
    browser: true,
    webextensions: true,
    jquery: true
  },
  globals: {
    angular: 'readonly',
    chrome: 'readonly',
    debounce: 'readonly'
  },
  rules: {
    // Allow console statements for debugging
    'no-console': 'warn',
    // Allow semicolons (legacy code compatibility)
    semi: 'off',
    // Allow var declarations (legacy AngularJS code)
    'no-var': 'off',
    // Allow function declarations in blocks (legacy code)
    'no-inner-declarations': 'off'
  }
}