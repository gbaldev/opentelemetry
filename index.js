/**
 * @format
 */

import 'react-native-get-random-values';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Buffer } from 'buffer';

global.Buffer = global.Buffer || Buffer;
global.process = require('process');
global.fs = {
    readFile: () => Promise.resolve(null),
    writeFile: () => Promise.resolve(null),
    // Agrega otros métodos que necesites
  };

AppRegistry.registerComponent(appName, () => App);
