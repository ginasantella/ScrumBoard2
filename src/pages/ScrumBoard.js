import React, { Component, PropTypes } from 'react';
 
import {
  StyleSheet,
  Text,
  ListView,
  View,
  TextInput,
  ScrollView,
  AppRegistry,
  AlertIOS,
  NavigatorIOS,
  Image, 
  TouchableHighlight, 
  Animated,
} from 'react-native';
 
import Icon from 'react-native-vector-icons/FontAwesome';
import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';
import Panel from '../components/Panel';
import Home from './Home';
import navigator from './Navigation';
import config from '../../config';
import firebaseApp from '../../node_modules/firebase/';
import firebase from 'firebase/app';
import Accordion from 'react-native-accordion';
import { range } from 'lodash';

const StatusBar = require('../components/StatusBar');
//var ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })

export default class ScrumBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
              username: this.props.username,
              projectName: this.props.projectName,
              projectKey: this.props.projectKey,
        };
    }

    getRef() {
        return firebaseApp.database().ref();
    }

    render() {
    return ( 
      <ScrollView style={styles.scroll}>
        <Container>
            <StatusBar title={this.state.projectName + " Scrum Board"} />
        </Container>
        <Panel title="Product Backlog">
          <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
        </Panel>
        <Panel title="Spring Backlog">
          <Text>Lorem ipsum...</Text>
        </Panel>
        <Panel title="To Do">
          <Text>Lorem ipsum dolor sit amet...</Text>
        </Panel>
        <Panel title="In Progress">
          <Text>Lorem ipsum dolor sit amet...</Text>
        </Panel>
        <Panel title="Done">
          <Text>Lorem ipsum dolor sit amet...</Text>
        </Panel>
      </ScrollView>
    );
  }


//});
}

AppRegistry.registerComponent('Panels', () => ScrumBoard);


var styles = StyleSheet.create({
  container: {
    flex            : 1,
    backgroundColor : '#f4f7f9',
    paddingTop      : 30
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#4169E1',
    paddingHorizontal: 5,
    paddingVertical: 10
},
container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
listview: {
    flex: 1,
  },
menuTrigger: {
   flexDirection: 'row',
   paddingHorizontal: 10
   },
menuTriggerText: {
   color: '#E1D7D8',
   fontWeight: '600',
   fontSize: 20
   },
disabled: {
   color: '#ccc'
   },
divider: {
   marginVertical: 5,
   marginHorizontal: 2,
   borderBottomWidth: 1,
   borderColor: '#ccc'
   },
content: {
   backgroundColor: '#E1D7D8',
   padding: 50,
   flexDirection: 'column'                                 },
   contentText: {
   fontSize: 18
   },
scroll: {
    backgroundColor: '#E1D7D8',
    padding: 30,
    flexDirection: 'column'
},
});