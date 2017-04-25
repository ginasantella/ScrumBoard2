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
import ScrumBoard from './ScrumBoard';
import Home from './Home';

import Menu, {
    MenuContext,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-menu';


export default class Invitations extends Component{

constructor(props) {
        super(props);

        this.state = {
            username: this.props.username,
            message: 'Welcome ' + this.props.username + '!',
            projectName: '',
            projectKey: '',
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
    this.projectsRef.on("value", (snapshot) => {
        var projects =[];
        snapshot.forEach((child) => { //each project
             var projectName = '';
          child.forEach(function(data)  { //each attribute
              var itemName = data.key;
              var itemList = data.val();
              if(itemName=='name'){
                  projectName=itemList;
              }
              if(itemName=='users'){
                  data.forEach(function(data1){
                      var userID = data1.key;
                    if(userID==correctUsername){
                        data1.forEach(function(data2){
                            if(data2.key == 'pending'){
                                var pendingVal = data2.val();
                                if(pendingVal == true){
                                    projects.push({
                                        title: projectName,
                                        _key: data1.key,
                                        projectKey:child.key,
                                        
                                    });
                                }
                            }
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

  toHome = () =>{
    var correctUserName = this.state.username;
    this.props.navigator.push({
      title: 'Home',
     component: Home,
      passProps:{
          username: correctUserName,
      }
    });
  }

  render() {
      return(
    <ScrollView style={styles.scroll}>
        <Container>
            <StatusBar title={'Pending Invitations'} />
        </Container>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>

          <View style={styles.footer}>
               <Container>
                    <Button 
                        label="Return to Home"
                        styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                        navigator={this.props.navigator}
                        onPress={this.toHome.bind(this)} />
                </Container>
                </View>
          </ScrollView>
      );
    }

    acceptInvite(correctProjectKey){
            var correctUsername = this.state.username;
    this.projectsRef.on("value", (snapshot) => {
        snapshot.forEach((child) => { //each project
             var projectName = '';
          child.forEach(function(data)  { //each attribute
              var itemName = data.key;
              var itemList = data.val();
              if(itemName=='name'){
                  projectName=itemList;
              }
              if(itemName=='users'){
                  data.forEach(function(data1){
                      var userID = data1.key;
                    if(userID==correctUsername){
                        data1.forEach(function(data2){
                            if(data2.key == 'pending'){
                                var pendingVal = data2.val();
                                if(pendingVal == true){
                                    if(itemList == data.val()){
                                    data1.ref.update( {
                                            [data2.key]: false    
                                    });
                                    }

                                }
                            }
                        });
                    }
                  });
              }
          });    
        });
    });
}

    rejectInvite(correctProjectKey){
            var correctUsername = this.state.username;
    this.projectsRef.on("value", (snapshot) => {
        snapshot.forEach((child) => { //each project
             var projectName = '';
          child.forEach(function(data)  { //each attribute
              var itemName = data.key;
              var itemList = data.val();
              if(itemName=='name'){
                  projectName=itemList;
              }
              if(itemName=='users'){
                  data.forEach(function(data1){
                      var userID = data1.key;
                    if(userID==correctUsername){
                        data1.forEach(function(data2){
                            if(data2.key == 'pending'){
                                var pendingVal = data2.val();
                                if(pendingVal == true){
                                    data1.ref.remove();
                                }
                            }
                        });
                    }
                  });
              }
          });    
        });
    });
    }

    _renderItem(item) {
      var correctUserName = this.state.username;
      var correctProjectName = item.title;
      var correctProjectKey = item.projectKey;
    
    const onPress = () => {
      AlertIOS.alert(
        'Invitation Response',
        null,
        [
         {text: 'Accept', onPress: this.acceptInvite.bind(this)},

          {text: 'Reject', onPress: this.rejectInvite.bind(this)},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }
  }
module.exports = Invitations;

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
    backgroundColor: '#663399',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 10,
},
});