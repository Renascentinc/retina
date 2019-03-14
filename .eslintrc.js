module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // allow debugger and console during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/html-self-closing': 'off',
    'camelcase': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
