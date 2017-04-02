import React, { Component, PropTypes } from 'react';
 
import {
  Text,
  NavigatorIOS,
  AppRegistry
} from 'react-native';
 
import Icon from 'react-native-vector-icons/FontAwesome';
import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';
import Login from './Login';
import Home from './Home';
import Register from './Register';

const StatusBar = require('../components/StatusBar');

export default class Navigation extends Component {
  render() {
    console.log(Login);
    return (
      <NavigatorIOS
        initialRoute={{
          component: Login,
          title: 'Login',
          passProps: { username: '' }
        }}
        style={{flex: 1}}
        
      />
    )
  }

}
AppRegistry.registerComponent('Navigation', () => Navigation);
