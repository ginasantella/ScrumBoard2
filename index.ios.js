import React, { Component} from 'react';
import {
  AppRegistry
} from 'react-native';
 
import Login from './src/pages/Login'; 
import Navigator from './src/pages/Navigation';
 
export default class ScrumBoard extends Component {
 
  render() {
    return (
      <Navigator/>
    );
  }
 
}
 
AppRegistry.registerComponent('ScrumBoard', () => ScrumBoard);
