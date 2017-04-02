import React, { Component } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  AppRegistry,
  NavigatorIOS,
} from 'react-native';
 
import Icon from 'react-native-vector-icons/FontAwesome';
import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';
import navigator from './Navigation';
import Login from './Login';
import config from '../../config';
import firebaseApp from '../../node_modules/firebase/';
import firebase from 'firebase/app';

import Menu, {
    MenuContext,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-menu';


export default class Home extends Component{

constructor(props) {
        super(props);

        this.state = {
            username: '',
            message: 'Welcome ' + this.props.username + '!',
            firstMenuDisabled: false,
            dropdownSelection: '-- Choose --'
        };

        this.projectsRef = this.getRef().child('projects');

}

  getRef() {
      return firebaseApp.database().ref();
  }

   componentDidMount() {
    this.checkProjects();
   }

   checkProjects(){
    var correctUsername = this.state.username;
    //this.usersRef = this.projectsRef.getRef().child('users');
    this.projectsRef.on("value", (snapshot) => {
        //var done = false;
        var users =[];
        snapshot.forEach((child) => { //each project
          child.forEach((child1) => { //each attribute
            if(child.val().correctUsername == true){
              AlertIOS.alert(
              'Yes',
              'User is on project.',
              [
                {text: 'Okay', onPress: () => console.log('Okay'), style: 'cancel'},
              ]
              );
            }
          });
          //users = child.val().users;
          //users.push(child.val().users)
          /*if(child.val().correctUsername==true){
            AlertIOS.alert(
              'Yes',
              'User is on project.',
              [
                {text: 'Okay', onPress: () => console.log('Okay'), style: 'cancel'},
              ]
              );
          }
          else{
              AlertIOS.alert(
              'Yes',
              'User is on project.',
              [
                {text: 'Okay', onPress: () => console.log('Okay'), style: 'cancel'},
              ]
              );

          }*/
            //if(child.val().users == correctUserName){
            //if(child.val().password == correctPassword){



                
            
        });
    });

   }

  setMessage(value) {
    if (typeof value === 'string') {
      this.setState({ message: `You selected "${value}"` });
    } else {
      this.setState({ message: `Woah!\n\nYou selected an object:\n\n${JSON.stringify(value)}` });
    }
    return value !== 'do not close';
  }
  
  setFirstMenuDisabled(disabled) {                         
    return false;
  }

  render() {
   return (
      <MenuContext style={{ flex: 1 }} ref="MenuContext">
      <View style={styles.topbar}>
      <Menu onSelect={this.setMessage}>
       <MenuTrigger disabled={this.state.firstMenuDisabled} style={styles.menuTrigger}>
       <Text style={styles.menuTriggerText}>SCRUM</Text>
       </MenuTrigger>
       <MenuOptions style={styles.menuOptions}>
       <MenuOption value="User Profile">
       <Text>User Profile</Text>
       </MenuOption>
        <MenuOption value="Projects Owned">
        <Text>Projects Owned</Text>
        </MenuOption>
         <MenuOption value="disabled" disabled={true}>
         <Text style={styles.disabled}>Disabled option</Text>
        </MenuOption>
          <View style={styles.divider}/>
         <MenuOption value={{ message: 'Hello World!' }}>
         <Text>Log Out</Text>
        </MenuOption>
        </MenuOptions>
        </Menu>
       </View>
       <View style={[styles.topbar, { backgroundColor: '#333' }]}>
        <Menu onSelect={this.setFirstMenuDisabled}>
         <MenuTrigger style={styles.menuTrigger}>
        <Text style={styles.menuTriggerText}>HOME PAGE</Text>
        </MenuTrigger>
        <MenuOptions>
        {this.state.secondMenuDisabled}
        </MenuOptions>
         </Menu>
         </View>
         <View style={styles.content}>
         <Text style={styles.contentText}>
         { this.state.message }
        </Text>
       </View>
       <View style={styles.content}>
       <Text style={styles.contentText}>
       Select desired project:
       </Text>
       <Menu style={styles.dropdown} onSelect={(value) => this.setState({ dropdownSelection: value })}>
        <MenuTrigger>
        <Text>{this.state.dropdownSelection}</Text>
        </MenuTrigger>
       <MenuOptions optionsContainerStyle={styles.dropdownOptions}
       renderOptionsContainer={(options) => <ScrollView><Text>Current Active Project List...</Text>{options}</ScrollView>}>
       <MenuOption value="Project One">
       <Text>Project One</Text>
       </MenuOption>
        <MenuOption value="Project Two">
       <Text>Project Two</Text>
       </MenuOption>
       <MenuOption value="Project Three">
       <Text>Project Three</Text>
        </MenuOption>
        <MenuOption value="Project Four">
        <Text>Project Four</Text>
        </MenuOption>
        <MenuOption value="Project Five">
       <Text>Project Five</Text>
        </MenuOption>
         </MenuOptions>
         </Menu>
         </View>
         </MenuContext>              
      );
    }
  }


const styles = StyleSheet.create({
topbar: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  backgroundColor: '#4169E1',
  paddingHorizontal: 5,
  paddingVertical: 10
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
dropdown: {
   width: 300,
   borderColor: '#999',
   borderWidth: 1,
   padding: 5
   },
dropdownOptions: {
  marginTop: 30,
  borderColor: '#ccc',
  borderWidth: 2,
  width: 300,
  height: 200
  }
});

//module.exports = Example;