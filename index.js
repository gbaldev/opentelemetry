/**
 * @format
 */
import { Buffer } from 'buffer';
import process from 'process';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

global.Buffer = Buffer;
global.process = process;

if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = setTimeout;
}


AppRegistry.registerComponent(appName, () => App);
