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
import Home from './Home';
import ListItem from '../components/ListItem';
import ScrumBoard from './ScrumBoard';
import navigator from './Navigation';
import config from '../../config';
import Login from './Login';
import firebaseApp from '../../node_modules/firebase/';
import firebase from 'firebase/app';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

const StatusBar = require('../components/StatusBar');

var users = []; 
var userStory = "";
var currentPercentage = 0;

 export default class AddTask extends Component {
     
        constructor(props) {
            super(props);

            this.state = {
                username: this.props.username,
                projectKey: this.props.projectKey,
                projectName: this.props.projectName,
                userStoryKey: this.props.userStoryKey,
                role: this.props.role,
                tDescription: "",
                tMemberAssigned: "",
                tPercentage: "",
                dataSource: new ListView.DataSource({
                    rowHasChanged: (row1, row2) => row1 !== row2,
                }),
            };
             
            this.pblRef = this.getRef().child('prodBacklogs');
            this.projectsRef = this.getRef().child('projects');
        }

        getRef() {
            return firebaseApp.database().ref();
        }

    componentDidMount() {
        this.userList()
   }

   userList(){
       var correctProjKey = this.state.projectKey;
       var correctUserStoryKey = this.state.userStoryKey;
       users = [];
       this.projectsRef.on("value", (snapshot) => {
           snapshot.forEach((child) => { //each project
               if(child.key == correctProjKey){
               child.forEach(function(data)  { //each attribute
                   var itemName = data.key;
                   if(itemName=='users'){
                        data.forEach(function(data2) {
                            var username = data2.key;
                            var role = '';
                            var pendingStatus = '';
                            data2.forEach(function(data3) {
                                var attributeName = data3.key;
                                var attributeValue = data3.val();
                                if(attributeName == "_role"){
                                    role = attributeValue;
                                }
                                if(attributeName == 'pending'){
                                    pendingStatus = attributeValue;
                                }
                            });
                            if(pendingStatus == false && role == 'Dev Team'){
                                users.push({
                                    label: username,
                                    value: username,
                                });
                            }
                        });
                    }
               });
               }

           });
       });
       this.pblRef.on("value", (snapshot) => {
        currentPercentage = 0;
        snapshot.forEach((child) => { //each userstory
            if(child.key == correctUserStoryKey){
                child.forEach(function(data)  { //each attribute
                   var itemName = data.key;
                   var itemValue = data.val();
                   var currentProjectKey = '';

                   if(itemName == '_userStory'){
                       userStory = itemValue;
                   }
                    if(itemName == 'tasks'){
                            data.forEach(function(data1){
                                data1.forEach(function(data2){
                                    var name = data2.key;
                                    var value = data2.val();
                                    if(name == 'percentage'){
                                        if(value != ""){
                                            var numValue = parseInt(value, 10);
                                            currentPercentage = currentPercentage + numValue;
                                        }
    
                                    }
                                });
                            }); 

                   }
                });
            }
        });
       });
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(users)
        });
   }
    onChanged(text) {
    let newText = '';
    let numbers = '0123456789';

    for (var i = 0; i < text.length; i++) {
        if ( numbers.indexOf(text[i]) > -1 ) {
            newText = newText + text[i];
        }
    }   
    this.setState({tPercentage: newText})
}

    render() {
        return (
            <ScrollView style={styles.scroll}>
            <Container>
                <StatusBar title="Task Item" />
            </Container>
            <Container>
             <Label text="Task for User Story" />
             <Text>{userStory}</Text>
            </Container>
	     <Container>
             <Label text="Description of Task" />
                 <TextInput
                style={styles.textInput} 
                autoCapitalize= 'none'
                returnKeyType = "next"
                onChangeText={(text) =>{
                    this.setState({tDescription:text});
                }}/>
            </Container>
            <Container>
             <Label text="Percentage of User Story" />
                 <TextInput
                style={styles.textInput} 
                keyboardType = 'numeric'
                onChangeText = {(text)=> this.onChanged(text)}
                value = {this.state.tPercentage}
                maxLength = {3}
                />
            </Container>
            <Container>
             <Label text="Member Assigned to Task" />
                <RadioForm
                    radio_props={users}
                    initial={-1}
                    onPress={(value) => {this.setState({tMemberAssigned:value})}}/>
            </Container>
            <View style={styles.footer}>
                <Container>
                    <Button 
                        label="Create Task"
                        styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                        onPress={this.toCreateTask.bind(this)} />
                </Container>
                <Container>
                    <Button 
                        label="CANCEL"
                        styles={{label: styles.buttonBlackText}} 
                        onPress={this.cancel.bind(this)} />
                </Container>
            </View>
        </ScrollView> 
        );
    }
    cancel = () => {
        var correctProjectName = this.state.projectName;
        var correctUserName = this.state.username;
        var correctProjKey = this.state.projectKey;
        this.props.navigator.push({
            title: 'Scrum Board',
            component: ScrumBoard, 
            passProps:{
              username: correctUserName,
              projectKey: correctProjKey,
              projectName: correctProjectName,
            }
        });
    }

    toCreateTask(){
        var correctDescription = this.state.tDescription;
        var correctMemberAssigned = this.state.tMemberAssigned;
        var correctPercentage = this.state.tPercentage;
        var correctProjectName = this.state.projectName;
        var correctUserStoryKey = this.state.userStoryKey;
        var correctProjKey = this.state.projectKey;
        var correctUserName = this.state.username;
        var correctRole = this.state.role;
        
        var once = false;
        var done = false;
        var percentBoolean = false;
     
        if(once != true){
        this.pblRef.on("value", (snapshot) => {
            snapshot.forEach((child) => { //for each pbl item
                if(child.key == correctUserStoryKey){
                    child.forEach(function(data){ //for each attribute
                        var itemName = data.key;
                        if(correctDescription == "" && once != true){
                            once = true;
                        }
                        var correctPercentageConvert = parseInt(correctPercentage, 10);
                        var totalPercentage = parseInt(currentPercentage + correctPercentageConvert, 10);
                        if(totalPercentage > 100){
                            once = true;
                            percentBoolean = true;
                        }
                        if(itemName == 'tasks' && once !=true){
                            once = true;
                            done = true;
                            data.ref.push( {
                                _description : correctDescription ,
                                status: 'ToDo',
                                percentage: correctPercentage,
                                assignedMember: correctMemberAssigned,
                            })
                        }
                    });
                }
            });
        });
    }
    if(done == false && percentBoolean != true){ //error  - description empty
        var correctProjectName = this.state.projectName;
        var correctUserStoryKey = this.state.userStoryKey;
        var correctProjKey = this.state.projectKey;
        var correctUserName = this.state.username;
        var correctRole = this.state.role;
        AlertIOS.alert(
            'Error!',
            'A description is required.' + '\n' + 'Please fill in a task description before continuing.',
            [
            {text: 'Okay', onPress: () => this.props.navigator.push({
                                    title: 'Add a Task',
                        component: AddTask,
                        passProps:{
                            username: correctUserName,
                            projectName: correctProjectName,
                            projectKey: correctProjKey,
                            userStoryKey: correctUserStoryKey,
                            role: correctRole,
                        }
                        }), style: 'cancel'},
            ]
        ); 
    }
    if(done == false && percentBoolean == true){ //error  - percent exceeds 100
        var correctProjectName = this.state.projectName;
        var correctUserStoryKey = this.state.userStoryKey;
        var correctProjKey = this.state.projectKey;
        var correctUserName = this.state.username;
        var correctRole = this.state.role;
        AlertIOS.alert(
            'Error!',
            'Please enter a percentage that is less than 100%.' + '\n' + 'Current total percentage is ' + [currentPercentage] + '%.',
            [
            {text: 'Okay', onPress: () => this.props.navigator.push({
                                    title: 'Add a Task',
                        component: AddTask,
                        passProps:{
                            username: correctUserName,
                            projectName: correctProjectName,
                            projectKey: correctProjKey,
                            userStoryKey: correctUserStoryKey,
                            role: correctRole,
                        }
                        }), style: 'cancel'},
            ]
        ); 
    }   

    if(once == true && done ==true && percentBoolean != true){ //Works
        var correctProjectName = this.state.projectName;
        var correctProjKey = this.state.projectKey;
        var correctUserName = this.state.username;
        var correctRole = this.state.role;
        AlertIOS.alert(
            'Success!',
            'Click Okay to return the Scrum Board',
            [
                {text: 'Okay', onPress: () => this.props.navigator.push({
                                        title: 'Scrum Board',
                        component: ScrumBoard,
                        passProps:{
                            username: correctUserName,
                            projectKey: correctProjKey,
                            projectName: correctProjectName,
                            role: correctRole,
                        }
                            }), style: 'cancel'},
            ]
        ); 
    }
}


//end of class
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
textInput:{
    height: 30,
    fontSize: 15,
    backgroundColor: '#FFF'
},
textInput2: {
    height: 80,
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