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
import Register from './Register';
import navigator from './Navigation';
import config from '../../config';
import Login from './Login';
import firebaseApp from '../../node_modules/firebase/';
import firebase from 'firebase/app';

//const ActionButton = require('../components/ActionButton');
const StatusBar = require('../components/StatusBar');

//import * as firebaseConfig from 'firebase';
//const firebaseApp = firebase.initializeApp(firebaseConfig);
//const firebaseApp = Login.getFirebaseInstance;
 export default class NewProjectFunc extends Component {
        constructor(props) {
            super(props);

            this.state = {
                username:this.props.username,
                projectname: "",
                projectdesc: "",
                once: false,
            };
            this.projectsRef = this.getRef().child('projects');
        }

        getRef() {
            return firebaseApp.database().ref();
        }

    render() {
       console.log("ONCER: " + this.state.once);
        return (
            <ScrollView style={styles.scroll}>
            <Container>
                <StatusBar title="New Project Form" />
            </Container>
            <Container>
             <Label text="Project Name" />
                 <TextInput
                style={styles.textInput} 
                autoCapitalize= 'none'
                returnKeyType = "next"
                autoFocus = {true}
                onChangeText={(text) =>{
                    this.setState({projectname:text});
                }}/>
            </Container>
	     <Container>
             <Label text="Description" />
                 <TextInput
                style={styles.textInput2} 
                autoCapitalize= 'none'
                returnKeyType = "next"
                autoFocus = {true}
                onChangeText={(text) =>{
                    this.setState({projectdesc:text});
                }}/>
            </Container>
            <View style={styles.footer}>
                <Container>
                    <Button 
                        label="Create Project"
                        styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                        onPress={this.toProject.bind(this)} />
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
        this.props.navigator.push({
            title: 'Add Project',
            component: NewProjectFunc
        });
    }

    toProject(){
        var projName = this.state.projectname;
        var projDescription = this.state.projectdesc;
        var done = false;
        var once = this.state.once;
        console.log("ONCE1: " + once);
        if(once != true){

        this.projectsRef.on("value", (snapshot) => {
            console.log("ProjName " + projName);
            snapshot.forEach((child) => {
                if(child.val().name == projName && once!=true){
                    done=true;
                    console.log(projName);
                    AlertIOS.alert(
                        'Error!',
                        'Project name already exists!',
                        [
                            {text: 'Okay', onPress: () => console.log('Okay'), style: 'cancel'},
                        ]
                        );
                        return;
                }
                else if(projName==""){
                    done = true;   
                    AlertIOS.alert(
                        'Error!',
                        'All required fields must be filled!',
                        [
                            {text: 'Okay', onPress: () => console.log('Okay'), style: 'cancel'},
                        ]
                        );                     
                    }
                else{

                            // console.log("*************************ELSE*********************");
                            // //  onPress = (text) => {
                            //     console.log("*************************ON PRESS*********************");
                            //     //this.toRegister.bind(this);
                            //     console.log("*************************GOOD TO GO*********************");
                            //     // }
                }

                        //  }
            });

         });
        if(done == false){
            var correctUserName = this.state.username;
           this.state.once=true;
            once=true;
            this.projectsRef.push({ description : projDescription,
            name: projName, users: {
                [correctUserName]: true,
            }})
            AlertIOS.alert(
                        'Success!',
                        'Click Okay to return Home',
                        [
                            {text: 'Okay', onPress: () => this.props.navigator.push({
                                    title: 'Home',
                                    component: Home,
                                    passProps:{
                                        username: correctUserName
                                    }
                   }), style: 'cancel'},
                        ]
                        );            
            }
        }   
    }
//end of class
}

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