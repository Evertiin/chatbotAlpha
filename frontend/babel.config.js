
module.exports = {
  presets: [
    '@quasar/babel-preset-app',
    ['@babel/preset-env', { targets: { node: 'current' } }]
  ],
  plugins: ['@babel/plugin-proposal-optional-chaining']

}
