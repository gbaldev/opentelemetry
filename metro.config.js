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
      '@opentelemetry/api': path.resolve(__dirname, 'node_modules/@opentelemetry/api'),
      http: path.resolve(__dirname, 'node_modules/stream-http'),
      'perf_hooks': path.resolve(__dirname, 'src/mocks/mockPerfHooks.js'),
      'os': require.resolve('os-browserify/browser'),
      https: path.resolve(__dirname, 'node_modules/https-browserify'),
      crypto: require.resolve('react-native-crypto'),
      stream: require.resolve('stream-browserify'),
      events: require.resolve('events'),
      fs: require.resolve('react-native-fs'),
      util: require.resolve('util'),
      'child_process': path.resolve(__dirname, 'src/mocks/child_process.js'),
      zlib: path.resolve(__dirname, 'node_modules/browserify-zlib'),
      assert: path.resolve(__dirname, 'node_modules/assert'),
      'process': require.resolve('process'),
    },
  },
};