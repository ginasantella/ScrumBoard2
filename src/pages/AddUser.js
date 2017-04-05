import React, { Component, PropTypes } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  AlertIOS,
  NavigatorIOS,
} from 'react-native';
 
import Icon from 'react-native-vector-icons/FontAwesome';
import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';
import navigator from './Navigation';
import config from '../../config';
import Login from './Login';
import firebaseApp from '../../node_modules/firebase/';
import firebase from 'firebase/app';
import Home from './Home';
const StatusBar = require('../components/StatusBar');


export default class AddUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            passbackUsername: this.props.username,
            projectName: this.props.projectName,
            projectKey: this.props.projectKey,
        };
        this.addUser = this.addUser.bind(this);

        this.usersRef = this.getRef().child('users');
        this.projectsRef = this.getRef().child('projects');
    }

    getRef() {
        return firebaseApp.database().ref();
    }

  render() {
    return (
        <ScrollView style={styles.scroll}>
            <Container>
                <StatusBar title={"Add User to: " + this.state.projectName} />
            </Container>
            <Container>
            <Label text={"Username"} />
            <TextInput
                style={styles.textInput} 
                autoCapitalize= 'none'
                returnKeyType = "next"
                autoFocus = {true}
                onChangeText={(text) =>{
                    this.setState({username:text});
                }}/>
            </Container>
            <View style={styles.footer}>
                <Container>
                    <Button 
                        label="Add New User to a Board"
                        styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                        navigator={this.props.navigator}
                        onPress={this.addUser.bind(this)} />
                </Container>
            </View>
        </ScrollView> 
    );
  }
//   addUser = () => {
//     this.props.navigator.push({
//         title: 'Home',
//         component: Home
//     });
// }

//Verifies if the password and username are correct to login
addUser(){
    var correctUserName = this.state.username;
    var correctProjectKey = this.state.projectKey;
    var correctProjectName = this.state.projectName;
    var done = false;
    var exists = false;
    var once =false;
    var second=false;
    this.usersRef.on("value", (snapshot) => {
        
        snapshot.forEach((child) => {
            if(child.val().id == correctUserName){
                    done = true; 
                    //add projects attribute
                    //add projectKey to projects attribute
                    

                    //add username to users in project
                    
                    this.projectsRef.on("value", (snapshot) => {
                        snapshot.forEach((child) => {
                            var childKey = child.key;
                            if(childKey==correctProjectKey){
                                //console.log("*****current key:" + childKey+"********");
                                //console.log("*****correct key:" + correctProjectKey+"********");
                                child.forEach(function(data)  {
                                var itemName = data.key;
                                //console.log("*****current attribute:" + itemName+"********");
                                if(itemName=='users'){
                                    data.forEach(function(data1){
                                    var userID = data1.key;
                                    //console.log("username is:" + userID+"***");
                                    //console.log("correct is:" + correctUserName+"***");
                                    if(userID==correctUserName && once!=true){
                                            exists = true;
                                    }
                                });
                                       if(!exists && once!=true){
                              
                                
                                if(itemName=='users' && once!=true){
                                 once=true;
                                  //  data.forEach(function(data2){
                                      
                                data.ref.update( {
                                        [correctUserName]: true,            
                                });
                                   // });
                                }
                            }
                                }
                         
                                });
                            
                        }
                    });
                });
                if(!exists && second!=true){
                    second=true;
                       console.log("****HERE****")
                    child.ref.update( {
                        projects : {[correctProjectKey]: true,}
                        
                    });
                }
                else {
                    var passbackUsername=this.state.passbackUsername;
           var projectname = this.state.projectName;
            var projectKey = this.state.projectKey;
                    AlertIOS.alert(
                        'Error!',
                        'This user is already a part of this project',
                            [
          {text: 'Okay', onPress: (text) => this.props.navigator.push({
                  title: 'Add User',
                  component: AddUser,
                  passProps:{
                      username: passbackUsername,
                      projectName: projectname,
                      projectKey: projectKey,
                  }
    })},
          ]
            );
                }
            }
            });
        });
        if(done==false){
            var passbackUsername=this.state.passbackUsername;
      
           var projectname = this.state.projectName;
            var projectKey = this.state.projectKey;
            AlertIOS.alert(
                'Error!',
                'This user does not exist! Please add an existing user.',
                [
          {text: 'Okay', onPress: (text) => this.props.navigator.push({
                  title: 'Add User',
                  component: AddUser,
                  passProps:{
                      username: passbackUsername,
                      projectName: projectname,
                      projectKey: projectKey,
                  }
    })},
          ]
            );
        }
        else if(done && !exists){
            var passbackUsername=this.state.passbackUsername;
           var username = this.state.username;
           var projectname = this.state.projectName;
            once=true;
            AlertIOS.alert(
                'Success!',
                'User ' + username +' was added to the project '+ projectname +'.',
                 [
                {text: 'Okay', onPress: () => this.props.navigator.push({
                                    title: 'Home',
                                    component: Home,
                                    passProps:{
                                        username: passbackUsername,
                                    }
                   }), style: 'cancel'},
                        ]
            );
        }
    }

}

//Styles
const styles = StyleSheet.create({
 scroll: {
    backgroundColor: '#E1D7D8',
    padding: 30,
    flexDirection: 'column'
},
label: {
    color: '#0d8898',
    fontSize: 15
},
alignRight: {
    alignSelf: 'flex-end'
},
textInput: {
    height: 40,
    fontSize: 15,
    backgroundColor: '#FFF'
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
footer: {
   marginTop: 40
}

});
