/**
 * @format
 */

import 'react-native-url-polyfill/auto';
import 'performance-polyfill';
import 'stream-http';
import 'events';
import 'react-native-crypto';
import 'stream-browserify';
import 'crypto-browserify';
import 'https-browserify';
import 'react-native-get-random-values';
import 'process';
global.process = require('process');

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
