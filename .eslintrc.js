module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'no-underscore-dangle': 'off',
    'func-names': 'off',
    'no-use-before-define': 'off',
    'arrow-parens': 'off',
    curly: 'off',
    'guard-for-in': 'off',
    'no-restricted-syntax': 'off'
  },
  extends: 'airbnb'
};
