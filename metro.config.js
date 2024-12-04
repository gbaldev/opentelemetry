/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    sourceExts: ['js', 'json', 'ts', 'tsx', 'android.js', 'ios.js'],
    extraNodeModules: {
      constants: require.resolve('constants-browserify'),
      crypto: require.resolve('crypto-browserify'),
      dns: require.resolve('node-libs-browser/mock/dns'),
      domain: require.resolve('domain-browser'),
      fs: require.resolve('node-libs-browser/mock/empty'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      net: require.resolve('node-libs-browser/mock/net'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      querystring: require.resolve('querystring-es3'),
      stream: require.resolve('stream-browserify'),
      sys: require.resolve('util'),
      timers: require.resolve('timers-browserify'),
      tls: require.resolve('node-libs-browser/mock/tls'),
      tty: require.resolve('tty-browserify'),
      vm: require.resolve('vm-browserify'),
      zlib: require.resolve('browserify-zlib'),
      'perf_hooks': path.resolve(__dirname, 'src/__mocks__/mockPerfHooks.js'),
      'child_process': path.resolve(__dirname, 'src/__mocks__/child_process.js'),
    },
  },
};
