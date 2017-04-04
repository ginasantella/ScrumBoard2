import React, { Component } from 'react';
 
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
import StatusBar from '../components/StatusBar';
import ListItem from '../components/ListItem';
import AddUser from './AddUser';
import NewProjectFunc from './NewProjectFunc';

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
            username: this.props.username,
            message: 'Welcome ' + this.props.username + '!',
            firstMenuDisabled: false,
            dropdownSelection: '-- Choose --',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
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
    //console.log("Correct username is:"+correctUsername);
    //this.usersRef = this.projectsRef.getRef().child('users');
    this.projectsRef.on("value", (snapshot) => {
        //var done = false;
        var projects =[];
        snapshot.forEach((child) => { //each project
             var projectName = '';
          child.forEach(function(data)  { //each attribute
              //console.log("*************here************");
              var itemName = data.key;
             // console.log("key is "+ itemName);
              var itemList = data.val();
              if(itemName=='name'){
                 // console.log("here");
                  projectName=itemList;
                  //console.log("project name should be " + projectName);
              }
              //console.log("Should display usernames: " + itemName + " space " + itemList);
              if(itemName=='users'){
                  data.forEach(function(data1){
                      var userID = data1.key;
                    //console.log("username is:" + userID+"***");
                    if(userID==correctUsername){
                        //console.log("project is " + projectName);
                        projects.push({
                            title: projectName,
                            _key: data1.key,
                        });
                    }
                  });
              }
          });    
        });
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(projects)
      });
    });

   }

  /*setMessage(value) {
    if (typeof value === 'string') {
      this.setState({ message: `You selected "${value}"` });
    } else {
      this.setState({ message: `Woah!\n\nYou selected an object:\n\n${JSON.stringify(value)}` });
    }
    return value !== 'do not close';
  }*/
  
  /*setFirstMenuDisabled(disabled) {                         
    return false;
  }*/

  toAddProject = () =>{
    var correctUserName = this.state.username;
    this.props.navigator.push({
      title: 'Add Project',
     component: NewProjectFunc,
      passProps:{
          username: correctUserName,
      }
    });
  }

  render() {
      return(
    <ScrollView style={styles.scroll}>
            <Container>
                <StatusBar title={'Welcome ' + this.state.username} />
            </Container>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>

          <View style={styles.footer}>
               <Container>
                    <Button 
                        label="Add Project"
                        styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                        navigator={this.props.navigator}
                        onPress={this.toAddProject.bind(this)} />
                </Container>
                </View>
          </ScrollView>
      );

   /*return (
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
      );*/
    }
    _renderItem(item) {

    const onPress = () => {
      AlertIOS.alert(
        'Project Options',
        null,
        [
          //{text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }
  }
module.exports = Home;

//Styles 
const styles = StyleSheet.create({
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
},
scroll: {
    backgroundColor: '#E1D7D8',
    padding: 30,
    flexDirection: 'column'
},
buttonWhiteText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: "500",
    textAlign: 'center',
    fontFamily: "Helvetica"
},
buttonBlackText: {
    fontSize: 20,
    color: '#595856'
},
primaryButton: {
    backgroundColor: '#4169E1',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 10,
},
});