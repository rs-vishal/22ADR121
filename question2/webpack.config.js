// ... existing code ...
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  // ... existing code ...
  resolve: {
    alias: {
      'react-refresh/runtime': require.resolve('react-refresh/runtime')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    process.env.NODE_ENV === 'development' && new ReactRefreshWebpackPlugin({
      overlay: false
    })
  ].filter(Boolean)
}
// ... existing code ...