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
                ac: this.props.ac,
                role: this.props.role,
                estimate: this.props.estimate,
                userStory: this.props.userStory,
                description: this.props.description,
                location: this.props.location,
                passedVal: this.props.estimateVal,
                pbiDescription: "",
                pbiUserStory: "",
                pbiAcc: "",
                pbiEstimate: "",
                pbiStatus: "",
               
            };
            console.log("********?????????passed value"+this.state.passedVal);
             console.log(this.state.userStory);
            this.pblRef = this.getRef().child('prodBacklogs');
            this.projectsRef = this.getRef().child('projects');
         //   this.shouldSetInputTextToDefaultValue = this.shouldSetInputTextToDefaultValue.bind (this); // bind method's 'this' to the instance
 
        }

        getRef() {
            return firebaseApp.database().ref();
        }

//  shouldSetInputTextToDefaultValue (props)
//     {
//         var result =
//             this.previousDefaultText        != props.ac ||
//             this.proviousChangeIndicator    != props.changeIndicator;
//         return result;
//     }

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
                 defaultValue={this.state.description}
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
              
                defaultValue={this.state.userStory}
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
                defaultValue={this.state.ac}
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
                            onPress={(value) => {this.setState({value:value})}}/>
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

            }
        });
    }

    toCreatePBI(){
      
        var pbiDescript = this.state.description;
        var pbiUserStory = this.state.userStory;
        var pbiAcc = this.state.ac;
        var correctEstimate = "";
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
              // console.log("****"+child.val().description);
               console.log("****Description"+pbiDescript);
               console.log("****Child Description"+child.val().description);
               if(pbiDescript!=""&&child.val().description == pbiDescript && once!=true){
                    console.log("********SUCCESS LOOP*********");
                    var correctProjKey =  this.state.projectKey;
                   
                    done=true;
                    once=true;
                    var currentStatus = "productBacklog";
                    var currentPriority = child.val().priority;
                     console.log("********prior"+correctProjKey);
                  var correctProjectName = this.state.projectName;
      var correctUserName = this.state.username;
    var correctProjKey = this.state.projectKey;
var correctRole = this.state.role;
 var correctProjectName = this.state.projectName;
      
  
if(this.state.pbiDescription!=""){
pbiDescript = this.state.pbiDescription;
}
if(this.state.pbiUserStory!=""){
        pbiUserStory = this.state.pbiUserStory;
}
if(this.state.pbiAcc!=""){
        pbiAcc = this.state.pbiAcc;
}
if(this.state.pbiEstimate!=""){
        pbiEstimate = this.state.pbiEstimate;
}
       // console.log("****3"+correctProjKey);
            once=true;
            //  this.pblRef.push( {acc : pbiAcc ,
            //            _userStory: pbiUserStory,
            //             description: pbiDescript,
            //             estimate: pbiEstimate,
            //            project: correctProjKey,
            //            location: currentStatus,
            // })
            console.log("?????????????? project key:  "+this.state.projectKey);
             child.ref.update( { acc : pbiAcc ,
                       _userStory: pbiUserStory,
                        description: pbiDescript,
                        estimate: correctEstimate,
                       project: correctProjKey,
                       key: correctProjKey,
                       location: currentStatus,
                       priority: currentPriority});
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
                else if(this.state.description=="" &&this.state.userStory=="" &&this.state.pbiDescription=="" && this.state.pbiUserStory=="" && once!=true){
                           var correctUserName = this.state.username;
    var correctProjKey = this.state.projectKey;
var correctRole = this.state.role;
 var correctProjectName = this.state.projectName;
    console.log("****2"+correctProjKey);
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
                                  
                                    role: correctRole,
                                }
                                   
                   }), style: 'cancel'},
                        ]
                            );
                       
                     
                        }
                          else if(this.state.pbiDescription=="" && this.state.pbiUserStory=="" && once!=true){
                           var correctUserName = this.state.username;
    var correctProjKey = this.state.projectKey;
var correctRole = this.state.role;
 var correctProjectName = this.state.projectName;
                        console.log("****2"+correctProjKey);
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
                                  role: correctRole,
                                }
                                   
                   }), style: 'cancel'},
                        ]
                            );
                       
                     
                        }
                    
    
                        else{}

        });
          
 if(done == false && once!=true){
       var correctUserName = this.state.username;
    var correctProjKey = this.state.projectKey;
var correctRole = this.state.role;
 var correctProjectName = this.state.projectName;
              AlertIOS.alert(
                           'Error!',
                            'The product backlog item you are attempting to edit does not exist!',
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
                role: correctRole,
                                }

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
// UncontrolledTextInput.propTypes =
// {
//     defaultText:        React.PropTypes.any,                // Default input text field value, written when it changes or when the changeIndicator changes.  Note - .isRequired fails for an unknown reason
//     changeIndicator:    React.PropTypes.any,                // Optional indicator, which on change triggers a write of defaultText to the text input field
//     onBlur:             React.PropTypes.func.isRequired,    // Method to capture user-edited value on exit from field
//     inputProps:         React.PropTypes.any                 // attributes you want to pass to the input text element, for example {{className = "'form-control'"}}
// };
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