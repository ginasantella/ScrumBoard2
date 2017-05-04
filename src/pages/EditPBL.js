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
import Home from './Home';
import ScrumBoard from './ScrumBoard';
import navigator from './Navigation';
import config from '../../config';
import Login from './Login';
import firebaseApp from '../../node_modules/firebase/';
import firebase from 'firebase/app';
import EditPBL from './EditPBL';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

const StatusBar = require('../components/StatusBar');

var correctEstimate = "";
var radio_props = [

  {label: 'S', value: 1 },
  {label: 'M', value: 2 },
  {label: 'L', value: 3},
   {label: 'XL', value: 3}
];
//UncontrolledTextInput = 
 export default class Edit extends Component {
        constructor(props) {
            super(props);

            this.state = {
                username: this.props.username,
                projectKey: this.props.projectKey,
                projectName: this.props.projectName,
                role: this.props.role,
                location: this.props.location,
                pblKey: this.props.pblKey,
                passedVal: this.props.estimateVal,
                pbiDescription: this.props.description,
                pbiUserStory: this.props.userStory,
                pbiAcc:  this.props.ac,
                pbiStatus: "",
               
            };
            this.pblRef = this.getRef().child('prodBacklogs');
            this.projectsRef = this.getRef().child('projects');
 
        }

        getRef() {
            return firebaseApp.database().ref();
        }

    render() {
        return (
            <ScrollView style={styles.scroll}>
            <Container>
                <StatusBar title="Edit Product Backlog Item" />
            </Container>
            <Container>
             <Label text="Description" />
                 <TextInput
                style={styles.textInput} 
                 defaultValue={this.state.pbiDescription}
                autoCapitalize= 'none'
                returnKeyType = "next"
                autoFocus = {true}
                onChangeText={(text) =>{
                    this.setState({pbiDescription:text});
                }}/>
            </Container>
	     <Container>
             <Label text="User Story" />
                 <TextInput
               style={styles.textInput} 
                 defaultValue={this.state.pbiUserStory}
                autoCapitalize= 'none'
                returnKeyType = "next"
                autoFocus = {true}
                onChangeText={(text) =>{
                    this.setState({pbiUserStory:text});
                }}/>
            </Container>
            <Container>
             <Label text="Acceptance Criteria" />
                 <TextInput
                style={styles.textInput} 
                defaultValue={this.state.pbiAcc}
                autoCapitalize= 'none'
                returnKeyType = "next"
                onChangeText={(text) =>{
                    this.setState({pbiAcc:text});
                }}/>
            </Container>
             <Container>
            <View>
                <Label text="Estimate" />
                        <RadioForm
                            radio_props={radio_props}
                            initial={this.state.passedVal -1}
                            onPress={(value) => {this.setState({passedVal:value})}}/>
                    </View>
        </Container>
            <View style={styles.footer}>
                <Container>
                    <Button 
                        label="Edit PBI"
                        styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                        onPress={this.toCreatePBI.bind(this)} />
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
              role: this.state.role,

            }
        });
    }

    toCreatePBI(){
    var desc = this.state.pbiDescription;
    var us = this.state.pbiUserStory;
    var acc = this.state.pbiAcc;
    var correctEstimate = "";
    var correctValue = this.state.passedVal;
    if(correctValue==0){
        correctEstimate="";
    }
    if(correctValue==1){
        correctEstimate="S";
    }
    if(correctValue==2){
        correctEstimate="M";
    }
    if(correctValue==3){
        correctEstimate="L";
    }
    if(correctValue==4){
        correctEstimate="XL";
    }
        var done=false;
        var once = false;
     
        if(once != true){

        this.pblRef.on("value", (snapshot) => {
            snapshot.forEach((child) => {
              
            if(desc=="" && us=="" && once!=true ){
                var correctUserName = this.state.username;
                var correctProjKey = this.state.projectKey;
                var correctRole = this.state.role;
                var correctProjectName = this.state.projectName;
                done = true;  
                once = true; 
                        AlertIOS.alert(
                            'Error!',
                            'All required fields must be filled!',
                            [
                            {text: 'Okay', onPress: () => this.props.navigator.push({
                                    title: 'Edit Project Item',
                                    component: EditPBL,
                                    passProps:{
                                        username: correctUserName,
                                        projectKey: correctProjKey,
                                        projectName: correctProjectName,
                                        ac: this.props.ac,
                                        estimate: this.props.estimate,
                                        userStory: this.props.userStory,
                                        description: this.props.description,
                                        location: this.props.location,
                                        passedVal: this.props.estimateVal,
                                        pblKey: this.props.pblKey,
                                        role: correctRole,
                                }
                            }), style: 'cancel'},
                            ]   
                            );       
                        }
                       
                     if(once!=true){
                        var correctProjKey =  this.state.projectKey;
                        var currentStatus = "productBacklog";
                        var currentPriority = child.val().priority;
                        var correctProjectName = this.state.projectName;
                        var correctUserName = this.state.username;
                        var correctProjKey = this.state.projectKey;
                        var correctRole = this.state.role;
                        var kkkey = this.state.pblKey;
                        
                        var thiskey;
                        console.log("CHILD>KEY" + child.key);
                        console.log("&&&&&&&&&&pblkey" + this.state.pblKey);
                        if(child.key==kkkey){
                            thiskey=child.val();
                            once=true;
                            child.ref.update( { acc : acc ,
                                _userStory: us,
                                description: desc,
                                estimate: correctEstimate,
                                project: correctProjKey,
                                key: correctProjKey,
                                location: currentStatus,
                                priority: currentPriority}
                            );
                            AlertIOS.alert(
                                'Success!',
                                    'Project Item has been edited!',
                                [
                                    {text: 'Okay', onPress: () => this.props.navigator.push({
                                            title: 'Scrum Board',
                                            component: ScrumBoard,
                                            passProps:{
                                                username: correctUserName,
                                                projectKey: correctProjKey,
                                                projectName: correctProjectName,
                                                ac: this.props.ac,
                                                estimate: correctEstimate,
                                                userStory: this.props.userStory,
                                                description: this.props.description,
                                                location: this.props.location,
                                                role: this.state.role,
                                        }
                                    }), style: 'cancel'},
                                    ]
                           );
                           return;
                        }
                    }
                });
            });
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