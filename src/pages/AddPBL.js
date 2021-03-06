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
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

const StatusBar = require('../components/StatusBar');
 var correctEstimate = "";
var radio_props = [
 // {label: '', value: 0 },
  {label: 'S', value: 1 },
  {label: 'M', value: 2 },
  {label: 'L', value: 3},
   {label: 'XL', value: 3}
];
export default class AddPBL extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: this.props.username,
            projectKey: this.props.projectKey,
            projectName: this.props.projectName,
            pblRole: this.props.role,
            pbiDescription: "",
            pbiUserStory: "",
            pbiAcc: "",
            pbiEstimate: "",
            pbiStatus: "",
            
        };
        //  console.log("****first"+this.state.projectName);
            
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
            <StatusBar title="Product Backlog Item" />
        </Container>
        <Container>
            <Label text="Description" />
                <TextInput
            style={styles.textInput} 
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
            autoCapitalize= 'none'
                returnKeyType = "next"
            onChangeText={(text) =>{
                this.setState({pbiUserStory:text});
            }}/>
        </Container>
        <Container>
            <Label text="Acceptance Criteria" />
                <TextInput
            style={styles.textInput} 
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
                            initial={-1}
                            onPress={(value) => {this.setState({value:value})}}/>
                    </View>
        </Container>
        <View style={styles.footer}>
            <Container>
                <Button 
                    label="Create PBI"
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
    var correctRole=this.state.pblRole;
    this.props.navigator.push({
            title: 'Scrum Board',
        component: ScrumBoard, 
        passProps:{
            username: correctUserName,
            projectKey: correctProjKey,
            projectName: correctProjectName,
            role: correctRole,
        }

        });
}

toCreatePBI(){
    
    var pbiDescript = this.state.pbiDescription;
    var pbiUserStory = this.state.pbiUserStory;
    var pbiAcc = this.state.pbiAcc;
    var correctRole=this.state.pblRole;
    var correctUserName=this.state.username;
    var correctProjKey=this.state.projectKey;
    //var pbiEstimate = this.state.pbiEstimate;
    
    var correctValue = this.state.value;
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
        //done = false;
        snapshot.forEach((child) => {
        //   console.log("****"+child.val().description);
        //     console.log("****"+pbiDescript);
            //  var correctProjKey =  this.state.projectKey;
            if(pbiDescript!=""&&child.val().description == pbiDescript && once!=true){
                var correctUserName = this.state.username;
                var correctRole = this.state.pblRole;
                var correctProjKey =  this.state.projectKey;
                 var correctProjectName = this.state.projectName;
            //     console.log("****1"+correctProjKey);
                done=true;
                once=true;
                AlertIOS.alert(
                        'Error!',
                        'User story already exists!',
                        [
                        {text: 'Okay', onPress: () => this.props.navigator.push({
                                title: 'New Project Item',
                                component: AddPBL,
                                passProps:{
            username: correctUserName,
            projectKey: correctProjKey,
            projectName: correctProjectName,
             role: correctRole,
        }

                }), style: 'cancel'},
                    ]
                        );
                        return;
            }
            else if(pbiDescript!="false" && pbiDescript=="" && pbiUserStory=="" && once!=true){
                    var correctProjKey = this.state.projectKey;
                    var correctUserName = this.state.username;
                    var correctRole = this.state.pblRole;
                    var correctProjectName = this.state.projectName;
                    //console.log("****2"+correctProjKey);
                    done = true;  
                    once = true; 
                    AlertIOS.alert(
                        'Error!',
                        'All required fields must be filled!',
                        [
                        {text: 'Okay', onPress: () => this.props.navigator.push({
                                title: 'New Project Item',
                                component: AddPBL,
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
                

                    else{}

    });
        
if(done == false && once!=true){
    var currentStatus = "productBacklog";
    var correctProjectName = this.state.projectName;
    var correctUserName = this.state.username;
    var correctProjKey = this.state.projectKey;
    var correctRole = this.state.pblRole;
   once=true;
    var second=false;
    
    var size = 0;
        
   // this.projectsRef.on("value", (snapshot) => {
       // snapshot.forEach((child) => {
       //     console.log("****existing project"+child.key);
           // console.log("****added project"+correctProjKey);
       
            this.pblRef.on("value", (snapshot)=>{   
                snapshot.forEach((child)=>{
                    child.forEach(function(data){
                        var column=data.key;
                        // console.log("****column******"+column);
                    
                        if(column=='project'){
                            console.log("****IF LOOP1******");
    
                            data.forEach(function(data1){
                                console.log("****what we want******"+ data1.key);
                            });
    
                            if(correctProjKey==data.val()){
                                console.log("****FINAL LOOP******");
                                size=size+1;
                            }
                    
                        }
                    });

                });

            });
        
            
                    // snapshot.forEach((child) => {
        // size=snapshot.numChildren()+1;
                    //});
        // second = true;
                
        //    });
//    });
    
    console.log("****size"+size);
    
            this.pblRef.push( {acc : pbiAcc ,
                    _userStory: pbiUserStory,
                    description: pbiDescript,
                    estimate: correctEstimate,
                    key: correctProjKey,
                    project: correctProjKey,
                    location: currentStatus,
                    priority: size,
                    tasks: {placeholder:''},
        })
            AlertIOS.alert(
                    'Success!',
                    'Click View to Updated Scrum Board',
                    [
                        {text: 'Okay', onPress: () => this.props.navigator.push({
                                title: 'Scrum Board',
                                component: ScrumBoard,
                                passProps:{
            username: correctUserName,
            projectKey: correctProjKey,
            projectName: correctProjectName,
            role: correctRole,
        },
                                
                }), style: 'cancel'},
                    ]
                    );         
        
        }
            
                    
    //  if(child.val().id!=inputUserName && inputUserName != "" && inputPassword != "" && confirmPassword !="" && inputPassword==confirmPassword){
                    
        // }     

//  console.log("**********************ex user"+existingUser)
        
        });
        

    }   
//}
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