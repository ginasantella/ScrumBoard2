'use strict';
import React, {Component} from 'react';
import ReactNative from 'react-native';
const { StyleSheet, Text, View} = ReactNative;

class StatusBar extends Component {
  render() {
    return (
      <View>
        <View style={styles.statusbar}/>
        <View style={styles.navbar}>
          <Text style={styles.navbarTitle}>{this.props.title}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
navbar: {
    alignItems: 'center',
    backgroundColor: '#4169E1',
    //borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    justifyContent: 'center',
    paddingBottom: 1,
    paddingTop: 1,
    height: 60,
    flexDirection: 'row'
  },
  navbarTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontFamily: "Helvetica",
    fontWeight: "700"
  },
  statusbar: {
    //backgroundColor: '#fff',
    height: 1,
  },
    });

module.exports = StatusBar;
