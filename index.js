/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
global.fs = {
    readFile: () => Promise.resolve(null),
    writeFile: () => Promise.resolve(null),
    // Agrega otros métodos que necesites
  };

AppRegistry.registerComponent(appName, () => App);
